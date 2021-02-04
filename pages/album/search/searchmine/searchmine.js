// pages/album/search/searchmine/searchmine.js
import regeneratorRuntime from '../../../../utils/runtime';
import { Searchmine } from './searchmine-model.js'
const searchmineModel = new Searchmine()

import { Search } from '../search-model.js'
const searchModel = new Search()

import { Upload } from '../../upload/upload-model.js'
var uploadModel = new Upload()


const Request = require("../../../../utils/upload"); //导入模块

var app = getApp()
var canvas_width = 136,
    canvas_height = 136;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        selectBtn: false,
        allList: [],
        mineImg: [],
        mine: 1,
        navigationHeight: app.globalData.navigationHeight,
        move: 'up',
        navigateText: 'true',
        activityId: 0,
        canvas_width: 136,
        canvas_height: 136,
        num: 0,
        imgAll: {},
        uploadImg: false,
        selectList: [],
        newImg: [],
        upload: true,
        len: 0,
        OssPath: '',
        faceid: '',
        putImg: false,
        pageNo:1,
        pageSize: 60,
        pages: null,
        isLoading: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function(options) {
        //导航栏标题
        wx.setNavigationBarTitle({
            title: '请确认本人'
        })
        //获取unionid
        searchmineModel.getUnionid().then(() => {})
        //获取服务令牌
        app.getAccessToken(app.globalData.roomInfo.room_no)
        //获取房间号
        this.setData({
            activityId: app.globalData.roomInfo.room_no,
        })
        //自己的全部图片
        this.getListAll();
    },
      /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        const pageNo = this.data.pageNo;
        this.setData({
            pageNo:pageNo+1
        })
        this.getListAll();
    },
    async getListAll(){
        this.setData({isLoading: true})
        const { pageNo, pageSize, mineImg } = this.data;
        const res = await searchModel.listAll({
            activityId:app.globalData.roomInfo.room_no,
            pageNo,
            pageSize
        });
        if(res.code == 200){
            const { list, pages } = res.result;
            const temp = mineImg.concat(list)
            this.setData({
                mineImg:temp,
                pages,
                isLoading: false
            })
        }else{
            this.setData({isLoading: false})
        }
    },
    /**
     * 上传照片
     */
    chooseImg: async function() {
        var _this = this
        _this.setData({
            newImg: []
        })
        var newImg = _this.data.newImg
        var len = _this.data.len
        const res = await app.chooseImage(1, {sizeType:['compressed']});
        len = res.tempFiles[0].size
        newImg.push(res.tempFilePaths[0])
        _this.setData({
            newImg: newImg,
            len: len
        })
        _this.getImg();
    },
    /**
     * 手机上传的图片，调后台接口，取出所有的头像照片
     */
    async getImg() {
        //获取图片地址
        var newImg = this.data.newImg
            //导航栏标题
        wx.setNavigationBarTitle({
            title: '识别中'
        })
        this.setData({
            putImg: true
        })

        try {
            var obj = await app.uploadImage(newImg[0])
        } catch (error) {
            return wx.showToast({
                title: error,
                icon: 'none'
            })
        }

        try {
            await app.checkNetImage(obj.OssPath)
        } catch (error) {
            this.setData({
                putImg: false,
                upload: false,
            })
            return wx.showToast({
                title: '图片内容审核不通过',
                icon: 'none'
            })
        }

        var msg = {
            FileName: obj.FileName,
            picUrl: obj.OssPath,
            thumbnailUrl: obj.oss_thumb_url,
            activityId: app.globalData.roomInfo.room_no
        }

        await uploadModel.saveImageDetail(msg)
        uploadModel.delImage(obj.FileName)
        
        var res = await searchmineModel.getFace(obj.FileName)
        var img = res.result

        console.log(img);
        
        
        if (img != null) {
            var realImg = []
            img.forEach((item, index) => {
                if (item.left != null) {
                    realImg.push(item)
                    item.width = parseInt(item.width * 1.6)
                    item.height = parseInt(item.height * 1.6)
                } else {
                    wx.showToast({
                        title: '识别失败',
                        icon: 'none'
                    })

                }
            })
            this.setData({
                allList: realImg,
                putImg: false,
                upload: false,
            })
        } else {
            wx.setNavigationBarTitle({
                title: '请确认本人'
            })
            wx.showToast({
                title: res.message,
            })
            this.setData({
                putImg: false,
                upload: false,
            })
        }
    },
    /**
     * 选择照片
     */
    radioChange: function(e) {
        app.globalData.userInfo.groupFaceId = e.detail.value
        this.setData({
            selectBtn: true,
            groupFaceId: e.detail.value
        })
    },
    /**
     * 点击“确定”按钮，返回上一页
     */
    async btnSelect() {
        // searchmineModel.updatauser(app.globalData.userInfo.groupFaceId).then(() => {})
        const { unionid, activityInfo } = app.globalData;
        const res  = await searchModel.faceSave({
            activityId: activityInfo.activityId,
            groupFaceId: this.data.groupFaceId,
            unionId: unionid
        })
        console.info(res)
        wx.navigateBack({
            delta: 1
        })
    },

})