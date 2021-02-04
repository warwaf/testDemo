// pages/common/puzzleEdit/index.js、
import regeneratorRuntime from '../../../utils/runtime';
import config from './config.js';
// import { apiSettings } from '../../../utils/ApiSetting'; 
import { Home } from '../../album/home/home-model';
var homeModel = new Home()
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 默认布局
        defaultLayout: [],
        // 当前布局数组
        currentArr: [],
        currentStyleArr: [],
        currentStyleItem: {},
        type: 'layout',
        styleImage: '',
        cutImage: '',
        isSelect: false,
        editHeight: 0,
        editWidth: 0,
        imageUrl: '',
        arr: [],
        isLoading: false,
        isLoading2: false
    },
    scale(e) {
        let scale = -0.1;
        if (e.target.dataset.type == 'reduce') scale = 0.1;
        this.puzzle.scaleImage(scale);
    },
    async changeType(e) {
        const { currentStyleArr } = this.data;
        const { type } = e.currentTarget.dataset;
        if (type == 'style') {
            const res = await this.puzzle.getImage();
            this.setData({ type, cutImage: res.tempFilePath, currentStyleItem: currentStyleArr[0], isSelect: true })
            this.getCompoundImage(currentStyleArr[0]);
        } else {
            this.setData({ type })
        }
    },
    selectStyle(e) {

        const { index } = e.currentTarget.dataset;
        const { currentStyleArr } = this.data;
        const baseUrl = currentStyleArr[0].name.split('_')[0];
        let currentStyleItem = {}
        currentStyleArr.map((item, i) => {
            item.name = baseUrl + '_' + (i + 1) + '_0';
            if (index == i) {
                item.name = baseUrl + '_' + (i + 1) + '_1';
                currentStyleItem = item;
            }
        })
        this.getCompoundImage(currentStyleArr[index])
        this.setData({
            currentStyleArr,
            currentStyleItem
        })
    },
    /**
     * 选择布局
     */
    selectLayout(e) {
        const index = e.target.dataset.index;
        const currentArr = this.data.currentArr;
        this.puzzle.changeLayout(currentArr[index].layout);
        const baseUrl = currentArr[0].url.split('_')[0]
        currentArr.map((item, i) => {
            item.url = baseUrl + '_' + (i + 1) + '_0';
            if (index == i) {
                item.url = baseUrl + '_' + (i + 1) + '_1';
            }
        })
        this.setData({
            currentArr
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: '拼图'
        })
        wx.setNavigationBarColor({
                backgroundColor: "#ffffff",
                frontColor: '#000000',
                animation: {
                    duration: 400,
                    timingFunc: 'linear'
                }
            })
            // const arr = this.data.arr 
        const arr = app.globalData.selectPhotos;
        this.setData({
            currentArr: config[arr.length - 1],
            defaultLayout: config[arr.length - 1][0].layout,
            currentStyleArr: config[9],
            arr,
        })
        this.puzzle = this.selectComponent('#puzzle');
        this.compound = wx.createCanvasContext('compound', this);
        this.image = wx.createCanvasContext('image', this);
        homeModel.getAccessToken("HC-f-share");

        var query = wx.createSelectorQuery();
        query.select('#puzzleEdit').boundingClientRect()
        query.exec((res) => {
            const editHeight = res[0].height;
            const editWidth = editHeight * 375 / 498;
            this.setData({ editHeight, editWidth })
        })

    },
    last() {
        wx.navigateBack({
            delta: 1
        })
    },
    async next() {
        // wx.showLoading({
        //   title: '保存图片中...',
        //   mask: true,
        // })
        this.setData({ isLoading2: true })
        const { isSelect, type, currentStyleItem } = this.data;
        let res = null;
        // 是否选过风格
        if (isSelect) {
            if (type == 'layout') {
                // 布局页面
                const cutImage = await this.puzzle.getImage();
                this.setData({ cutImage: cutImage.tempFilePath })
                res = await this.getCompoundImage(currentStyleItem);
            } else {
                // 没有切换回 布局
                res = await this.getCanvasImage('compound');
            }
        } else {
            res = await this.puzzle.getImage();
        }
        this.compose(res.tempFilePath);
    },
    /**
     * 合成图片 并上传
     */
    async compose(path) {
        // 合成二维码
        const compose = await this.composeImage(path);
        if (compose) {
            // 获取合成后的图片
            const image = await this.getCanvasImage('image', { height: 667 });
            this.uploadFile(image.tempFilePath);
        }
    },
    // 上传图片
    uploadFile(path) {
        const formData = {
            access_token: app.globalData.uploadParam.access_token,
            job_id: app.globalData.uploadParam.job_id
        }
        wx.uploadFile({
            url: app.globalData.uploadParam.uploadurl,
            filePath: path,
            name: 'filecontent',
            formData: formData,
            success: uploadRes => {
                this.setData({ isLoading2: false })
                wx.navigateTo({
                    url: '/pages/common/puzzle/puzzle?url=' + JSON.parse(uploadRes.data).data.OssPath
                })
            }
        })
    },

    async getCompoundImage(info) {
        this.setData({ isLoading2: true })
        const res = await this.compoundImage(info);
        if (res) {
            const image = await this.getCanvasImage('compound');
            this.setData({
                imageUrl: image.tempFilePath,
                isLoading2: false
            })
            return image;
        }
    },

    /**
     * 组合风格图片
     */
    async compoundImage(info) {
        const arr = info.layout.split(',')
        const that = this;
        this.compound.save();
        const res = await this.getImageInfo(info.url);
        that.compound.drawImage(res.path, 0, 0, 375, 498);
        that.compound.drawImage(that.data.cutImage, parseInt(arr[0]), parseInt(arr[1]), parseInt(arr[2]), parseInt(arr[3]));
        that.compound.restore();
        return new Promise((resolve, reject) => {
            that.compound.draw(true, (res) => {
                setTimeout(() => {
                    resolve(true);
                }, 100);
            });
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
            height: 498,
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
    /**
     * 合成二维码图片
     */
    async composeImage(path) {
        const that = this;
        const activityInfo = app.globalData.activityInfo;
        this.image.save();
        const img = await this.getImageInfo('https://hcmtq.oss-accelerate.aliyuncs.com/resources/share-bg.png');
        this.image.drawImage(img.path, 0, 0, 375, 667);
        this.image.setFontSize(18);
        this.image.setFillStyle('#240101');
        this.image.fillText(activityInfo.activityName, 20, 50);
        this.image.restore();
        this.image.drawImage(path, 20, 75, 338, 450);
        this.image.draw();
        const sinioo = await this.getImageInfo('https://hcmtq.oss-accelerate.aliyuncs.com/resources/sinioo.jpg');
        // let url = activityInfo.qrcodeImg.replace('http://', "https://");
        // const qcode = await this.getImageInfo(url);
        this.image.restore();
        // that.image.drawImage(qcode.path, 150, 544, 80, 80);
        this.image.drawImage(sinioo.path, 293, 464, 57, 52);
        // that.image.setFontSize(16);
        // that.image.setFillStyle('#240101');
        // that.image.fillText('长按识别二维码', 135, 645);
        return new Promise(resolve => {
            this.image.draw(true, (res) => {
                console.info('合成二维码图片完成')
                resolve(true);
            })
        })
    },
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
    onReachBottom() {
        return;
    }
})