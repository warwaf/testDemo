import regeneratorRuntime from '../../../utils/runtime.js'
import { Upload } from '../../album/upload/upload-model'
var app = getApp()
var uploadModel = new Upload()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        //处理完成后数据
        processedData: [],
        //保存C位图片
        mainImgArr: [],
        bgColor: {
            from: '#FC466B',
            to: '#3F5EFB'
        },
        settingStat: true,
        sessionStat: 1,
        colorArr: [
            {selected: false, value: {from: '#CFDEF3', to: '#E0EAFC'}},
            {selected: true, value: {from: '#FC466B', to: '#3F5EFB'}},
            {selected: false, value: {from: '#36D1DC', to: '#5B86E5'}},
            {selected: false, value: {from: '#4776E6', to: '#8E54E9'}},
            {selected: false, value: {from: '#FFAFBD', to: '#FFC3A0'}},
            {selected: false, value: {from: '#FFA751', to: '#FFE259'}}
        ],
        activityInfo: {
            activityName: '',
            qrcodeImg: 'https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190403/C0003919920190403/origin/C0003919920190403_0956.jpg'
        },
        total: 0,
        isChange: true,
        //画布相关
        canvasWidth: 0,
        canvasHeight: 0,
        tmpPath: '',
        OssPath: '',
        //画布相对设备放大比例
        scale: 2,
        fontSize: 34,
        //位置参数
        params: {
            //画布相对设计稿放大比例
            scale: 1
        }, 
        //光标位置
        pointer: {} 

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // var tempArr = [
        //     {picId: "4a2e66f02718485a9211e3aa957b9a15.jpg", picUrl: "https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190628/C0102747420190628/origin/9c9fb681ff5f4459b0264ccd4f27ee7e.jpg", thumbnailUrl: "https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190628/C0102747420190628/origin/thumb/9c9fb681ff5f4459b0264ccd4f27ee7e_small.jpg", createTime: "2019-07-24 11:23:08", thumbnailUrl2: "https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190628/C0102747420190628/origin/9c9fb681ff5f4459b0264ccd4f27ee7e_small.jpg"},
        //     {picId: "4a2e66f02718485a9211e3aa957b9a15.jpg", picUrl: "https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190628/C0102747420190628/origin/9c9fb681ff5f4459b0264ccd4f27ee7e.jpg", thumbnailUrl: "https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190628/C0102747420190628/origin/thumb/9c9fb681ff5f4459b0264ccd4f27ee7e_small.jpg", createTime: "2019-07-24 11:23:08", thumbnailUrl2: "https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190628/C0102747420190628/origin/9c9fb681ff5f4459b0264ccd4f27ee7e_small.jpg"},
        //     {picId: "4a2e66f02718485a9211e3aa957b9a15.jpg", picUrl: "https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190628/C0102747420190628/origin/9c9fb681ff5f4459b0264ccd4f27ee7e.jpg", thumbnailUrl: "https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190628/C0102747420190628/origin/thumb/9c9fb681ff5f4459b0264ccd4f27ee7e_small.jpg", createTime: "2019-07-24 11:23:08", thumbnailUrl2: "https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190628/C0102747420190628/origin/9c9fb681ff5f4459b0264ccd4f27ee7e_small.jpg"},
        //     {picId: "4a2e66f02718485a9211e3aa957b9a15.jpg", picUrl: "https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190628/C0102747420190628/origin/9c9fb681ff5f4459b0264ccd4f27ee7e.jpg", thumbnailUrl: "https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190628/C0102747420190628/origin/thumb/9c9fb681ff5f4459b0264ccd4f27ee7e_small.jpg", createTime: "2019-07-24 11:23:08", thumbnailUrl2: "https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190628/C0102747420190628/origin/9c9fb681ff5f4459b0264ccd4f27ee7e_small.jpg"},
        //     {picId: "4a2e66f02718485a9211e3aa957b9a15.jpg", picUrl: "https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190628/C0102747420190628/origin/9c9fb681ff5f4459b0264ccd4f27ee7e.jpg", thumbnailUrl: "https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190628/C0102747420190628/origin/thumb/9c9fb681ff5f4459b0264ccd4f27ee7e_small.jpg", createTime: "2019-07-24 11:23:08", thumbnailUrl2: "https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190628/C0102747420190628/origin/9c9fb681ff5f4459b0264ccd4f27ee7e_small.jpg"}
        // ], counter = 5
        var tempArr = app.globalData.selectPhotos, counter = app.globalData.selectPhotos.length
        //每9张图片产生一个C位图位置
        while(counter > 5){
            tempArr = this._getHotestImg(tempArr)
            counter -= 9
        }
        var destArr = this._processArr(tempArr)
        //把C位图分散插入到处理过后的图片数组
        destArr = this._insertMainImgToArr(destArr)        
        
        this.setData({
            processedData: destArr,
            activityInfo: Object.assign({}, app.globalData.activityInfo),
            total: app.globalData.photoTotal
        })
    },

    /**
     * 筛选出点赞最高图片存入容器
     */
    _getHotestImg(arr){
        var theHotestIndex = 0, mainImgArr = this.data.mainImgArr
        arr.forEach((item, index) => {
            if(item.browseCount > arr[theHotestIndex].browseCount){
                theHotestIndex = index
            }
        })
        mainImgArr.push(arr.splice(theHotestIndex, 1)[0])
        this.data.mainImgArr = mainImgArr
        return arr
    },

    /**
     * 处理数组
     */
    _processArr(arr){
        // 1. 计算出每张图片的高宽比，并计算出平均值
        // var totalWidth = 0, totalHeight = 0
        // arr.map(item => {
        //     totalWidth += parseInt(item.picWidth) 
        //     totalHeight += parseInt(item.picHeight)
        // })
        // var averageScale = Math.round((totalHeight / totalWidth) * 10) / 10
        //2. 将图片分类成横图和竖图
        var tempArr = {            
            horizon: [],
            vertical: []
        }
        arr.map(item => {
            let scale = Math.round((item.picHeight / item.picWidth) * 100) /100
            if(scale > 1.3){
                tempArr.vertical.push(item)
            }else{
                tempArr.horizon.push(item)
            }
        })
        var destArr = []
        //3. 将图片按照一定比例输出到一个容器
        if(tempArr.vertical.length * 2 < tempArr.horizon.length){
            //按照竖图：横图 1 ：2 对应输出后，横图还有多余的
            tempArr.vertical.map(() => {
                destArr.push({
                    left: tempArr.horizon.splice(0,2),
                    right: tempArr.vertical.splice(0,1),
                    type: true
                })
            })
            while(tempArr.horizon.length > 0){
                destArr.push({
                    left: tempArr.horizon.splice(0,1),
                    right: tempArr.horizon.splice(0,1),
                    type: false
                })
            }
        }else{
            //按照竖图：横图 1 ：2 对应输出后，竖图还有多余的
            if((tempArr.vertical.length - Math.floor(tempArr.horizon.length / 2)) % 2 == 1 && tempArr.horizon.length >= 2){
                //多余的竖图为奇数个，无法对齐，需要做特殊处理
                destArr.push({
                    left: tempArr.horizon.splice(0,1),
                    right: tempArr.horizon.splice(0,1),
                    type: false
                })
            }
            //按1：2比例放入容器
            let len = tempArr.horizon.length
            for(let i = 0; i < Math.floor(len / 2); i++){
                destArr.push({
                    left: tempArr.horizon.splice(0,2),
                    right: tempArr.vertical.splice(0,1),
                    type: true
                })
            }
            //将剩余竖图按1:1放入容器
            while (tempArr.vertical.length > 1) {
                destArr.push({
                    left: tempArr.vertical.splice(0,1),
                    right: tempArr.vertical.splice(0,1),
                    type: true
                })
            }
            //可能会存在多一个横图，放在容器最后
            while(tempArr.horizon.length > 0){
                destArr.push({
                    left: tempArr.horizon.splice(0,1),
                    right: tempArr.horizon.splice(0,1),
                    type: false
                })
            }
        }
        console.log(destArr);
        
        return destArr
    },

    /**
     * 将arr根据C位图片个数等分，然后将C位图片分散插入
     */
    _insertMainImgToArr(arr){
        //每份个数
        var num = Math.ceil(arr.length / (this.data.mainImgArr.length + 1))        
        //主图可视为left为一个元素数组 right为空数组
        this.data.mainImgArr.map((item, index) => {
            arr.splice(num * (index + 1), 0, { left: [item], right: [], type: false })
        })
        return arr
    },

    changeBgColor(e){
        var colorArr = this.data.colorArr, curIndex = e.currentTarget.dataset.index
        colorArr.map((item,index) => {
            if(curIndex == index){
                item.selected = true
            }else{
                item.selected = false
            }
        })
        this.setData({
            colorArr,
            bgColor: this.data.colorArr[curIndex].value,
            isChange: true
        })
    },

    switchTab(){
        this.setData({
            settingStat: !this.data.settingStat
        })
    },

    fold(){
        if(this.data.sessionStat){
            this.data.page = this.data.sessionStat
            this.setData({
                sessionStat: false
            })
        }else{
            this.setData({
                sessionStat: this.data.page
            })
        }
    },

    back(){
        if(this.data.sessionStat == 2){
            this.setData({
                sessionStat: 1
            })
        }else{
            wx.navigateBack({
                delta: 1
            })
        }
    },

    stop(){return false},

    inputHandker(e){
        console.log(e);
        
        this.setData({
            'activityInfo.activityName': e.detail.value,
            isChange: true
        })
    },

    async nextStep(){
        const res = await uploadModel.verifyContent(this.data.activityInfo.activityName)
        if(!res) {
            wx.showToast({
                title: '内容包含敏感词汇，请修改后重新提交',
                icon:'none',
                mask: true
            })
            return;
        }
        if(this.data.sessionStat == 1 && (!this.data.tmpPath || this.data.isChange)){
            wx.showLoading({
                title: '处理中',
                mask: true
            })
            //本地没有生成则开始合成
            this.ctx = wx.createCanvasContext('puzzle-canvas')
            await this._initCanvas()
            await this._drawBackground()
            this.data.tmpPath = await this._drawContent()
            this.data.OssPath = await this._upload()
            wx.hideLoading()
        }
        this.setData({
            sessionStat: this.data.sessionStat == 1 ? 2 : 1,
            isChange: false
        })
    },

    download(){
        wx.saveImageToPhotosAlbum({
            filePath: this.data.tmpPath,
            success: () => {
                wx.hideLoading()
                wx.showToast({
                    title: '保存成功'
                })
            }
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        return {
            title: `拼图`,
            path: `/pages/common/puzzle2/share/share?src=${this.data.OssPath}&room_no=${app.globalData.roomInfo.room_no}`,
            imageUrl: this.data.OssPath
        }
    },

    _initCanvas(){
        return new Promise(resolve => {
            var query = wx.createSelectorQuery()
            query.select('#container').boundingClientRect()
            query.exec(res => {

                var canvasWidth = this.data.scale * 375, canvasHeight = this.data.scale * res[0].height
                var params = {}, scale = this.data.scale //canvas画布相对设计稿放大倍率

                // var canvasWidth = this.data.scale * res[0].width, canvasHeight = this.data.scale * res[0].height
                // var params = {}, scale = Math.floor((canvasWidth / 375) * 100) / 100 //canvas画布相对设计稿放大倍率
                
                params.headerHeight = 4.5 * this.data.fontSize * 2
                params.scale = scale,   
                params.halfWidth = Math.floor(158 * scale),
                params.halfHeight = Math.floor(107 * scale),
                params.fullWidth = Math.floor(330 * scale),
                params.fullHeight = Math.floor(227 * scale),
                params.mainHeight = Math.floor(185 * scale),
                params.distanceToBorder = Math.floor(23 * scale),  //图片据边框距离
                params.gap = Math.floor(13 * scale),              //图片间隙
                params.borderRadius = Math.floor(8 * scale)
                //初始化光标位置
                var pointer = {
                    x: params.distanceToBorder,
                    y: params.headerHeight
                }
                this.data.params = params
                this.data.pointer = pointer
                this.setData({
                    canvasWidth,
                    canvasHeight
                })
                //清空画布
                this.ctx.clearRect(0, 0, canvasWidth, canvasHeight)
                resolve()
            })
        })
    },

    /**
     * 绘制背景色和水印
     */
    _drawBackground(){
        this.ctx.beginPath()
        this.ctx.rect(0,0,this.data.canvasWidth,this.data.canvasHeight)
        var grd = this.ctx.createLinearGradient(0, 0, 0, this.data.canvasHeight)
        grd.addColorStop(0, this.data.bgColor.from)
        grd.addColorStop(1, this.data.bgColor.to)
        this.ctx.setFillStyle(grd)
        this.ctx.fill()
        this.ctx.setFontSize(this.data.fontSize * this.data.scale)
        this.ctx.setFillStyle('#FFFFFF')
        //如果文本长度超出canvas长度的80% 分两行展示
        if(this.data.activityInfo.activityName.length * this.data.fontSize * this.data.scale > this.data.canvasWidth * 0.7){
            //第一行比第二行多两字
            var line1 = this.data.activityInfo.activityName.slice(0, (this.data.activityInfo.activityName.length / 2) + 2),
                line2 = this.data.activityInfo.activityName.slice((this.data.activityInfo.activityName.length / 2) + 2)
            //居中显示标题
            this.ctx.fillText(line1, (this.data.canvasWidth - line1.length * this.data.fontSize * this.data.scale) / 2 , this.data.fontSize * this.data.scale * 2) 
            this.ctx.fillText(line2, (this.data.canvasWidth - line2.length * this.data.fontSize * this.data.scale) / 2 , this.data.fontSize * this.data.scale * 3.5) 
        }else{
            //居中显示标题
            this.ctx.fillText(this.data.activityInfo.activityName, (this.data.canvasWidth - this.data.activityInfo.activityName.length * this.data.fontSize * this.data.scale) / 2 , this.data.fontSize * this.data.scale * 2.5)
        }
        //绘制背景水印
        return new Promise(resolve => {
            wx.downloadFile({
                url: 'https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190326/C0002928120190326/origin/98261c15dc6f45e0bf1c0132414f364d.png',
                success: result => {
                    this.ctx.drawImage(result.tempFilePath, 0, 0, 750, 370, 0, 0, this.data.canvasWidth, 185 * this.data.scale)
                    resolve()
                }
            })
        })
    },

    /**
     * 绘制图片流
     */
    _drawContent(){
        var data = this.data.processedData, drawTasks = []
        
        data.map((row, rowIndex) => {
            //row.type 当前绘制行是全高还是半高
            if(row.type){
                //如果是全高 row.left 可能有两张图片
                if(row.left.length > 1){
                    drawTasks.push(this._drawSingleImage(row.left[0])) 
                    this.data.pointer.y = this.data.pointer.y + this.data.params.halfHeight + this.data.params.gap
                    drawTasks.push(this._drawSingleImage(row.left[1])) 
                    this.data.pointer.y = this.data.pointer.y - this.data.params.halfHeight - this.data.params.gap
                }else{
                    drawTasks.push(this._drawSingleImage(row.left[0], false, true)) 
                }
                this.data.pointer.x = this.data.pointer.x + this.data.params.halfWidth + this.data.params.gap
                drawTasks.push(this._drawSingleImage(row.right[0], false, true)) 
                this.data.pointer.x = this.data.params.distanceToBorder
                this.data.pointer.y = this.data.pointer.y + this.data.params.fullHeight + this.data.params.gap
            }else{
                if(row.right.length > 0){
                    drawTasks.push(this._drawSingleImage(row.left[0]))
                    //移动光标
                    this.data.pointer.x = this.data.pointer.x + this.data.params.halfWidth + this.data.params.gap
                    
                    drawTasks.push(this._drawSingleImage(row.right[0]))
                    //移动光标
                    this.data.pointer.x = this.data.params.distanceToBorder
                    this.data.pointer.y = this.data.pointer.y + this.data.params.halfHeight + this.data.params.gap
                }else{
                    drawTasks.push(this._drawSingleImage(row.left[0], true))
                    //移动光标
                    this.data.pointer.y = this.data.pointer.y + this.data.params.mainHeight + this.data.params.gap
                }

            }
        })
        //绘制二维码
        drawTasks.push(this._drawQrCode())
        return new Promise(resolve => {
            Promise.all(drawTasks).then(() => {
                this.ctx.draw(false, () => {
                    wx.canvasToTempFilePath({
                        x: 0,
                        y: 0,
                        width: this.data.canvasWidth,
                        height: this.data.canvasHeight,
                        destWidth: this.data.canvasWidth,
                        destHeight: this.data.canvasHeight,
                        canvasId: 'puzzle-canvas',
                        success(res) {
                            resolve(res.tempFilePath)
                        }
                    })
                })
            })
        })

    },

    /**
     * @param {*Object：图片对象} img 
     * @param {*Boolean：横向占满 } horizon 
     * @param {*Boolean：全高} vertical 
     */
    _drawSingleImage(img, horizon = false, vertical = false){
        let offsetX = this.data.pointer.x,
        offsetY = this.data.pointer.y,
        containerWidth = this.data.params.halfWidth,
        containerHeight = this.data.params.halfHeight

        if(horizon){
            containerWidth = this.data.params.fullWidth
            containerHeight = this.data.params.mainHeight
        }else if(vertical){
            containerHeight = this.data.params.fullHeight
        }

        return new Promise(resolve => {
            wx.downloadFile({
                url: img.thumbnailUrl,
                success: result => {
                    wx.getImageInfo({
                        src: result.tempFilePath,
                        success: imgInfo => {
                            var heightToCrop = 0, widthToCrop = 0,  heightAfterCrop = 0, widthAfterCrop = 0
                            //如果图片高宽比大于相框高宽比 -->  图片上下会被压缩 --> 裁掉上下
                            if(imgInfo.height / imgInfo.width > containerHeight / containerWidth){
                                //裁剪后高度
                                heightAfterCrop = Math.floor((containerHeight / containerWidth) * imgInfo.width)
                                widthAfterCrop = imgInfo.width
                                //上下需要裁剪的高度
                                heightToCrop = Math.floor((imgInfo.height - heightAfterCrop) / 2)
                            }else{
                            // 如果图片高宽比小于相框高宽比 --> 图片左右会被压缩  --> 裁掉左右
                                widthAfterCrop = Math.floor((containerWidth / containerHeight) * imgInfo.height)
                                heightAfterCrop = imgInfo.height
                                widthToCrop = Math.floor((imgInfo.width - widthAfterCrop) / 2)
                            }
                            var borderRadius = this.data.params.borderRadius
                            this.ctx.save()
                            this.ctx.beginPath()

                            this.ctx.moveTo(offsetX + borderRadius, offsetY)
                            this.ctx.lineTo(offsetX + containerWidth - borderRadius, offsetY)

                            this.ctx.arcTo(offsetX + containerWidth, offsetY, offsetX + containerWidth, offsetY + borderRadius, borderRadius)
                            this.ctx.lineTo(offsetX + containerWidth, offsetY + containerHeight - borderRadius)

                            this.ctx.arcTo(offsetX + containerWidth, offsetY + containerHeight, offsetX + containerWidth - borderRadius, offsetY + containerHeight, borderRadius)
                            this.ctx.lineTo(offsetX + borderRadius, offsetY + containerHeight)

                            this.ctx.arcTo(offsetX, offsetY + containerHeight, offsetX, offsetY + containerHeight - borderRadius, borderRadius)
                            this.ctx.lineTo(offsetX, offsetY + borderRadius)
                            this.ctx.arcTo(offsetX, offsetY, offsetX + borderRadius, offsetY, borderRadius)
                            this.ctx.closePath()
                            this.ctx.setStrokeStyle(this.data.bgColor)
                            this.ctx.stroke()
                            this.ctx.clip()
                            this.ctx.drawImage(
                                result.tempFilePath, 
                                widthToCrop,
                                heightToCrop,
                                widthAfterCrop,
                                heightAfterCrop,
                                offsetX,
                                offsetY,
                                containerWidth,
                                containerHeight
                            )
                            this.ctx.restore()
                            resolve()
                        }
                    })

                }
            })
        })
    },

    /**
     * 上传
     */
    _upload(){
        return new Promise((resolve, reject) => {
            uploadModel.getAccessToken('HC-F-1').then(() => {
                var formData = {
                    access_token: app.globalData.uploadParam.access_token,
                    job_id: app.globalData.uploadParam.job_id
                }
                wx.uploadFile({
                    url: app.globalData.uploadParam.uploadurl,
                    filePath: this.data.tmpPath,
                    name: 'filecontent',
                    formData,
                    complete: res => {
                        if (res.statusCode == 200) {
                            var photoInfo = JSON.parse(res.data)
                            resolve(photoInfo.data.OssPath)
                        }else{
                            reject()
                        }
                    }
                })
            })
        })

    },

    /**
     * 绘制二维码
     */
    _drawQrCode(){
        var fontSize = 14, codeWidth = 140, codeHeight = 140
        var textLength = 12 * fontSize * this.data.scale
        this.ctx.beginPath()
        this.ctx.setFontSize(fontSize * this.data.scale)
        this.ctx.setFillStyle('#FFFFFF')
        this.ctx.fillText(
            `长按识别查看全部${this.data.total}张照片`, 
            (this.data.canvasWidth - textLength) / 2, 
            this.data.pointer.y + codeHeight + 50 + 60
        )
        return new Promise(resolve => {
            wx.downloadFile({
                url: this.data.activityInfo.qrcodeImg,
                success: result => {
                    wx.getImageInfo({
                        src: result.tempFilePath,
                        success: imgInfo=>{
                            this.ctx.drawImage(
                                result.tempFilePath, 
                                0,
                                0,
                                imgInfo.width,
                                imgInfo.height,
                                this.data.canvasWidth / 2 - 70,
                                this.data.pointer.y + 50,
                                codeWidth,
                                codeHeight
                            )
                            resolve()
                        }
                    })     
                }
            })
        })

    }
})