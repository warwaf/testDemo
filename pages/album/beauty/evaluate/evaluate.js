import { Beauty } from '../beauty-model.js'

var  beautyModel = new Beauty()

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
        orderInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.orderInfo = options
        console.log(this.data.orderInfo)
    },

    changeScore(e){
        var sort = e.currentTarget.dataset.sort
        var value = e.currentTarget.dataset.value
        if (sort == 'service'){
            this.setData({
                serviceScore: value
            })
        } else if (sort == 'photograher'){
            this.setData({
                photograherScore: value
            })
        } else {
            this.setData({
                makerScore: value
            })
        }
    },

    inputEventhandle(e){
        if (e.detail.value.length > 300) return
        this.setData({
            content: e.detail.value
        })
    },
    /**
     * 选择图片
     */
    pickImage(){
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['camera','album'],
            success: res => {
                wx.showLoading()
                const tempFilePaths = res.tempFilePaths
                beautyModel.getAccessToken('hc-f-1').then(uploadInfo => {
                    wx.uploadFile({
                        url: uploadInfo.uploadurl,
                        filePath: tempFilePaths[0],
                        name: 'filecontent', 
                        formData: {
                            access_token: uploadInfo.access_token,
                            job_id: uploadInfo.job_id
                        },
                        success: result => {
                            if (result.statusCode == 200) {
                                var data = JSON.parse(result.data)
                                var oss_url = data.data.OssPath
                                beautyModel.verifyImage(oss_url).then(verifyRes => {
                                    wx.hideLoading()
                                    if (verifyRes.code == 500) {
                                        wx.showToast({
                                            title: '图片不合格，请重新上传',
                                            icon: 'none'
                                        })
                                        return
                                    }
                                    this.data.images.push(oss_url)
                                    this.setData({
                                        images: this.data.images
                                    })
                                })
                            } else {
                                wx.hideLoading()
                                wx.showToast({
                                    title: '上传失败',
                                    icon: 'none'
                                })
                            }
                        }
                    })
                })
            },
        })
    },

    submit(){
        beautyModel.saveEvaluate({
            ...this.data.orderInfo,
            score1: this.data.serviceScore,
            score2: this.data.photograherScore,
            score3: this.data.makerScore,
            remark: this.data.content,
            data: this.data.images.join(',')
        }).then(res => {
            console.log(res)
            wx.navigateBack({
                delta: 1,
                success: function(){
                    wx.showToast({
                        title: '评论成功'
                    })
                }
            })
        })
    }
})