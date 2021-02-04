var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        src: '',
        activityId: '',
        sessionStat: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.activityId = options.room_no
        this.setData({
            src: options.src
        })
    },

    goback(){
        wx.redirectTo({
            url: `/pages/album/home/home?room_no=${this.data.activityId}&fromShare=1`
        })
    },

    download(){
        wx.showLoading({
            title: '下载中',
            mask: true
        })
        wx.downloadFile({
            url: this.data.src,
            success: result => {
                wx.hideLoading()
                wx.saveImageToPhotosAlbum({
                    filePath: result.tempFilePath,
                    success: () => {
                        wx.showToast({
                            title: '保存成功'
                        })
                    }
                })
            }
        });
    },

    onShareAppMessage() {
        return {
            title: `拼图`,
            path: `/pages/common/puzzle2/share/share?src=${this.data.src}&room_no=${this.data.activityId}`,
            imageUrl: this.data.src
        }
    },

    fold(){
        this.setData({
            sessionStat: !this.data.sessionStat
        })
    },

    stop(){
        return
    }
})