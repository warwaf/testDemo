import { Upload } from './upload-model.js'
import { compareVersion } from '../../../utils/util.js'

var uploadModel = new Upload()
var app = getApp()

var version = wx.getSystemInfoSync().SDKVersion
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tmpPaths: [],
        showProtocol: false,
        agreeProtocol: false,
        groupName: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function(options) {
        app.globalData.uploadArr = []
        if (wx.getStorageSync('agreeProtocol')) {
            this.setData({
                agreeProtocol: true
            })
        }
        this.data.groupName = options.groupName || ''
        wx.showLoading()
        await uploadModel.getAccessToken()
        wx.hideLoading()
        this.select()
    },
    async select() {
        if (this.data.tmpPaths.length >= 9) {
            wx.showToast({
                title: '一次最多上传9张图片',
                icon: 'none'
            })
            return
        }
        const res = await app.chooseImage(9);
        var uploadArr = this.data.tmpPaths
        uploadArr = res.tempFilePaths.map((tempPath,index) => ({
            size: res.tempFiles[index].size,
            tempPath,
            tempThumbPath: tempPath,
            thumbUrl:tempPath,
            done: false, // 是否上传完成
            legal: false, // 是否合法,
            isCheck: false, // 是否检测过  
        }))
        this.setData({
            tmpPaths:uploadArr
        })
        this.excute()
    },

    excute() {
        app.globalData.uploadArr = this.data.tmpPaths;
        app.globalData.firstUpload = true
        app.uploadImageToRoom(app.globalData.roomInfo.room_no, this.data.groupName)
        wx.navigateBack({
            delta: 0
        })
    },

    remove(e) {
        this.data.tmpPaths.splice(e.currentTarget.dataset.index, 1)
        app.globalData.uploadArr = this.data.tmpPaths
        this.setData({
            tmpPaths: this.data.tmpPaths
        })
    },

    signProtocol() {
        this.setData({
            showProtocol: false,
            agreeProtocol: wx.getStorageSync('agreeProtocol')
        })
    },

    onShowProtocol() {
        this.setData({
            showProtocol: true
        })
    }
})