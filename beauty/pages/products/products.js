import { Beauty } from '../beauty-model'
import { isEmpty } from '../../../utils/util'
var beautyModel = new Beauty()
const {  } = getApp().globalData
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageNo: 1,
        pageSize: 50,
        products: {
            comfirmed: [],
            toBeComfirm: [],
            toBeModify: []
        },
        isEmpty: false,
        fromShare: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //从分享进来 获取当前用户信息
        this.setData({
            fromShare: Boolean(options.activityId)
        })
        getApp().globalData.mta.Event.stat("c_mtq_photoablum_product_click",{})
    },

    onShow(){
        this.getProducts()
    },

    /**
     * 获取产品列表
     */
    getProducts(){
        beautyModel.getProducts(this.data.pageNo, this.data.pageSize).then(res => {
            this.setData({
                products: res,
                isEmpty: isEmpty(res.comfirmed) && isEmpty(res.toBeComfirm) && isEmpty(res.toBeModify)
            })
        })
    },

    /**
     * 产品详情
     */
    toProDetail(e){
        var taskId = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../product/product?taskId=' + taskId
        })
    },

    backRoom(){
        wx.redirectTo({
            url: `/pages/album/beauty/home?room_no=${this.data.fromShare}&fromShare=1`
        })
    }


})