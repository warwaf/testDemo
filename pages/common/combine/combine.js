var app = getApp()

var systemInfo = wx.getSystemInfoSync()
var screenWidth = systemInfo.screenWidth
var screenHeight = systemInfo.screenHeight

Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgArr: [],
        ctx: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.imgArr = app.globalData.selectPhotos
        this.data.ctx = wx.createCanvasContext('combineCanvas', this)
        this.generateTwoImage()
    },

    /**
     * 两张图片模板
     */
    generateTwoImage(){
        var promiseArr = []
        this.data.imgArr.forEach((item, index) => {
            switch(index)
            {
                case 0 :
                    promiseArr.push(this.renderSingleImage(item, 0, 0, screenWidth, Math.floor(screenHeight / 2))) ;
                    break;
                case 1 :
                    promiseArr.push(this.renderSingleImage(item, 0, Math.floor(screenHeight / 2), screenWidth, Math.floor(screenHeight / 2)));
                    break;
            }
        })
        Promise.all(promiseArr).then(() => {
            this.data.ctx.draw()
        })
    },

    /**
     * 渲染单张图片
     * 参数: 
     * x: 坐标x
     * y：坐标y
     * w：图片卡槽宽度
     * h：图片卡槽高度
     * url：图片链接
     * 返回：
     * Promise
     */
    renderSingleImage(url, x, y, w, h){
        console.log(url, x, y, w, h)
        return new Promise((resolve, reject) => {
            wx.getImageInfo({
                src: url + `?x-oss-process=image/resize,w_${w}`,
                success: res => {
                    res.height
                    this.data.ctx.drawImage(res.path, 0, 0, res.width, 200, x, y, w, h)
                    resolve()
                }
            })
        })

    }



    

})