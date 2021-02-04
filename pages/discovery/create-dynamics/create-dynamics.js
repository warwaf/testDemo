// pages/discovery/create-dynamics/create-dynamics.js
import { Createdynamics } from './create-dynamics-model.js'
const createdynamicsModel = new Createdynamics()

import { Detail } from '../../../pages/album/detail/detail-model.js'
var detailModel = new Detail()

const app = getApp()
import { getLocaltion } from '../../../utils/util'

//当前拖动图片的索引, 点击拖动时刻记录的 X Y 坐标
var activityIndex, activityX, activityY, left, top

Page({
    /**
     * 页面的初始数据
     */
    data: {
        items: [],
        msgList: [],
        selectTitle: false,
        newImg: [],
        // 是否在 发布中 ， 如果在为 true  发布按钮不能点击
        isIssue: false,
        error: false,
        success: false,
        agree: false,
        textareaNum: 0,
        dynamicslist: {
            content: '',
            imgUrlsList: [],
            tagsList: [],
            unionId: app.globalData.unionid,
            discoverId: 0
        },
        isUploaded: false,
        showProtocol: false,
        msgText: "",
        address: null,
        isIllegal: false,
        // 理工 作品类型 T 艺术类 D 纪实类
        workType: null,
        fromH5: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        var { dynamicslist } = this.data;
        var { id, type, workType } = options;
        if(!app.globalData.discoverInfo && id){
            var res = await createdynamicsModel.getDiscoverInfoDetail(id)
            app.globalData.discoverInfo = res.result[0]
            type = res.result[0].type
        }
        dynamicslist.discoverId = id
        console.log(dynamicslist , 'ID');
        
        //  如果是活动创建 这要获取 地理位置信息
        if(type == 'C') {
            const res = await getLocaltion();
            this.setData({
                address: res
            })
        }
        if (wx.getStorageSync('agreeProtocol')) {
            this.setData({
                agree: true
            })
        }
        
        if(options.fromH5){
            app.globalData.fromH5 = true
            app.globalData.unionid = options.unionId
            type = 'MXQH_202003'
        }   

        this.setData({
            dynamicslist,
            type: type ? type : null,
            workType: workType ? workType : null,
            fromH5: options.fromH5
        })

        app.getAccessToken()
    },
    /**
     * 添加话题
     */
    // selectTitle(e) {
    //     var msg = e.currentTarget.dataset['index']
    //     const { items } = this.data;
    //     items.map((item, i) => {
    //         items[i].selected = false;
    //         if (item.id == msg) items[i].selected = true;
    //     })
    // },

    // async checkImages(item, index){
    //     const { newImg } = this.data;

    //     let path = ''
    //      // 如果图片的 大小大于 1M 则压缩 图片
    //     if(item.size > 1024*1024){
    //         path = await app.compressImage(item.path,'compress');
    //     }else{
    //         path = item.path
    //     }
    //     const resT = await app.checkImage(path);
    //     const obj = newImg[index];
    //     // 验证通过
    //     if(resT){
    //         this.setData({
    //             ['newImg['+index+']']: Object.assign(obj,{isIllegal:true}),
    //             isIllegal:true
    //         })
    //     }
    // },
    /**
     * 上传照片
     */
    async chooseImg() {
        var _this = this
        var newimg = _this.data.newImg;
        const res = await app.chooseImage(9,{sizeType:['compressed']})
        const img = newimg.concat(res.tempFiles)
        if(img.length == 0) return
        img.forEach((item, index) => {
            img[index].left = (index % 5) * 70
            img[index].top = Math.floor((index / 5)) * 70
            img[index].isIllegal = false
        })
        this.setData({newImg:img})
        // img.map((item,index)=>{
        //     this.checkImages(item,index);
        // })

        // return
        
        _this.getImageInfo(img, 0).then((res) => {
            console.log(res,'上传图片')
            _this.setData({
                newImg: res,
                isUploaded: false
            });
            // todo 选取图片完成 上传图片
            _this.uploadImage(res, 0).then((res1) => {
                _this.setData({ isUploaded: true })
            });
        })
        
    },
    /**
     * 获取图片的详细信息
     * @param {图片数组} arr 
     * @param {*} i 
     */
    getImageInfo(arr, i) {
        return new Promise((resolve) => {
            wx.getImageInfo({
                src: arr[i].path,
                success(res) {
                    arr[i] = Object.assign(arr[i], res);
                    i++;
                    if (i < arr.length) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                }
            })
        }).then((res) => {
            if (res) return Promise.resolve(arr)
            else return this.getImageInfo(arr, i);
        })
    },

    uploadImage(arr, i) {
        const that = this;
        return new Promise((resolve) => {
            if (arr[i].OssPath || arr[i].isSize) {
                i++;
                if (i < arr.length) resolve(false);
                else resolve(true);
            } else {
                app.uploadImage(arr[i].path).then(data => {
                    const newimg = that.data.newImg;
                    newimg[i].OssPath = data.OssPath;
                    newimg[i].OssThumbUrl = data.oss_thumb_url;
                    newimg[i].FileName = data.FileName;
                    newimg[i].Width = data.width;
                    newimg[i].Height = data.height;
                    that.setData({
                        newImg: newimg
                    })
                    if (++i < arr.length) resolve(false);
                    else resolve(true);
                })
            }
        }).then(res => {
            if (res) return Promise.resolve(arr);
            else return this.uploadImage(arr, i);
        })
    },
    /**
     * newImg 是否有非法图片
     */
    isHaveIllegal(newImg){
       return newImg.reduce((pre,cur)=>{
            if(cur.isIllegal) pre = true;
            return pre
        },false)
    },

    /**
     * 删除图片
    */
    deleteImg(e) {
        const { index, img } = e.currentTarget.dataset;
        const { newImg } = this.data
        app.globalData.userInfo.mobileNo = '1923';
        detailModel.deletePhoto(img.FileName).then(res => {
            // todo 删除 newimg 索引为 index 的值
            newImg.splice(index, 1);
            this.setData({
                newImg,
                isIllegal: this.isHaveIllegal(newImg)
            })
        })
    },
    /**
     * 监听input输入框
    */
    watchMsg: function (e) {
        this.data.dynamicslist.content = e.detail.value
        this.setData({
            dynamicslist: this.data.dynamicslist,
            textareaNum: e.detail.cursor
        })
    },
    /**
     * 《用户隐私协议》弹窗
    */
    onShowProtocol() {
        this.setData({
            showProtocol: true
        })
    },
    signProtocol(e) {
        this.setData({
            agree: e.detail,
            showProtocol: false,
            agreeProtocol: wx.getStorageSync('agreeProtocol')
        })
    },
    /**
     * 点击 "同意 《用户隐私协议》"
    */
    agree() {
        this.setData({
            agree: !this.data.agree
        })
    },
    /**
     * 点击“发布”按钮
    */
    hcBtn(e) {
        const { dynamicslist, isUploaded, agree, isIssue } = this.data;
        if (isIssue || !agree || !isUploaded) return;
        const { isSize, arr } = this.getImageUrlAndSize();
        this.setData({
            isIssue: true
        })
        wx.showLoading({ title: '发布中' });
        app.verifyContent(dynamicslist.content).then(res => {
            if (res == false) {
                this.setErrorMessage('内容包含敏感词汇，请修改后重新提交')
            } else {
                if (isSize) {
                    this.setErrorMessage('请移除不符合尺寸的照片')
                    return;
                }
                if (arr.length > 0) {
                    var temp = []
                    arr.map((item)=>{
                        temp.push(item.picUrl)
                    })

                    app.checkNetImage(temp).then(res => {
                        // 鉴黄成功 
                        if (this.data.agree == false) {
                            this.setErrorMessage('请查看《用户隐私协议》，确认后才能发布')
                        } else {
                            // if(dynamicslist.tagsList.length>0){
                            dynamicslist.imgUrlsList = arr;
                            dynamicslist.unionId = app.globalData.unionid;
                            if(this.data.type == 'C') dynamicslist.address = this.data.address;
                            if(this.data.workType) dynamicslist.workType = this.data.workType;
                            createdynamicsModel.movementAdd(dynamicslist).then(res => {
                                if (res.code == 200) {
                                    this.setData({
                                        id: res.result.id,
                                        error: false,
                                        success: true,
                                        index: 1,
                                        isIssue: false
                                    })
                                    wx.hideLoading();
                                    // 创建动态 埋点
                                    if(app.globalData.activity_channel){
                                        app.globalData.mta.Event.stat('c_mtq_Dynamics_Banner_Partake',{
                                            'count':app.globalData.unionid,
                                            'channel': app.globalData.activity_channel
                                        })
                                    }
                                } else {
                                    // wx.showToast({
                                    //     title: res.toString()
                                    // })
                                    this.setErrorMessage(res.message)
                                }
                            })
                            // }else{
                            //     this.setErrorMessage('请添加话题')
                            // }
                        }
                    }).catch(arr => {
                        const { newImg } = this.data
                        newImg.map((img, index) => {
                            if(arr.indexOf(img.OssPath) != -1){
                                newImg[index].isIllegal = true
                            }
                        })
                        this.setData({
                            newImg
                        })
                        // 鉴黄失败
                        this.setErrorMessage('图片涉及违规信息，请修改后重新提交');
                        this.setData({
                            isIssue: false
                        })
                    })
                } else {
                    this.setErrorMessage('请上传图片')
                }
            }
        })
    },
    setErrorMessage(content) {
        wx.hideLoading();
        this.setData({
            error: true,
            success: false,
            index: 1,
            msgText: content,
            isIssue: false
        })
    },
    getImageUrlAndSize() {
        const { newImg } = this.data;
        let isSize = false;
        const arr = []
        newImg.map((item, i) => {
            if (item.isSize) isSize = item.isSize;
            arr.push({ 
                picUrl:item.OssPath,
                thumbnailUrl:item.OssThumbUrl,
                picId: item.FileName,
                fileSize:item.isSize,
                picHeight:item.Height,
                picWidth:item.Width
            })
        })
        return { isSize, arr }
    },
    /**
     * 取消
    */
    cancle() {
        this.setData({
            error: false,
            success: false
        })
    },
    /**
     * 点击发布成功的按钮
     */
    successBtn() {
        const { type,workType ,id , dynamicslist } = this.data;
        console.log(this.data,'this.data')
        if(type == 'C'){
            wx.redirectTo({
                // url: `/pages/discovery/list/list?id=${dynamicslist.discoverId}&unionId=${dynamicslist['unionId']}&type=${type}`,
                url: `/pages/discovery/detail/detail?id=${id}&unionId=${dynamicslist['unionId']}&type=${type}`,
            })
        }else if(workType){
            wx.redirectTo({
                url: `/pages/discovery/detail/detail?id=${id}&unionId=${dynamicslist['unionId']}&type=DGLG_2020`,
            })
        }else{
            wx.redirectTo({
                url: `/pages/discovery/detail/detail?id=${id}&unionId=${dynamicslist['unionId']}&type=${type}`,
            })
        }
    },
    /**
     * 开始拖动
     */
    startDrag(e){
        activityIndex = e.currentTarget.dataset.index
        activityX = e.changedTouches[0].clientX
        activityY = e.changedTouches[0].clientY
        left = this.data.newImg[activityIndex].left
        top = this.data.newImg[activityIndex].top
    },
    /**
     * 拖动中
     */
    draging(e){
        //让图片随着鼠标移动
        var item = this.data.newImg[activityIndex]
        //长度大于5才考虑垂直方向的拖动
        if (this.data.newImg.length > 5){
            var offsetY = e.changedTouches[0].clientY - activityY
            if (item.top + offsetY < 0){
                item.top = 0
            } else if (item.top + offsetY > 70){
                item.top = 70
            }else{
                item.top = item.top + offsetY
            }
        }
        var offsetX = e.changedTouches[0].clientX - activityX
        item.left = item.left + offsetX
        this.setData({
            ['newImg[' + activityIndex + ']']: item
        })
        activityX = e.changedTouches[0].clientX
        activityY = e.changedTouches[0].clientY
    },
    /**
     * 拖拽结束，重新排序
     */
    endDrag(e){
        var list = this.data.newImg
        //解决X轴边界问题
        if (list[activityIndex].left < 0){
            list[activityIndex].left = 0
        } else if (list[activityIndex].left > 275){
            list[activityIndex].left = 275
        }

        //判断是否发生了上下移动
        var carry = top > 0 ? 5 : 0
        if (Math.abs(list[activityIndex].top - top) > 35){
            carry = list[activityIndex].top - top > 0 ? 5 : -5
        }
        //被交换图片的索引
        var exchangeIndex = Math.floor((list[activityIndex].left + 35)/ 70)
        console.log(exchangeIndex)
        //判断被交换位置是否有元素存在
        if (list[exchangeIndex + carry] !== undefined){
            exchangeIndex += carry
        }
        if (exchangeIndex >= list.length){
            exchangeIndex = list.length - 1
        }
        //数组中两个元素互换
        list[activityIndex] = list.splice(exchangeIndex, 1, list[activityIndex])[0];
        list[exchangeIndex].left = list[activityIndex].left
        list[exchangeIndex].top = list[activityIndex].top
        list[activityIndex].top = top
        list[activityIndex].left = left
        
        this.setData({
            ['newImg[' + activityIndex + ']']: list[activityIndex],
            ['newImg[' + exchangeIndex + ']']: list[exchangeIndex]
        })
    }
})
