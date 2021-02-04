import filmModel from './film-model'
import {
    Home
} from '../../home/home-model'
import apiSetting from "../../../../utils/ApiSetting"

var homeModel = new Home()

var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        optionIndex: 0,
        showShare: false,
        showButton: false,
        fromShare: false,
        isNew: 0,
        scene: "",
        showPop: false,
        stateCode: "",
        typeId: "",
        showRemark: false,
        remarkMsg: "",
        selectItem: {},
        globalRemark: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        if (options.room_no) {
            app.globalData.roomInfo.room_no = options.room_no
            await homeModel.getActivityInfo()
            //导航栏标题
            wx.setNavigationBarTitle({
                title: `设计片-${app.globalData.activityInfo.activityName}` //（${activity_id}）
            })
        } else {
            wx.setNavigationBarTitle({
                title: `设计片-${app.globalData.activityInfo.activityName}` //（${activity_id}）
            })
        }
        this.setData({
            showButton: options.status != '1',
            fromShare: options.fromShare == '1' ? true : false,
            isNew: options.isNew ? options.isNew : 0,
            jobId: options.jobId,
            typeId: options.typeId
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: async function () {
        var res = await filmModel.getFilms(1, this.data.isNew, this.data.jobId),
            list = []
        res.list.map(item => {
            if (item.pageName) {
                item.setInfo = `【${item.pageName}】`
            }
            list.unshift(item)
        })
        this.setData({
            list,
            layoutStatus: res.layoutStatus,
            globalRemark: list[0].workRemark ? list[0].workRemark : ""
        })
    },
    stop() {
        return false
    },
    hidePop() {
        this.setData({
            showPop: false
        })
    },
    // 打开备注弹窗
    showRemarks(e) {
        let {
            item
        } = e.currentTarget.dataset
        if (!item.remarks) {
            item.remarks = ""
        }
        console.log("item >>", JSON.parse(JSON.stringify(item)))
        this.setData({
            selectItem: item,
            showRemark: true,
            remarkMsg: item.remarks,
            stateCode: ""
        })
    },
    // 获取备注信息
    inputRemark(e) {
        console.log(e.detail.value)
        let {
            type
        } = e.currentTarget.dataset
        switch (type) {
            case "global":
                this.setData({
                    globalRemark: e.detail.value
                })
                break;

            default:
                this.setData({
                    remarkMsg: e.detail.value
                })
                break;
        }
    },
    // 确认提交备注
    confirmRemark() {
        let params = {
            remark: this.data.remarkMsg,
            fileId: this.data.selectItem.fileId,
            activityId: this.data.selectItem.activityId
        }
        wx.request({
            url: apiSetting.addRemarkByFileId,
            data: params,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: (result) => {
                console.log("result", result)
                let res = result.data
                if (res.code == 500) {
                    this.onShow()
                }
            },
            fail: () => {},
            complete: () => {}
        });
        this.setData({
            showRemark: false,
            remarkMsg: ""
        })
    },
    // 关闭备注弹窗
    closeRemark() {
        this.setData({
            showRemark: false
        })
    },
    /**
     * 控制弹窗
     * @param {Object} e 获取自定义参数
     * @param {String} code 1：不满意 2：确认 11：有更新
     */
    showPopup(e) {
        let {
            code
        } = e.currentTarget.dataset,
            text = ""
        if (code == 1) {
            if (this.data.layoutStatus == 1) {
                text = ""
            } else {
                text = "不满意套版图后将返回至套版流程，您确定吗？"
            }
            this.setData({
                showRemark: true
            })
        } else {
            text = "确定套版图后将下发生产，您确定吗？"
            this.setData({
                showPop: true
            })
        }
        this.setData({
            stateCode: code,
            tipsMsg: text
        })
    },
    /**
     * 更新状态
     * @param {String} stateCode 1：不满意 2：确认 11：有更新
     */
    updateStatus() {
        if (this.data.layoutStatus == 1) return
        let params = {
            "activityId": this.data.list[0].activityId,
            "scene": app.globalData.roomInfo.scene,
            "status": this.data.stateCode,
            "jobId": this.data.list[0].jobId,
            "workRemark": this.data.globalRemark
        }
        filmModel.updateFilmStatus(params).then(res => {
            console.log(">>>", res)
            if (res.code == 200) {
                this.onShow()
            }
        })
        this.setData({
            showPop: false,
            showRemark: false
        })
    },
    toRoom() {
        if (this.data.isNew) {
            wx.redirectTo({
                url: `/pages/album/newBeauty/newBeauty?room_no=${app.globalData.roomInfo.room_no}&typeId=${this.data.typeId}&fromShare=${this.data.fromShare ? '1' : '0'}`
            })
            return
        }
        wx.redirectTo({
            url: `/pages/album/beauty2/beauty2?room_no=${app.globalData.roomInfo.room_no}&fromShare=${this.data.fromShare ? '1' : '0'}`
        })
    },

    toDetail(e) {
        app.globalData.photoArr = this.data.list
        wx.navigateTo({
            url: `../detail/detail?film=1&index=${e.currentTarget.dataset.index}&fromShare=${this.data.fromShare ? 1 : 0}`
        })
    },

    toRecycle() {
        wx.navigateTo({
            url: '../recycle/recycle'
        })
    },

    toShare() {
        this.setData({
            showShare: true
        })
    },

    changOption(e) {
        this.setData({
            optionIndex: Number(e.currentTarget.dataset.index)
        })
    },

    closeMask() {
        this.setData({
            showShare: false
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        this.setData({
            showShare: false
        })
        let path = ``
        switch (this.data.isNew) {
            case 1:
            case "1":
                path = `/pages/album/newBeauty/newBeauty?room_no=${app.globalData.roomInfo.room_no}&fromShare=1&shareType=${this.data.optionIndex}&typeId=${this.data.typeId}`
                break;

            default:
                path = `/pages/album/beauty2/beauty2?room_no=${app.globalData.roomInfo.room_no}&fromShare=1&shareType=${this.data.optionIndex}`
                break;
        }
        return {
            title: `${app.globalData.activityInfo.activityName}`,
            path: path,
            imageUrl: app.globalData.activityInfo.bannerImg
        }
    }
})