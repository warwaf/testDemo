import { Order } from '../order-model.js'
import { formatTime } from '../../../utils/util'

const orderModel = new Order()
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        serviceScore: 0,
        photograherScore: 2,
        makerScore: 3,
        content: '',
        images: [],
        orderInfo: {},
        isLoading: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.data.orderInfo = options
        console.log(this.data.orderInfo)
    },

    changeScore(e) {
        var sort = e.currentTarget.dataset.sort
        var value = e.currentTarget.dataset.value
        if (sort == 'service') {
            this.setData({
                serviceScore: value
            })
        } else if (sort == 'photograher') {
            this.setData({
                photograherScore: value
            })
        } else {
            this.setData({
                makerScore: value
            })
        }
    },

    inputEventhandle(e) {
        if (e.detail.value.length > 300) return
        this.setData({
            content: e.detail.value
        })
    },
    /**
     * 选择图片
     */
    async pickImage() {
        var res = await app.chooseImage(1)

        this.setData({ isLoading: true })

        const tempFilePaths = res.tempFilePaths

        await app.getAccessToken('hc-f-1')

        try {
            var uploadRes = await app.uploadImage(tempFilePaths[0])
        } catch (error) {
            this.setData({
                isLoading: false
            })
            return wx.showToast({
                title: '上传失败',
                icon: 'none'
            })
        }

        try {
            await app.checkNetImage(uploadRes.OssPath)
            this.data.images.push(uploadRes.OssPath)
            this.setData({
                images: this.data.images,
                isLoading: false
            })
        } catch (error) {
            return  wx.showToast({
                title: '图片不合格，请重新上传',
                icon: 'none'
            })
        }
    },

    submit() {
        var data = {
            "basics_id": this.data.orderInfo.jobId,
            "order_no": this.data.orderInfo.orderNo,
            "order_type": this.data.orderInfo.jobId ? 1 : 2,
            "job_id": this.data.orderInfo.orderNo + '001',
            "scence_id": this.data.orderInfo.jobId,
            "evaluation_time": formatTime(new Date()),
            "evaluation_id": getApp().globalData.userInfo.memberId,
            "evaluate": this.data.content,
            "imginfos": this.data.images.join(','),
            "service_score": this.data.serviceScore,
            "photography_score": this.data.photograherScore,
            "makeup_score": 0,
            "deliver_score": this.data.orderInfo.jobId ? 0 : this.data.makerScore, //看美照评论 deliver_score 为 0
            "customer_no": "D8990"
        }
        orderModel.updateEvaluate(data).then(() => {
            wx.navigateBack({
                delta: 1
            })
        })

    }
})