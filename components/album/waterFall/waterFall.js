import { Detail } from '../../../pages/album/detail/detail-model.js'
import util from '../../../utils/util.js'
var detailModel = new Detail()
var app = getApp()

Component({
    relations: {
        '../loading/loading': {
            type: 'child'
        }
    },
    /**
     * 组件的属性列表
     */
    properties: {
        data: {
            type: Object,
            observer(newVal, oldVal, changedPath) {
                var len = this.data.imgArr.reduce((acc, currentVal) => (acc + currentVal.length), 0)
                var minIndex = 0
                if (newVal instanceof Array && newVal.length > 0) {
                    var imgArr = this.data.imgArr.slice(0)
                    newVal.forEach((value, key) => {
                        this.data.colunmnHeight.forEach((item, index) => {
                            if (item < this.data.colunmnHeight[minIndex]) {
                                minIndex = index
                            }
                        })
                        value.height = Math.floor((this.data.columnWidth / value.picWidth) * value.picHeight)
                        value.index = len + key
                        // value.thumbnailUrl = value.thumbnailUrl.split('?')[0]   //去掉看美照缩略图地址后缀                        
                        this.data.colunmnHeight[minIndex] += (this.data.columnWidth / value.picWidth) * value.picHeight + (this.properties.column * this.data.paddingWidth)
                        imgArr[minIndex].push(value)
                    })
                    //更新多列
                    this.setData({
                        imgArr
                    })
                } else {
                    if (!newVal.picWidth) {
                        return
                    }
                    this.data.colunmnHeight.forEach((item, index) => {
                        if (item < this.data.colunmnHeight[minIndex]) {
                            minIndex = index
                        }
                    })
                    imgArr = this.data.imgArr                    
                    newVal.height = Math.floor((this.data.columnWidth / newVal.picWidth) * newVal.picHeight)
                    newVal.index = len
                    imgArr[minIndex].push(newVal)
                    this.data.colunmnHeight[minIndex] += newVal.height + (2 * this.data.paddingWidth)
                    //更新单列
                    this.setData({
                        imgArr
                    })
                }

            }
        },
        //列数
        column: {
            type: Number,
            value: 2
        },
        isDiy: {
            type: Boolean,
            value: false
        },
        //拼图状态
        activited: {
            type: Boolean,
            value: false
        },
        //最大可以选择图片张数
        maxSelectableNum: {
            type: Number,
            value: 99
        },
        // 最小选择张数
        minSelectableNum: {
            type: Number,
            value: 1
        },
        remainSelectableNum: {
            type: Number,
            value: 99
        }
    },

    externalClasses: [
        'water-class'
    ],

    /**
     * 组件的初始数据
     */
    data: {
        date: (new Date(util.formatTime1(new Date()))).getTime(),
        //每列宽度
        columnWidth: 0,
        colunmnHeight: [0, 0, 0],
        imgArr: [[], [], []],
        //存放已选择图片
        selectedImgs: [],
        paddingWidth: 8,
        bus: {
            w: 0,
            h: 0,
            x: 0,
            y: 0,
            hidden: true,
            opacity: 1
        }
    },
    
    /**
     * 组件的方法列表
     */
    methods: {
        //初始化瀑布流
        init() {
            var columnWidth = Math.floor(((wx.getSystemInfoSync().windowWidth - (2 * this.properties.column * this.data.paddingWidth)) - (this.properties.column * this.data.paddingWidth)) / this.properties.column),
                colunmnHeight = [],
                imgArr = []
            for (let i = 0; i < this.properties.column; i++) {
                colunmnHeight.push(0)
                imgArr.push([])
            }
            this.data.colunmnHeight = colunmnHeight
            this.setData({
                columnWidth,
                imgArr
            })
        },

        //选择图片
        choseImage(event) {
            if (this.data.activited) {
                //选图
                var { column, index } = event.currentTarget.dataset
                var currentImg = this.data.imgArr[column][index]
                currentImg._column = column
                currentImg._row = index

                if (currentImg.check) {
                    this.data.selectedImgs.forEach((item, index) => {
                        if (item.picUrl == currentImg.picUrl) {
                            this.data.selectedImgs.splice(index, 1)
                        }
                    })
                } else {
                    if (this.data.selectedImgs.length >= this.data.maxSelectableNum || this.data.remainSelectableNum <= 0) {
                        wx.showToast({
                            title: `选择图片数量已达上限`,
                            icon: 'none',
                            duration: 1000
                        })
                        return
                    }
                    this.data.selectedImgs.push(currentImg)
                }

                this.setData({
                    ['imgArr[' + column + '][' + index + '].check']: !currentImg.check,
                    selectedImgs: this.data.selectedImgs
                })

                //触发点击事件 diy选图
                if(this.data.isDiy){
                    var { position } = event.currentTarget.dataset
                    this.triggerEvent('clickEvent', {
                        index: position,
                        currentImg,
                        type: currentImg.check
                    })
                }
            } else {
                var currentImg = {}
                // //Diy选图添加加入购物车动画
                // if(this.properties.isDiy){
                //     var { column, index } = event.currentTarget.dataset
                //     currentImg = this.data.imgArr[column][index]
                //     this._animate(event, currentImg)
                // }
                //触发点击事件
                var { position } = event.currentTarget.dataset
                this.triggerEvent('clickEvent', {
                    index: position,
                    currentImg
                })
            }
        },

        //暴露方法  取消图片选择
        removeImage(currentImg){
            var curIndex = false
            this.data.selectedImgs.forEach((item, index) => {
                if (item.picUrl == currentImg.picUrl) {
                    curIndex = index
                }
            })
            if(curIndex !== false){
                this.data.selectedImgs.splice(curIndex, 1)
                this.setData({
                    ['imgArr[' + currentImg._column + '][' + currentImg._row + '].check']: false,
                    selectedImgs: this.data.selectedImgs
                })
            }
        },

        //取消
        cancle() {
            this.data.imgArr.forEach((imgs, idx) => {
                imgs.forEach((item, index) => {
                    this.data.imgArr[idx][index].check = false
                })
            })
            this.triggerEvent('cancleEvent', {})
            //清空
            this.setData({
                activited: false,
                imgArr: this.data.imgArr,
                selectedImgs: []
            })
        },

        //跳转
        jump(e) {
            if (this.data.selectedImgs.length < this.data.minSelectableNum) {
                wx.showToast({
                    title: `至少选择${this.data.minSelectableNum}张图片`,
                    icon: 'none',
                    duration: 1000
                })
                return
            }
            //感恩节活动图片url
            var thanksgivingPhotoUrl
            //九宫格 or 长图
            if(this.properties.maxSelectableNum == 9){
                //保存
                app.globalData.selectPhotos = this.data.selectedImgs.map(item => item.picUrl)
            }else if(app.globalData.thanksgiving){
                thanksgivingPhotoUrl = this.data.selectedImgs[0].picUrl.replace('https:', '').replace('http:', '')
            }else{
                if(this.data.selectedImgs.length < 4){
                    wx.showToast({
                        title: '至少选择4张图片',
                        icon: 'none'
                    })
                    return
                }
                //保存
                app.globalData.selectPhotos = this.data.selectedImgs
            }
            //清空选中状态
            this.data.imgArr.forEach((imgs, idx) => {
                imgs.forEach((item, index) => {
                    this.data.imgArr[idx][index].check = false
                })
            })
            this.setData({
                activited: false,
                selectedImgs: [],
                imgArr: this.data.imgArr,
            })
            this.triggerEvent('cancleEvent', {})

            if(app.globalData.thanksgiving){
                return wx.navigateTo({
                    url: `/activity/thanksgiving/thanksgiving?thanksgivingPhotoUrl=${thanksgivingPhotoUrl}`
                })
            }
            //跳转 -- 九宫格 or 长图
            if(this.properties.maxSelectableNum == 9){
                wx.navigateTo({
                    url: '/pages/common/puzzleEdit/index'
                })
            }else{
                wx.navigateTo({
                    url: '/pages/common/puzzle2/puzzle2'
                })
            }
        },

        //加入购物车动画
        // _animate(event, currentImg){
        //     //设置图片到点击位置
        //     var x = event.touches[0].clientX, y = event.touches[0].clientY, imgWidth = this.data.columnWidth * 1.5, imgHeight = currentImg.height * 1.5
        //     var bus = {
        //         x: (x - imgWidth / 2) < 0 ? x : Math.floor(x - imgWidth / 2),
        //         y: y - Math.floor(imgHeight / 2),
        //         w: imgWidth,
        //         h: imgHeight,
        //         url: currentImg.thumbnailUrl + '?x-oss-process=image/resize,w_200',
        //         hidden: true,
        //         opacity: 1
        //     }
        //     this.setData({
        //         bus
        //     })
        //     //渲染图片
        //     setTimeout(() => {
        //         this.setData({
        //             'bus.hidden': false
        //         })
        //     },100)
        //     //执行动画
        //     setTimeout(() => {                
        //         this.setData({
        //             'bus.x': 50 - (bus.w / 2),
        //             'bus.y': wx.getSystemInfoSync().windowHeight + parseInt(bus.h) ,
        //             'bus.w': 60,
        //             'bus.h': 60,
        //             'bus.opacity': 0
        //         })
        //     }, 200);
        // },
    },

    lifetimes: {
        attached() {
            this.init()
        }
    }
})
