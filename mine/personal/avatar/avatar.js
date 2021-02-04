import { Personal } from '../personal-model.js'

var personalModel = new Personal()
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        activited: false,
        tempAvatarUrl: '',
        cropperStat: false,
        cropperOptions: {
            hidden: false,
            src: 'http://img0.imgtn.bdimg.com/it/u=3093352033,626260397&fm=26&gp=0.jpg',
            mode: 'rectangle',
            sizeType: ['original', 'compressed'],
            ratio: 1
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.setData({
            userInfo: getApp().globalData.userInfo,
        })
    },

    /**
     * 更换头像
     */
    changeAvatar(){
        this.setData({
            activited: true
        })
    },

    /**
     * 保存头像
     */
    saveAvatar(){
        wx.downloadFile({
            url: this.data.userInfo.avatarUrl,
            success: res => {
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: res => { 
                        wx.showToast({
                            title: '保存成功'
                        })
                    }
                })
            },
            fail: () => {
                wx.showToast({
                    title: '下载失败',
                    icon: 'none'
                })
            }
        })
    },

    /**
     * 取消
     */
    cancle(){
        this.setData({
            activited: false
        })
    },

    /**
     * 选择照片
     */
    selectEvent(e){
        const type = e.currentTarget.dataset.type
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: type == 1 ? ['camera'] : ['album'],
            success: async res => {
                wx.showLoading()
                let path  = res.tempFiles[0].path
                try {
                    await app.checkLocalImage(path)
                } catch (error) {
                    return wx.showToast({
                        title: '图片不合格，请重新上传',
                        icon: 'none'
                    })
                }

                wx.hideLoading()
                wx.navigateTo({
                    url: `/components/common/cropper/cropper?src=${path}&ratio=1`
                })
            },
        })
    },

    cropCompleteEvent(url){
        personalModel.updateUserInfo({ avatarUrl: url }).then(result => {
            this.setData({
                'userInfo.avatarUrl': url,
                activited: false
            })
            const { userInfo } = app.globalData
            userInfo.avatarUrl = url
            app.globalData.userInfo = userInfo
            wx.navigateBack({
                delta: 1
            })
        })
    },


})