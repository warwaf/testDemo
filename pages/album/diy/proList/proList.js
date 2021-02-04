import { Diy } from '../diy-model'

var app = getApp()
var diyModel = new Diy()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        max: 9,
        min: 1,
        banner: '',
        gotVoucher: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function(options) {
        console.info(app.globalData.diyConfig)
            // app.globalData.diyConfig = config
            // const { CatalogNo, PartNo, partNo, templetNo } = app.globalData.diyConfig;
        let CatalogNo = '',
            PartNo = '';
        if (app.globalData.diyConfig) {
            CatalogNo = app.globalData.diyConfig.catalogNo;
            PartNo = app.globalData.diyConfig.partNo;
        }

        // 如果有入参 
        if (options.goodsId && options.catalogNo && options.templetNo) {
            app.globalData.diyConfig = {
                partNo: options.goodsId,
                catalogNo: options.catalogNo,
                templetNo: options.templetNo
            }
        } else {
            console.log('参数错误');
        }

        this.setData({
            banner: options.banner,
            max: options.max,
            min: options.min
        })
        
        //  NS00186 1005871
        var config = {
            GoodsId: options.goodsId ? options.goodsId : PartNo,
            // branchid: partNo,
            catalog_no: options.catalogNo ? options.catalogNo : CatalogNo,
            storeId: app.globalData.diyConfig.customerNo
            // template_id: options.templetNo
        }
        const res = await diyModel.searchCoupon(config);
        console.log(res);
        if(res.result && res.result.length > 0){
            this.setData({
                gotVoucher: true
            })
        }
        // diyModel.queryCoupon(config.GoodsId).then(res => {
        //     if (res.VoucherID) {
        //         this.setData({
        //             gotVoucher: true
        //         })
        //     }
        // })
        // diyModel.getProducts(config).then(res => {
        //     app.globalData.ttl_photos = res.ttl_photos;
        //     this.setData({
        //         max: res.ttl_photos,
        //         min: res.ttl_photos
        //     })
        // })

    },

    produce() {
        // let max = this.data.max;
        // let min = this.data.min;
        // if (app.globalData.diyConfig && app.globalData.diyConfig.catalogNo == '1007007') {
        //     max = 30;
        //     min = 30;
        // }
        // } url: `/pages/album/diy/pick/pick?max=30&min=${this.data.min}`,

        // app.globalData.mta.Event.stat('c_mtq_album_album_albumclick',{
        //     'count':app.globalData.unionid,
        //     'isactive': app.globalData.activityInfo.deployRoom.length>0 ? 'true': 'false',
        //     'phototype': app.globalData.activityInfo.activityType
        // })

        const { max, min} = this.data;
        wx.redirectTo({
            url: `/pages/album/diy/pick/pick?max=${max}&min=${min}`,
        })
    }
})