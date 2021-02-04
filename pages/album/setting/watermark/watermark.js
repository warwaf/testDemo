import { Setting } from '../setting-model'
var app = getApp()
var windowWidth = wx.getSystemInfoSync().windowWidth

var settingModel = new Setting()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        error: false,
        windowWidth: 375,
        scale: 1,
        imgInfo: {
            path: '',
            height: 0,
            width: 0,
            scaleWidth: 0,
            scaleHeight: 0
        },
        cropInfo: {
            width: 66,
            height: 62,
            x: 50,
            y: 50
        },
        rotateInfo: {
            width: 0,
            height: 0,  
        },
        angle: 0,
        selectIndex: 4,
        tempPath: '',
        preview: false,
        isLoading: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.setData({
            windowWidth
        })
        setTimeout(() => {
            this.reSelect()
        }, 2000);
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        
    },

    async reSelect(){
        this.setData({ error: false})
        
        try {
            var res = await app.chooseImage(1,{sizeType:['original']});
        } catch (error) {
            return wx.navigateBack({
                delta: 1
            })
        }

        wx.getImageInfo({
            src: res.tempFilePaths[0],
            success: info => {
                console.log(info,res.tempFilePaths[0], 'info<<<')
                if(info.type == 'png'){
                    this.setData({isLoading: true, error: false})
                    app.uploadImage(res.tempFilePaths[0]).then(res => {
                        this.setData({isLoading: false})
                        app.checkNetImage(res.OssPath).then(() => {
                            var scale = info.width / this.data.windowWidth
                            info.scaleWidth = this.data.windowWidth
                            info.scaleHeight = Math.floor(info.height / scale)
                            this.setData({
                                imgInfo: info,
                                scale,
                                error: false,
                                isAlready: true,
                                isLoading: false
                            })
                        }).catch(err => {
                            return this.setData({
                                error: true,
                                errorMsg1: '图片包含敏感内容',
                                errorMsg2: '请重新上传'
                            })
                        })
                    }).catch(err => {
                        this.setData({isLoading: false})
                        wx.showToast({
                            title: err,
                            icon: 'none'
                        })
                    })
                }else{
                    this.setData({
                        error: true,
                        errorMsg1: '亲，水印只能接受png格式哦',
                        errorMsg2: '别的对象，臣妾接受不了啊o(╥﹏╥)o'
                    })
                }
            },
            fail: () => {
                wx.navigateBack({
                    delta: 1
                })
            }
        })
    },

    changeRatio(e){
        var width = 0, height = 0, curIndex = e.currentTarget.dataset.index
        switch(parseInt(curIndex)){
            case 0:
                width = windowWidth - 30
                height = Math.floor((windowWidth / 131) * 123)
                break
            case 1:
                width = 197
                height = 185
                break
            case 2:
                width = 163
                height = 153
                break
            case 3:
                width = 131
                height = 123
                break
            case 4:
                width = 66
                height = 62
                break
            default:
                break
        }
        this.setData({
            cropInfo: {
                width,
                height,
                x: 0,
                y: 0
            },
            selectIndex: curIndex
        })
    },

    preview(){
        this.setData({isLoading: true})
        this.cut().then(path => {
            this.setData({
                isLoading: false,
                preview: true,
                tempPath: path
            })
        })
    },

    confirm(){
        this.setData({isLoading: true})
        app.uploadImage(this.data.tempPath).then(res => {
            this.setData({isLoading: false})
            var activityInfo = {
                activityId: app.globalData.activityInfo.activityId,
                activityName: app.globalData.activityInfo.activityName,
                watermarkImg: res.OssPath
            }
            settingModel.createActivityRoom(activityInfo).then(res => {
                wx.navigateBack({
                    delta: 1
                })
            })
        }).catch( err => {
            this.setData({isLoading: false})
            return wx.showToast({
                title: '上传图片失败',
                icon: 'none'
            })
        })
    },

    cut(){
        return new Promise((resolve, reject) => {
            var context = wx.createCanvasContext('crop')
            context.drawImage(
                this.data.imgInfo.path,
                this.data.cropInfo.x * this.data.scale,
                this.data.cropInfo.y * this.data.scale,
                this.data.cropInfo.width * this.data.scale,
                this.data.cropInfo.height * this.data.scale,
                0,
                0,
                this.data.cropInfo.width * this.data.scale,
                this.data.cropInfo.height * this.data.scale,
            )
            context.draw(false, () => {
                wx.canvasToTempFilePath({
                    canvasId: 'crop',
                    success: res => {
                        resolve(res.tempFilePath)

                    },
                    fail: () => {
                        wx.showToast({
                            title: '图片截取发生错误',
                            icon: 'none'
                        })
                    }
                })
            })
        })
    },

    back(){
        wx.navigateBack({
            delta: 1
        })
    },

    again(){
        this.setData({
            tempPath: '',
            preview: false
        })
        this.reSelect()
    },

    // rotate(){
    //     if(!this.data.isAlready) return
    //     this.setData({
    //         isAlready: false,
    //         rotateInfo: {
    //             width: this.data.imgInfo.height,
    //             height: this.data.imgInfo.width
    //         }
    //     })
    //     var context = wx.createCanvasContext('rotate')
    //     //将旋转点放置在画布右上角，顺时针旋转90度
    //     context.translate(this.data.imgInfo.height, 0)
    //     context.rotate(Math.PI / 2)
    //     context.drawImage(
    //         this.data.imgInfo.path,
    //         0,
    //         0,
    //         this.data.imgInfo.width,
    //         this.data.imgInfo.height,
    //         0,
    //         0,
    //         this.data.imgInfo.width,
    //         this.data.imgInfo.height
    //     )

    //     context.draw(false, () => {
    //         wx.canvasToTempFilePath({
    //             canvasId: 'rotate',
    //             success: res => {
    //                 wx.saveImageToPhotosAlbum({
    //                     filePath: res.tempFilePath
    //                 })
    //                 var scale = this.data.rotateInfo.width / this.data.windowWidth
    //                 this.setData({
    //                     scale,
    //                     isAlready: true,
    //                     imgInfo: {
    //                         path: res.tempFilePath,
    //                         width: this.data.rotateInfo.width,
    //                         height: this.data.rotateInfo.height,
    //                         scaleWidth: Math.floor(this.data.rotateInfo.width / scale),
    //                         scaleHeight: Math.floor(this.data.rotateInfo.height / scale)
    //                     },
    //                     cropInfo: {
    //                         width: 131,
    //                         height: 123,
    //                         x: 50,
    //                         y: 50
    //                     }
    //                 })
    //             }
    //         })
    //     })

    // },

    changeHandler(e){
        this.setData({
            'cropInfo.x': e.detail.x,
            'cropInfo.y': e.detail.y
        })
    },
    hideAuthority(){
        this.reSelect();
        this.setData({
            error: false
        })
    }
})