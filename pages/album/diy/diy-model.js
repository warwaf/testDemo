import { Base } from '../../../utils/base.js'
import { codeToRegion, regionToCode } from '../../../utils/util'

var app = getApp()

class Diy extends Base {
    constructor() {
        super()
    }

    getSelfFaceId() {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetFaceIdByActivityId,
                method: 'POST',
                header: {
                    "Content-Type": "application/json"
                },
                data: {
                    "unionId": app.globalData.userInfo.unionId,
                    "activityId": app.globalData.activityInfo.activityId
                }
            }).then(res => {
                console.log(res)
                if (Boolean(res.result)) {
                    app.globalData.groupFaceId = res.result.groupFaceId
                    resolve(res.result)
                } else {
                    resolve(false)
                }
            })
        })
    }
    getGoosDetail(data) {
        const { CustomerNo, PartNo, CatalogNo } = data
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetGoosDetail + `?CustomerNo=${CustomerNo}&PartNo=${PartNo}&CatalogNo=${CatalogNo}&Scope=1`,
                method: 'post',
            }).then(res => {
                res.data.sort((a, b) => (a.ListPrice - b.ListPrice))
                resolve(res)
            })
        })
    }

    getGoodsDetail(data){
        const { type, partNo, catalogNo } = data
        return new Promise((resolve, reject) => {
            this.request({
                url:  `/admin/catalog/get?catalogNo=${catalogNo}&partNo=${partNo}&typeId=${type}`,
                method: 'get',
            }).then(res => {
                resolve(res)
            })
        })
    }
    getProducts(data) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetProductList + `?catalog_no=${data.catalog_no}&theme_id=0`,
                method: 'GET'
            }).then(res => {
                // res.forEach((item, index) => {
                //     if (item.combine_template_id == data.template_id) {
                        resolve(res[0])
                //     }
                // })
            })
        })
    }

    getSelfImage(faceId) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.ListImageByGroupFaceId,
                method: 'GET',
                data: {
                    activityId: app.globalData.activityInfo.activityId,
                    faceId
                }
            }).then(res => {
                resolve(res.result)
            })
        })
    }

    /**
     * 拿取本人上传图片
     */
    getUploadImage(activityId) {
        return new Promise((resolve, reject) => {
            return this.request({
                url: this.apiSettings.GetImageList,
                method: 'GET',
                data: {
                    unionId: app.globalData.unionid,
                    activityId: app.globalData.activityInfo.activityId
                }
            }).then(res => {
                resolve(res)
            })
        })
    }

    /**
     * 选图完成后调用
     */
    createDiy() {
        return new Promise((resolve, reject) => {
            var files = app.globalData.selectPhotos
            files.forEach((ele, index) => {
                files[index] = (ele.substr(0, ele.lastIndexOf('.')) + '_small' + ele.substr(ele.lastIndexOf('.'))).replace('origin/', 'origin/thumb/')
            });
            console.log(app.globalData.diyConfig);
            const data = {
                phone: app.globalData.userInfo.mobileNo,
                files: files.join(','),
                catalog_no: app.globalData.diyConfig.catalogNo, // CatalogNo
                template_id: app.globalData.diyConfig.templetNo, // templetNo
                // branchid: app.globalData.diyConfig.partNo, // partNo
                branchid: 'D8990', // partNo
                returnUrlView: '/pages/mine/diylist/diylist',
                returnUrlOrder: '/pages/album/diy/order/order',
                GoodsId: app.globalData.diyConfig.partNo // PartNo
            }
            if (app.globalData.diyConfig.catalogNo == '1007007') {
                data.single = 1;
                data.ttl_photos = app.globalData.diyConfig.maxPage;
            }
            // else {
            //     data.template_id = app.globalData.diyConfig.templetNo
            // }

            this.request({
                url: this.apiSettings.CreateDiy,
                method: 'post',
                data
            }).then(res => {
                console.log("diy url >>", res)
                resolve(res.url)
            })
        })
    }
    /**
     * 计算运费
     */
    calcCost(data) {
        const { storeId, shipCode, province, city } = data;
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.CalcCost + `?storeId=${storeId}&shipCode=${shipCode}&province=${province}&city=${city}`,
                method: 'GET',
            }).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    /**
     * 获取地址列表
     */
    getAddress(pageSize) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetAddress,
                data: {
                    unionId: app.globalData.unionid,
                        // unionId: 'oYnHqs51rx8cCNdCZVYUdC_yMjbs'
                    pageNum:1,
                    pageSize
                }
            }).then(res => {
                if(res.code == 200){
                    resolve(res.result.List)
                }
                // var codeAddress = res.result
                // codeToRegion(codeAddress).then(originAddress => {
                //     resolve({
                //         code: codeAddress,
                //         origin: originAddress
                //     })
                // })
            })
        })
    }

    saveAddress(addr, type = 0) {
        return new Promise((resolve, reject) => {
            regionToCode(addr).then(result => {
                this.request({
                    url: this.apiSettings.SaveAddress,
                    method: 'POST',
                    data: {
                        unionId: app.globalData.unionid,
                        // unionId: 'oYnHqs51rx8cCNdCZVYUdC_yMjbs',
                        type,
                        ...result
                    }
                }).then(res => {
                    resolve(res.result)
                })
            })
        })

    }
    /**
     * 新增地址
     */
    addAddress(data){
        return new Promise((resolve, reject) => {
            regionToCode(data).then(result => {
                this.request({
                    url: this.apiSettings.AddAddress,
                    method:'POST',
                    header:{ "Content-Type": "application/json" },
                    data:result
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(err);
                })
            })
        })
    }
    /**
     * 编辑地址
     * @param {*} data 
     */
    editAddress(data){
        return new Promise((resolve, reject) => {
            regionToCode(data).then(result => {
                this.request({
                    url: this.apiSettings.EditAddress,
                    method:'POST',
                    header:{ "Content-Type": "application/json" },
                    data:result
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(err);
                })
            })
        })

    }
     /**
     * 设置默认地址
     * @param {*} data 
     */
    setDefaultAddress(data){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.SetDefaultAddress,
                method:'POST',
                data
            }).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }
    /**
     * 删除地址
     * @param {*} id 
     */
    deleteAddress(id) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.DeleteAddress,
                data: {
                    id
                }
            }).then(res => {
                resolve(res.result)
            })
        })
    }

    /**
     * 获取订单信息
     */
    getOrderInfo(workId) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetDiyInfo + `?workId=${workId}&unionId=${app.globalData.unionid}`,
                method: 'POST'
            }).then(res => {
                resolve(res.result)
            })
        })
    }

    /**
     * 创建订单号
     */
    createOrder(data) {
        // var arr = app.globalData.activityInfo.deployRoom
        // var ship_rule = '';
        // arr.forEach(item => {
        //     if (item.productNo == data.ShopCart[0].part_no) {
        //         ship_rule = item.deliveryType
        //     }
        // })

        

        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.CreateOrder,
                header: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                data,
                // : {
                //     scope: "1",
                //     order_type: "N",
                //     ship_addr_no: "1",
                //     ship_menthod: ship_rule,
                //     note_text: app.globalData.roomInfo.room_no,
                //     customer_no: app.globalData.userInfo.memberId,
                //     event_id: app.globalData.activityInfo.activityId,
                //     ...data
                // }
            }).then(res => {
                resolve(res)
            })
        })
    }

    /**
     * 保存订单号
     */
    saveOrderNo(data) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.SaveOrderNo,
                header: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                data: {
                    ...data,
                    recommendation: app.globalData.sharePhone,
                    activityId: app.globalData.activityInfo.activityId,
                    voucherId: app.globalData.activityInfo.deployRoom[0].voucherId
                }
            }).then(res => {
                resolve(res)
            })
        })
    }

    /**
     * 查询代金券
     */
    queryCoupon(partNo) {
        console.log(partNo);
        let ActivityID = '',
            CatalogID = '';
        // app.globalData.activityInfo.deployRoom.map(item => {
        //     if (partNo == item.productNo) {
        //         ActivityID = item.voucherId;
        //         CatalogID = item.customerNo;
        //     }
        // })

        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.QueryCoupon,
                method: 'POST',
                data: {
                    CustomerNo: app.globalData.userInfo.memberId,
                    // ActivityID, //活动id
                    // CatalogID, // 产品id
                    // ActivityID: app.globalData.activityInfo.deployRoom[0].voucherId,
                    // CatalogID: app.globalData.activityInfo.deployRoom[0].customerNo,
                    State: 'Created',
                    pagesize: 99,
                    pageindex: 1
                }
            }).then(res => {
                if (res.code == 0) {
                    let vouchers = res.data, voucher_avabile = []
                    vouchers.forEach(item => {
                        // if (item.product[0].part_no == partNo && item.EventId == app.globalData.activityInfo.activityId) {
                        //     resolve(item)
                        //     return
                        // }
                        // item.product.map(items => {
                        //         if (items.part_no == partNo) {
                        //             resolve(item)
                        //             return;
                        //         }
                        //     })
                        // if (item.product[0].part_no == partNo) {
                        //     resolve(item)
                        //     return
                        // }
                        item.product.map(pro => {
                            if(pro.part_no == partNo){
                                voucher_avabile.push(item)
                            }
                        })
                    })
                    voucher_avabile = voucher_avabile.sort((a, b) => (a.Amount > b.Amount)) 
                    resolve(voucher_avabile[0] ? voucher_avabile[0] : { VoucherID: '' })
                    return
                }
                resolve({ VoucherID: '' })
            })
        })
    }
    // 查询代金券 - 新
    searchCoupon(config){
        const { unionid } = app.globalData;
        return new Promise((resolve, reject)=>{
              this.request({
                    url: `/wfa/order/coupon/entity/getByPartInfo?unionId=${unionid}&partNo=${config.GoodsId}&catalogNo=${config.catalog_no}&storeId=${config.storeId}`,
                    method: 'GET'
              }).then(res => {
                  resolve(res.result);
              }).catch(err => {
                  reject(err);
              })
        })
    }
    /**
     * 获取门店列表
     */
    getStore() {
        return new Promise((resolve, reject) => {
            this.request({
                url: 'https://hcmtq.oss-accelerate.aliyuncs.com/store.json',
                method: 'GET'
            }).then(res => {
                resolve(res)
            })
        })
    }

    /**
     * 创建房间
     */
    createRoom(city, customerNo) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.CreateRoomForCy,
                method: 'POST',
                data: {
                    customerNo,
                    city: city,
                    unionId: app.globalData.unionid
                }
            }).then(res => {
                console.log(res);
                resolve(res.result.activityId)
            }).catch(err=>{
                reject(err)
            })
        })
    }

    getCollectionList(){
        return new Promise((resolve, reject)  => {
            return this.request({
                url: this.apiSettings.GetCollection,
                method:'GET',
                data: {
                    unionId: getApp().globalData.unionid
                }
            }).then(res => {
                resolve(res)
            })
        })
    }

    /**
     * 
     * @param {String} apiUrl 龙存管单次支付、多次支付接口 
     * @param {String} orderNo 订单号
     */
    lcgPay (apiUrl, orderNo) {
        return new Promise((resolve, reject) => {
            return this.request({
                url: apiUrl,
                method: "GET",
                data: {
                    orderNo: orderNo,
                    payType: "W",
                    appId: __wxConfig.accountInfo.appId,
                    openId: app.globalData.openid // "ozgs_5d8QEv6ZQlYtOyj4c1NGgr8"
                }
            }).then(res => {
                resolve(res)
            })
        })
    }

    singlePay (orderNo) {
        return new Promise((resolve, reject) => {
            return this.request({
                url: this.apiSettings.lcg_singlePay,
                method: "GET",
                data: {
                    orderNo: orderNo,
                    payType: "W",
                    appId: "wx059f9118f045da79",
                    openId: "ozgs_5d8QEv6ZQlYtOyj4c1NGgr8"
                }
            }).then(res => {
                resolve(res)
            })
        })
    }

    multiPay (orderNo) {
        return new Promise((resolve, reject) => {
            return this.request({
                url: this.apiSettings.lcg_multiPay,
                method: "GET",
                data: {
                    orderNo: orderNo,
                    payType: "W",
                    appId: "wx059f9118f045da79",
                    openId: "ozgs_5d8QEv6ZQlYtOyj4c1NGgr8"
                }
            }).then(res => {
                resolve(res)
            })
        })
    }
    
    /**
     * 获取Sign
     */
    getSign(){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.getSign,
                method: 'POST',
                data: {
                    unionId: app.globalData.unionid // "oYnHqszJdK8gzKciXEX7r4GE4rzs" // app.globalData.unionid
                }
            }).then(res => {
                resolve(res)
            })
        })   
    }

    /**
     * 修改支付方式
     * @param {Object} params 请求参数
     */
    updatePayMethod(params) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.updatePaymentMethod,
                method: "POST",
                data: params
            }).then(res => {
                resolve(res)
            })
        })
    }
}

export { Diy }