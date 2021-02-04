// import { apiSettings } from '../../../utils/ApiSetting';
import regeneratorRuntime from '../../../utils/runtime';
var app = getApp()
Page({
    data: {
        //拼图后的src    
        imgsrc: '',
        qcodeUrl: '',
        url: '',
        isShow: true,
        title: '',
        isLoading: false
    },

    async onLoad(options) {
        this.image = wx.createCanvasContext('image', this);
        wx.setNavigationBarTitle({
            title: '檬太奇'
        })
        wx.setNavigationBarColor({
            backgroundColor: "#ffffff",
            frontColor: '#000000',
            animation: {
                duration: 400,
                timingFunc: 'linear'
            }
        })
        this.setData({ isLoading: true })
            //  获取图片信息
        const qcode = await this.getImageInfo(options.url.replace('http://', 'https://'));
        const compose = await this.drawQcode(qcode.path);
        if (compose) {
            const image = await this.getCanvasImage('image', { height: 667 });
            this.setData({
                isLoading: false,
                isShow: options.no == 'true' ? false : true,
                imgsrc: qcode.path,
                qcodeUrl: image.tempFilePath,
                url: options.url,
            })
        }

    },
    onShareAppMessage(res) {
        const imgsrc = this.data.url;
        var link = '/pages/common/puzzle/puzzle?no=true&url=' + imgsrc;
        var sharobj = {
            title: app.globalData.activityInfo.activityName,
            path: link,
            imageUrl: imgsrc,
            success: function(res) {
                // 转发成功之后的回调
                if (res.errMsg == 'shareAppMessage:ok') {
                    console.info(res)
                }
            },
            fail: function(res) {
                console.info(res)
                    // 转发失败之后的回调
                if (res.errMsg == 'shareAppMessage:fail cancel') {
                    // 用户取消转发
                } else if (res.errMsg == 'shareAppMessage:fail') {
                    // 转发失败，其中 detail message 为详细失败信息
                }
            },
        }
        return sharobj
    },
    /**
     * 绘制带有二维码的图片
     */
    async drawQcode(path) {
        this.image.drawImage(path, 0, 0, 375, 667);
        const activityInfo = app.globalData.activityInfo;
        let url = activityInfo.qrcodeImg.replace('http://', "https://");
        const qcode = await this.getImageInfo(url);
        this.image.restore();
        this.image.drawImage(qcode.path, 150, 544, 80, 80);
        this.image.setFontSize(16);
        this.image.setFillStyle('#240101');
        this.image.fillText('长按识别二维码', 135, 645);
        return new Promise(resolve => {
            this.image.draw(true, (res) => {
                console.info('合成二维码图片完成')
                resolve(true);
            })
        })
    },
    /**
     * 
     * @param {*} url 
     */
    getImageInfo(url) {
        return new Promise((resolve, reject) => {
            wx.getImageInfo({
                src: url,
                success(res) {
                    resolve(res)
                },
                fail(err) {
                    reject(err)
                }
            })
        })
    },
    /**
     * 获取风格图片
     */
    getCanvasImage(id, info) {
        const tempInfo = Object.assign({
            x: 0,
            y: 0,
            width: 375,
            height: 667,
            fileType: 'jpg'
        }, info)
        return new Promise((resolve, reject) => {
            wx.canvasToTempFilePath({
                canvasId: id,
                x: tempInfo.x,
                y: tempInfo.x,
                width: tempInfo.width,
                height: tempInfo.height,
                fileType: tempInfo.fileType,
                success(res) {
                    resolve(res)
                },
                fail(e) {
                    reject(e)
                }
            }, this)
        })
    },
    async savePhoto() {

        wx.saveImageToPhotosAlbum({
            filePath: this.data.qcodeUrl,
            success(res) {
                wx.showToast({
                    title: '成功保存图片到系统相册',
                    icon: 'none'
                })
            },
            fail(res) {
                wx.showToast({
                    title: '保存图片到系统相册失败',
                    icon: 'none'
                })
            },
        })
    },
    home() {
        wx.switchTab({
            url: '/pages/album/checkin/checkin',
        })
    }
})