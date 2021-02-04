import apiSettings from '../../../../utils/ApiSetting'
import { Diy } from '../diy-model'

var app = getApp()
var diyModel = new Diy()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo: '',
    amount: 0,
    couponPrice: 0,
    isPay: false,
    come: "", // 订单来源
    isEndPay: "", // 判断尾款支付 0 || ""：不是尾款支付 1：是尾款支付
    tabCode: "", // 金银卡区分 gold：金卡   silver：银卡
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderNo: options.order_no,
      amount: options.amount,
      couponPrice: Number(options.couponPrice).toFixed(2),
      come: options.come ? options.come : "",
      payType: options.payType ? options.payType : "",
      tabCode: options.tabCode
    })
    // payType 支付类型（1：定金、2：全款 3：尾款）
    console.log("options >>", options, options.payType)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  async toLcgPay() {
    if (this.data.isPay) return;
    this.setData({
      isPay: true
    })
    console.log("topay2 >>", this.data.payType)
    const that = this
    let signRes = await diyModel.getSign()
    let lcgPayRequestUrl = "",
        apiUrl = this.data.payType == "2" ? apiSettings.lcg_singlePay : apiSettings.lcg_multiPay,
        params = {
          token: signRes.result,
          paymentType: this.data.payType != "2" ? "3" : "2",
          orderNo: this.data.orderNo,
          orderAmount: this.data.amount
        }
    diyModel.updatePayMethod(params).then(res => {
      console.log("update payment res >>", res)
    })
    diyModel.lcgPay(apiUrl, this.data.orderNo).then(res => {
      console.log(res)
      this.setData({ isLoading: false })
      lcgPayRequestUrl = res.data ? res.data.mercOrdMsg : {}
      console.log("resquestUrl >>", lcgPayRequestUrl)
      if (lcgPayRequestUrl == null || lcgPayRequestUrl == "") {
        wx.showToast({
          title: '唤起支付失败，请稍后重试或联系客服查看',
          icon: 'none',
          duration: 2000,
          mask: true,
          complete: () => {
            that.setData({
              isPay: false
            })
          }
        });
        return
      }
      wx.login({
        success: (result) => {
          wx.request({
            url: `${lcgPayRequestUrl}`,
            header: {
              'content-type': 'application/json'
            },
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: (result) => {
              const res = result;
              console.log("LCG_PAY res >>", res)
              if (res.data.SUCCESS == "true") {
                wx.requestPayment({
                  nonceStr: res.data.nonceStr,
                  package: res.data.package,
                  paySign: res.data.paySign,
                  signType: res.data.signType,
                  timeStamp: res.data.timeStamp,
                  success: res => {
                    console.log('支付成功', res);
                    that.setData({
                      isPay: false
                    })
                    app.globalData.mta.Event.stat("c_mtq_dynamics_photography_paymentresult", {
                      status: true
                    })
                    if (that.data.come == 'member') {
                      app.globalData.mta.Event.stat('c_mtq_activity_member', {
                        'successbuy': 'true' + `-${that.data.tabCode ? that.data.tabCode : ""}`
                      })
                      if (that.data.tabCode == "gold") {
                        // 获取微信卡券列表的数据
                        wx.request({
                          url: apiSettings.Host + apiSettings.getWxCardParam + "?unionId=" + app.globalData.unionid,
                          method: 'POST',
                          header: {
                            "Content-Type": "application/x-www-form-urlencoded"
                          },
                          success: res => {
                            console.log(res.data)
                            diyModel.getUserPhoneByUnionId()
                            if (res.data.code != 200) {
                              return wx.redirectTo({
                                url: `/mine/order/detail/detail?orderNo=${that.data.orderNo}&status=2&come=${that.data.come}`
                              })
                            }
                            let _res = res.data.result ? res.data.result : {},
                              cardExt = {
                                "code": _res.code ? _res.code : "",
                                "openid": _res.openid ? _res.openid : "",
                                "timestamp": _res.timestamp ? _res.timestamp + "" : "",
                                "nonce_str": _res.nonce_str ? _res.nonce_str : "",
                                "signature": _res.signature ? _res.signature : ""
                              }
                            wx.addCard({
                              cardList: [{
                                "cardExt": JSON.stringify(cardExt),
                                "cardId": _res.cardId
                              }],
                              success(res) {
                                console.log("卡券成功>>", res) // 卡券添加结果
                                // 记录用户领券的卡券
                                wx.request({
                                  url: apiSettings.Host + apiSettings.updateWxCard + "?unionId=" + app.globalData.unionid,
                                  method: 'POST',
                                  header: {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                  },
                                  success: res => {
                                    console.log(res)
                                  },
                                  fail: err => {
                                    console.log(err)
                                  }
                                })
                                wx.redirectTo({
                                  url: `/mine/order/detail/detail?orderNo=${that.data.orderNo}&status=2&come=${that.data.come}`
                                })
                              },
                              fail(err) {
                                console.log("卡券失败>>", err)
                                wx.showToast({
                                  title: '若卡券领券失败，您可联系客服重新获取',
                                  icon: 'none',
                                  duration: 1500,
                                  mask: true
                                });
                                let timer = setTimeout(() => {
                                  clearTimeout(timer)
                                  wx.redirectTo({
                                    url: `/mine/order/detail/detail?orderNo=${that.data.orderNo}&status=2&come=${that.data.come}`
                                  })
                                }, 1500)
                              }
                            })
                          },
                          fail: err => {
                            console.log(err)
                          }
                        })
                      } else {
                        wx.redirectTo({
                          url: `/mine/order/detail/detail?orderNo=${that.data.orderNo}&status=2`
                        })
                      }
                    } else {
                      wx.redirectTo({
                        url: `/mine/order/detail/detail?orderNo=${that.data.orderNo}&status=2`
                      })
                    }
                  },
                  fail: err => {
                    app.globalData.mta.Event.stat("c_mtq_dynamics_photography_paymentresult", {
                      status: false
                    })
                    console.log('支付失败', err);
                    that.setData({
                      isPay: false
                    })
                  }
                })
              } else {
                wx.showToast({
                  title: '获取支付参数失败',
                  icon: 'none'
                })
                that.setData({
                  isPay: false
                })
              }
            }
          });
        },
        fail: () => {
          console.log('获取code失败')
          that.setData({
            isPay: false
          })
        }
      });
    })
  },

  toPay() {
    // wx.redirectTo({
    //     url: '../paypage/paypage?order_no=' + this.data.orderNo
    // });
    if (this.data.isPay) return;
    this.setData({
      isPay: true
    })
    const that = this;
    wx.login({
      success: (result) => {
        wx.request({
          // url: 'https://ns.hucais.com.cn/payment/getWeiXinBill4PictureRoom.shtml',
          url: `https://d.api.xm520.com/payment/wechat/wechatAppletPayment?orderNo=${this.data.orderNo}&openid=${app.globalData.openid}&appId=wx059f9118f045da79`,
          // data: {
          //     orderNo: this.data.orderNo,
          //     code: result.code
          //     // openid: app.globalData.openid
          // },
          header: {
            'content-type': 'application/json'
          },
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: (result) => {
            const res = result.data;
            if (res.code == 200) {
              let _this = this
              var data = res.data;
              wx.requestPayment({
                nonceStr: data.nonceStr,
                package: data.package,
                paySign: data.paySign,
                signType: data.signType,
                timeStamp: data.timeStamp,
                success: res => {
                  console.log('支付成功', res);
                  that.setData({
                    isPay: false
                  })
                  app.globalData.mta.Event.stat("c_mtq_dynamics_photography_paymentresult", {
                    status: true + `-${this.data.tabCode ? this.data.tabCode : ""}`
                  })
                  if (this.data.come == 'member') {
                    app.globalData.mta.Event.stat('c_mtq_activity_member', {
                      'successbuy': 'true' + `-${this.data.tabCode ? this.data.tabCode : ""}`
                    })
                    // 获取微信卡券列表的数据
                    wx.request({
                      url: apiSettings.Host + apiSettings.getWxCardParam + "?unionId=" + app.globalData.unionid,
                      method: 'POST',
                      header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                      },
                      success: res => {
                        console.log(res.data)
                        diyModel.getUserPhoneByUnionId()
                        if (res.data.code != 200) {
                          return wx.redirectTo({
                            url: `/mine/order/detail/detail?orderNo=${this.data.orderNo}&status=2&come=${_this.data.come}`
                          })
                        }
                        let _res = res.data.result ? res.data.result : {},
                          cardExt = {
                            "code": _res.code ? _res.code : "",
                            "openid": _res.openid ? _res.openid : "",
                            "timestamp": _res.timestamp ? _res.timestamp + "" : "",
                            "nonce_str": _res.nonce_str ? _res.nonce_str : "",
                            "signature": _res.signature ? _res.signature : ""
                          }
                        wx.addCard({
                          cardList: [{
                            "cardExt": JSON.stringify(cardExt),
                            "cardId": _res.cardId
                          }],
                          success(res) {
                            console.log("卡券成功>>", res) // 卡券添加结果
                            // 记录用户领券的卡券
                            wx.request({
                              url: apiSettings.Host + apiSettings.updateWxCard + "?unionId=" + app.globalData.unionid,
                              method: 'POST',
                              header: {
                                "Content-Type": "application/x-www-form-urlencoded"
                              },
                              success: res => {
                                console.log(res)
                              },
                              fail: err => {
                                console.log(err)
                              }
                            })
                            wx.redirectTo({
                              url: `/mine/order/detail/detail?orderNo=${_this.data.orderNo}&status=2&come=${_this.data.come}`
                            })
                          },
                          fail(err) {
                            console.log("卡券失败>>", err)
                            wx.showToast({
                              title: '若卡券领券失败，您可联系客服重新获取',
                              icon: 'none',
                              duration: 1500,
                              mask: true
                            });
                            let timer = setTimeout(() => {
                              clearTimeout(timer)
                              wx.redirectTo({
                                url: `/mine/order/detail/detail?orderNo=${_this.data.orderNo}&status=2&come=${_this.data.come}`
                              })
                            }, 1500)
                          }
                        })
                      },
                      fail: err => {
                        console.log(err)
                      }
                    })
                  } else {
                    wx.redirectTo({
                      url: `/mine/order/detail/detail?orderNo=${this.data.orderNo}&status=2`
                    })
                  }
                },
                fail: err => {
                  app.globalData.mta.Event.stat("c_mtq_dynamics_photography_paymentresult", {
                    status: false
                  })
                  console.log('支付失败', err);
                  that.setData({
                    isPay: false
                  })
                }
              })
            } else {
              wx.showToast({
                title: '获取支付参数失败',
                icon: 'none'
              })
              that.setData({
                isPay: false
              })
            }

          }
        });
      },
      fail: () => {
        console.log('获取code失败')
        that.setData({
          isPay: false
        })
      }
    });


  },

})
