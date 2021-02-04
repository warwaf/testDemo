import { News } from './message-model.js'
import regeneratorRuntime from '../../../utils/runtime';
const news = new News()
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        news: [],
        isLoading: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.getMessage();
    },
    async getMessage() {
        this.setData({ isLoading: true })
        const res = await news.listMessage(app.globalData.unionid, 1, 100)
        if (res.code == 200) this.setData({
            news: res.result.list,
            isLoading: false
        })
    },
    /**
     * 查看后 更新消息状态
     * @param {*} id 
     */
    async updataMessage(e) {
        const { id, typeId, orderId, currencyId, unionId, replyType } = e.target.dataset.item
        const res = await news.updateMessage(id);
        if (res.code == 200) {
            this.getMessage();
            let url = ''
            switch (typeId) {
                case '1':
                    url = '/pages/mine/follow/follow?id=0';
                    break;
                case '2':
                    if (replyType == 'image') url = `/pages/album/share/share?room_no=${orderId}&image=${currencyId}`;
                    else url = `/pages/discovery/detail/detail?id=${currencyId}&unionId=${unionId}`;
                    break;
                case '3':
                    if (replyType == 'image') url = `/pages/album/share/share?room_no=${orderId}&image=${currencyId}`;
                    else url = `/pages/discovery/detail/detail?id=${currencyId}&unionId=${unionId}`;
                    break;
                case '4':
                    url = `/pages/mine/order/detail/detail?orderNo=${orderId}&status=1`;
                    break;
                case '5':
                    url = `/pages/mine/order/detail/detail?orderNo=${orderId}&status=2`;
                    break;
                case '6':
                    url = `/pages/mine/order/detail/detail?orderNo=${orderId}&status=0`;
                    break;
                case '7':
                    url = `/pages/mine/order/evaluate/evaluate?orderNo=${orderId}`;
                    break;
                case '8':
                    url = '/pages/album/beauty/home';
                    break;
                case '9':
                    url = '/pages/album/beauty/home';
                    break;
                case '10':
                    url = `/pages/common/beautyMessage/index?orderNo=${orderId}`;
                    break;
            }
            wx.navigateTo({ url })
        }
    }
})