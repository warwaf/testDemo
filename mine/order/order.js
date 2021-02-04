// pages/mine/confirmorder/confirmorder.js
import {
    Order
} from './order-model'
import apiSettings from '../../utils/ApiSetting.js'
var orderModel = new Order()

const app = getApp()
var data = []

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        currentIndex: 0,
        isLoading: false,
        pageNum: 1,
        pageSize: 5,
        curHeight: "",
        canNext: true
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    curHeight: res.windowHeight
                })
            }
        })
    },
    onShow: function () {
        this.orderList(0);
    },
    loadData() {
        if (!this.data.canNext) {
            console.log("0000")
            return
        }
        console.log(1111)
        let pagenum = this.data.pageNum + 1
        this.setData({
            pageNum: pagenum
        })
        this.orderList(this.data.currentIndex)
    },
    /**
     * 获取订单信息
     * @param {*} type 
     */
    async orderList(type) {
        this.setData({
            isLoading: true
        })
        const res = await orderModel.getOrderList(type, this.data.pageNum, this.data.pageSize);
        let list = res.result ? res.result : []
        let resList = this.data.list.concat(list)
        if (res.code == 200) {
            this.setData({
                list: resList,
                isLoading: false,
                canNext: list.length >= 5 ? true : false
            })
        }
    },
    /**
     *切换tab
     */
    switchTab(e) {
        var currentIndex = e.currentTarget.dataset.index
        this.setData({
            pageNum: 1
        })
        this.orderList(currentIndex);

        this.setData({
            currentIndex,
            list: []
        })
    },

    /**
     * 商品详情
     */
    toDetail(e) {
        const {
            item
        } = e.currentTarget.dataset;
        console.log(e, item)
        wx.navigateTo({
            url: `./detail/detail?orderNo=${item.OrderNo}&trackingNo=${item.TrackingNo}`
        });
    },

    /**
     * 评分
     */
    toScore(e) {
        const {
            no,
            type
        } = e.currentTarget.dataset;
        //看美照订单跳去场景选择页面
        if (type == 'P') {
            wx.navigateTo({
                url: `./scene/scene?orderNo=${no}`
            })
        } else {
            wx.navigateTo({
                url: `./evaluate/evaluate?orderNo=${no}`
            })
        }
    },

    showHelp() {
        wx.showModal({
            title: '咨询热线',
            content: '400 805 2189'
        });
    },

    jumpMessage(e) {
        const order = e.target.dataset.order;
        wx.navigateTo({
            url: '/pages/common/beautyMessage/index?orderNo=' + order,
        })
    },
    // 跳转去预约
    toAppointment(e) {
        const {
            item
        } = e.currentTarget.dataset
        wx.request({
            url: apiSettings.getActivityMsOrder,
            data: {
                orderNo: item.OrderNo
            },
            header: {
                "Content-Type": "application/json",
            },
            method: "POST",
            success: res => {
                if (res.data.code == 200) {
                    if (res.data.result.orderDetail) {
                        wx.navigateTo({
                            url: res.data.result.orderDetail.appointmentType == 0 ? '/pages/activity/scheduling/scheduling?no=' + res.data.result.orderDetail.orderNo : '/pages/activity/scheduling/schedulingDetail/schedulingDetail?orderNo=' + res.data.result.orderDetail.orderNo,
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
})