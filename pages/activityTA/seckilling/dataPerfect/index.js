// pages/activity/seckilling/dataPerfect/index.js
import ActivityModel from '../../activity-model'
import activityModel from '../../activity-model'
import apiSettings from '../../../../utils/ApiSetting.js'
import util from '../../../../utils/util.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTop: app.globalData.navHeight,
    isInfoPopup: 1,
    photographTime: '年/月', //时间
    unionId: app.globalData.unionid, //用户小程序unionld
    manPhone: '',//新郎电话
    manName: '',//新郎名称
    manId: '',//新郎身份证
    ladyPhone: '',//新娘电话
    ladyName: '',//新娘名称
    ladyId: '',//新娘身份证
    province: '',//省代码
    provinceName: '',//省名称
    city: '',//市代码
    cityName: '',//市名称
    isXlPhone: false,//新郎手机号判断
    isXlId: false,//新郎身份证
    isXnId: false,//新娘身份证
    isXnPhone: false,//新娘手机号
    isButton: false,
    isLoading: false,//加载
    info_data: [],
    backCustom: {
      path: "/pages/activityTA/photographyActivity/index",
      type: 'navigate'
    }
  },
  // 获取cityPicker data
  getRegion(e) {
    let data = e.detail
    this.setData({
      province: data.provinceCode,
      provinceName: data.province,
      city: data.cityCode,
      cityName: data.city
    })
    this.submitData()
    console.log("地址 >", data, this.data.region)
  },
  // 提交数据
  getConfirm () {
    this.submitData(1)
    if (this.data.isButton) {
      if (!this.data.isXlPhone) {
        this.getShowToast('新郎手机号非法或不正确')
        return
      }
      if (!this.data.isXlId) {
        this.getShowToast('新郎身份证输入有误')
        return
      }
      if (!this.data.isXnPhone) {
        this.getShowToast('新娘手机号非法或不正确')
        return
      }
      if (!this.data.isXnId) {
        this.getShowToast('新娘身份证输入有误')
        return
      }
      this.setData({
        isLoading: true
      })
      wx.request({
        url: apiSettings.getImproveInfo,
        data: {
          id: this.data.info_data.id,
          unionId: this.data.unionId,
          manName: this.data.manName,
          manPhone: this.data.manPhone,
          manId: this.data.manId,
          ladyId: this.data.ladyId,
          ladyName: this.data.ladyName,
          ladyPhone: this.data.ladyPhone,
          city: this.data.city,
          cityName: this.data.cityName,
          province: this.data.province,
          provinceName: this.data.provinceName,
          photographTime: this.data.photographTime
        },
        header: {
          "Content-Type": "application/json",
        },
        method: "POST",
        success: data => {
          this.setData({
            isLoading: false
          })
          if (data.data.code==200) {
            wx.showToast({
              title: "资料保存成功",
              duration: 1500
            });
            this.getQueryData('00')
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.back) {
      console.log(options.back)
      this.setData({
        backCustom: {
          path: options.back,
          type: 'navigate'
        }
      })
    }
    this.setData({
      unionId: app.globalData.unionid
    })
    this.getQueryData(options.way)
  },
  // 去预约
  schedulingLink () {
      if (this.data.info_data.state==1) {
        wx.request({
          url: apiSettings.getActivityMsOrder,
          data: {
              id: this.data.info_data.id,
          },
          header: {
              "Content-Type": "application/json",
          },
          method: "POST",
          success: res => {
              if (res.data.code==200) {
                if (res.data.result) {
                  wx.navigateTo({
                    url: res.data.result.activityMsOrder.appointmentType==0?'/pages/activityTA/scheduling/scheduling?no='+res.data.result.activityMsOrder.orderNo:'/pages/activityTA/scheduling/schedulingDetail/schedulingDetail?orderNo='+res.data.result.activityMsOrder.orderNo,
                  })
                } else {
                  wx.showToast({
                    title: '订单正在处理',
                    icon: 'none',
                    duration: 1500
                  });
                }
              } else {
                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1500
                });
              }
          }
      })
    }
  },
  getQueryData (val) {
    console.log("val >>", val)
    wx.request({
      url: apiSettings.queryInfoData,
      data: {
        unionId:this.data.unionId,
        // state: val == "00" || val == "01" ? '1' : "0",
        channel: val,
        activityId: app.globalData.actId ? app.globalData.actId : ""
      },
      header: {
        "Content-Type": "application/json",
      },
      method: "POST",
      success: data => {
        if (data.data.code == 200) {
          this.setData({
            info_data: data.data.result[0]
          })
        }
        console.log(data, 'data')
      }
    })
  },
  // 判断是否可以提交资料
  submitData (num) {
    if (this.data.unionId&&this.data.photographTime!='年/月'&&this.data.manId!=''&&this.data.manName!=''&&this.data.manPhone!=''&&this.data.ladyId!=''&&this.data.ladyName!=''&&this.data.ladyPhone!=''&&this.data.city!=''&&this.data.cityName!=''&&this.data.province!=''&&this.data.provinceName!='') {
      this.setData({
        isButton: true
      })
    } else {
      if (num==1) {
        if (!this.data.manName) {
          this.getShowToast('请输入新郎姓名')
        } else if (!this.data.manPhone) {
          this.getShowToast('请输入新郎手机号')
        } else if (!this.data.manId) {
          this.getShowToast('请输入新郎身份证')
        } else if (!this.data.ladyName) {
          this.getShowToast('请输入新娘姓名')
        } else if (!this.data.ladyPhone) {
          this.getShowToast('请输入新娘手机号')
        } else if (!this.data.ladyId) {
          this.getShowToast('请输入新娘身份证')
        } else if (!(this.data.cityName&&this.data.city&&this.data.provinceName&&this.data.province)) {
          this.getShowToast('请选择所在城市')
        } else if (this.data.photographTime=='年/月') {
          this.getShowToast('请选择期待拍摄日期')
        }
      }
    }
  },
  getShowToast (data) {
    wx.showToast({
      title: data,
      icon: 'none',
      duration: 1500
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  focusData () {
    this.selectComponent("#cityPicker").closeSelect();
  },
  // this.selectComponent("#cityPicker").closeSelect();
  // 新郎姓名
  getmanName (e) {
    this.setData({
      manName: e.detail.value
    })
    this.submitData()
  },
  // 新郎手机号
  getmanPhone (e) {
    this.setData({
      manPhone: e.detail.value
    })
    if (e.detail.value.length==11) {
      if (!/^1[123456789]\d{9}$/.test(e.detail.value)) {
        this.setData({
          isXlPhone: false,
        })
        this.getShowToast('请输入正确的手机号')
      } else {
        this.setData({
          isXlPhone: true,
        })
      }
    } else {
      this.setData({
        isXlPhone: false,//新郎手机号判断
      })
    }
    this.submitData()
  },
  // 新郎身份证号
  getmanId (e) {
    this.setData({
      manId: e.detail.value
    })
    if (e.detail.value.length==18) {
      let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      if (reg.test(e.detail.value) == false) {
        this.setData({
          isXlId: false,
        })
        this.getShowToast('新郎身份证输入有误')
      } else {
        this.setData({
          isXlId: true,
        })
      }
    } else {
      this.setData({
        isXlId: false,
      })
    }
    this.submitData()
  },
  // 新娘姓名
  getladyName (e) {
    this.setData({
      ladyName: e.detail.value
    })
    this.submitData()
  },
  // 新娘手机号
  getladyPhone (e) {
    this.setData({
      ladyPhone: e.detail.value
    })
    if (e.detail.value.length==11) {
      if (!/^1[123456789]\d{9}$/.test(e.detail.value)) {
        this.setData({
          isXnPhone: false,
        })
        this.getShowToast('请输入正确的手机号')
      } else {
        this.setData({
          isXnPhone: true,
        })
      }
    } else {
      this.setData({
        isXnPhone: false,//新郎手机号判断
      })
    }
    this.submitData()
  },
  // 手机号授权
  getPhoneNumber(e) {
    console.log(e)
    ActivityModel.getUnionid().then(() => {
      wx.request({
        url: apiSettings.Host + apiSettings.GetUserPhone,
        method: 'POST',
        data: {
          encryptedDataStr: e.detail.encryptedData,
          ivStr: e.detail.iv,
          keyBytesStr: app.globalData.session_key,
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: res => {
          if (res.data.code !== 200 || !res.data.result.phoneNumber) {
            this.setData({
              loadingStatus: false,
              showErrPhone: true
            })
            wx.showModal({
              title: '提示',
              content: '需要用过授权才能：获得拍摄资格，请重新点击并授权',
              showCancel: false,
              success (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            })
            return
          } else {
          }
          app.globalData.userInfo.mobileNo = res.data.result.phoneNumber
          wx.showToast({
            title: '授权成功'
          });
          this.setData({
            getPhone: true,
            phoneNo: res.data.result.phoneNumber,
            showErrPhone: false
          })
          wx.request({
            url: apiSettings.Updatauser,
            data: {
              unionId: app.globalData.unionid,
              mobileNo: res.data.result.phoneNumber
            },
            header: {
              "Content-Type": "application/json",
              accessToken: app.globalData.mtq_token
            },
            method: 'POST',
            success: data => {
              // this.setData({
              //   getPhone: false,
              //   phoneNo: res.data.result.phoneNumber
              // })
            }
          })
        },
        fail: res => {
          this.setData({
            showErrPhone: true
          })
        }
      })
    })
  },
  // 新娘身份证号
  getladyId (e) {
    this.setData({
      ladyId: e.detail.value
    })
    if (e.detail.value.length==18) {
      let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      if (reg.test(e.detail.value) == false) {
        this.setData({
          isXnId: false,
        })
        this.getShowToast('新娘身份证输入有误')
      } else {
        this.setData({
          isXnId: true,
        })
      }
    } else {
      this.setData({
        isXnId: false
      })
    }
    this.submitData()
  },
  // 时间选择
  bindDateChange (e) {
    this.selectComponent("#cityPicker").closeSelect();
    this.setData({
      photographTime: e.detail.value
    })
    this.submitData()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '泰安鲜檬0元婚纱摄影',
      path: `/pages/activityTA/photographyActivity/index?actId=${app.globalData.actId ? app.globalData.actId : ""}`,
      imageUrl: "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/activity/seckill_ta/share-img.jpg"
    }
  }
})
