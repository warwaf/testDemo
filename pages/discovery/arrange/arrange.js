var app = getApp()
import { Arrange } from './arrange-model'
var arrangeModel = new Arrange()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        products: [
            {
                banner: 'https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190326/C0002928120190326/origin/0cf0e1d2cccd4ec1993249cc31fb2c2c.png',
                productName: '时尚形象照',
                address: '东莞南城西平店',
                productNo: 'NS2501',
                customerNo: ''
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        arrangeModel.GetCatalogList(options.id).then(res=>{
            console.log(res);
            // todo 设置 products
            this.setData({
                products:res
            })
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    jump(e){
        app.globalData.mta.Event.stat("c_mtq_dynamics_product_subscribe",{})
        getApp().globalData.disProInfo = this.data.products[e.currentTarget.dataset.index]
        wx.navigateTo({
            url: '/pages/album/beauty/calendar/calendar?type=1'
        })
    },

    toRecord(){
        wx.navigateTo({
            url: '/pages/discovery/arrange/record/record'
        })
    }
})