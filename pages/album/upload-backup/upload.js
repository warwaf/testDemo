import { Home } from '../home/home-model.js'
import { Detail } from '../detail/detail-model.js'
import { Upload } from './upload-model.js'

var customerInfo = require("customerInfo.js")
var homeModel = new Home()
var detailModel = new Detail()
var uploadModel = new Upload()

let interval;
//index.js
//获取应用实例
var app = getApp(),
    userinfo, order_work_id, share, max_number, has_number, is_self, article_id, refresh = 1, image_upload_arr = new Array()

Page({
    data: {
        list: [],
        access_token: '',//  访问令牌    
        Total_photos: 0, //  当前产品的图片数量   
        curent: null, //  当前操作list的图片的下标
        upload_num: 0, // 已经上传的图片数量
        len: 0, //  上传时遍历file的下标
        upload_loading: false, //  是否有上传图片
        isuploadclick: false, //上传按钮变灰色
        UploadUrl: '', // 上传Url
        finishtask: false, // 结束上传任 
        Total_num: 0,//无限上传图片的标志 0是无限, 1是限制上传
        isSort: 1,//是否排序，0是不排序,1是排序的
        order_sn: '',//订单编号
        job_id: '', // 作业单号 
        tempFiles: {}, // 临时存储已经选好图片的本地文件列表，每一项是一个 File 对象
        finishlink: '',// 空值是弹出结束任务单提示，值代表是跳转的链接
        finishMsgid: '1', // 结束任务单弹出信息msgid类型
        finishMessage: '',//结束任务单信息
        CancelCTask: '0',//0表现显示取消任务上传任务按钮隐藏，1表示显示
        DeleteCPhotos: '0',//0表现显示删除照片按钮隐藏，1表示显示
        iscancel: false,//是否点击了取消任务
        isload: true,
        uploadError: [],//上传过程中失败的图片提示信息
        percent: 0,//上传进度
        uploadKey: null,//正在上传图片的下标
        bannerSrc: 'http://hcmtq.oss-cn-hangzhou.aliyuncs.com/SystemImg/red.png',
        isloaded: false,
        isgreen: false,
        barrageFly: [],
        posLeft: 0,  //水平滚动方法三中left值
        completePrent: 0,
        allSize: 0,
        completePrentNum: 0,
        loaded: 0,//显示加载图有勾
        showVouchers: false,
        showProtocol: false,
        agreeProtocol: false,
        amount: 0,
        room_no: 0,
        active:false
    },
    /**
     *  替换/添加 图片
     */
    onItemClick: function (event) {
        var e = event.currentTarget.dataset
        var _this = this;
        var _query = this.data
        var _item = null, key = null
        this.setData({
            curent: null
        })
        if (JSON.stringify(e) !== "{}") {
            _item = e.item  //图片的地址
            key = e.key
            this.setData({
                curent: key
            })
        }
        let count = 1;
        if (_item !== null && key !== null && _item.src == null) {
            let currentSize = 0;
            for (var i = 0; i < _query.list.length; i++) {
                var item = _query.list[i];
                if (item.src !== null) {
                    currentSize++;
                }
            }
            //  count =  currentSize == 0 ? _query.list.length > 9 ? 9 : _query.list.length : _query.list.length - currentSize > 9 ? 9 : _query.list.length - currentSize;
        } else {
            if (_item == null && key == null) {
                count = 9
            } else {
                count = 1
            }
        }
        wx.chooseImage({
            count: count,
            sizeType: ['original'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                var fileLen = res.tempFilePaths.length;
                if (fileLen > 0) {
                    // uploadPhoto(_this, res.tempFilePaths, res.tempFiles, 0)
                    // 图片的地址，图片的详情（地址、图片大小），
                    _this.previewWechat(res.tempFilePaths, res.tempFiles, null)

                }
            },
        });
    },
    previewWechat(tempFilePaths, tempFiles, base64url) {
        wx.showToast({
            title: '',
            mask: true,
            icon: 'loading',
            duration: 1000
        });
        if (tempFilePaths.length > 0){
            this.setData({
                active:true
            })
        }
        var _query = this.data
        if (_query.curent !== null) {//限制了图片图片数量
            if (base64url != null) {
                _query.list[_query.curent].src = base64url[0];
                base64url.splice(0, 1);
            } else {
                _query.list[_query.curent].src = tempFilePaths[0];
            }
            _query.tempFiles[tempFilePaths[0]] = tempFiles[0]
            tempFilePaths.splice(0, 1);
            tempFiles.splice(0, 1);
            for (var k = 0; k < _query.list.length; k++) {
                if (k != _query.curent && _query.list[k].src == null && tempFilePaths.length > 0) {
                    for (var i = 0; i < tempFilePaths.length; i++) {
                        if (base64url != null) {
                            _query.list[k].src = base64url[i];
                            base64url.splice(i, 1);
                        } else {
                            _query.list[k].src = tempFilePaths[i];
                        }
                        _query.tempFiles[tempFilePaths[i]] = tempFiles[i]
                        tempFilePaths.splice(i, 1);
                        tempFiles.splice(0, 1);
                        break;
                    }
                }
            }
            if (_query.list[_query.curent].isupload == 1) {
                //上传被更改的图片
                _query.list[_query.curent].isupload = 2;
            }
        } else {//不限制图片图片数量， 无限上传 lym 2018.06.19 更新
            for (var i = 0; i < tempFilePaths.length; i++) {
                var cur_src = ''
                if (base64url != null) {
                    cur_src = base64url[i];
                } else {
                    cur_src = tempFilePaths[i];
                }
                _query.list.push({ src: cur_src, isupload: 0, FileName: null })
                _query.tempFiles[tempFilePaths[i]] = tempFiles[i]
            }
        }
        this.setData({
            list: _query.list,
            tempFiles: _query.tempFiles,
            isgreen: true
        })
        wx.hideLoading()
    },
    /**
     * 点击按钮，开始上传 图片
     */
    uploadimage: function () {
        if (!this.data.agreeProtocol){
            return
        }
        var _query = this.data
        var size = 0
        if (_query.isuploadclick == false) {
            var uploadfile = [];
            for (var i = 0; i < _query.list.length; i++) {
                if (
                    _query.list[i].src != null &&
                    (_query.list[i].isupload == 0 || _query.list[i].isupload == -1 || _query.list[i].isupload == 2)
                ) {
                    var strfile = { sort_no: i, file: _query.list[i].src };
                    uploadfile.push(strfile);
                    _query.isuploadclick = true;
                    size = size + _query.tempFiles[_query.list[i].src].size
                }
            }
            if (uploadfile.length > 0) {
                clearInterval(interval);
                this.setData({
                    upload_loading: true,//上传进度  
                    allSize: size,
                    completePrent: 0,
                    completePrentNum: 0,
                })
                uploadPhoto(this, uploadfile, 0);
            } else {
                wx.showModal({
                    title: '提示',
                    content: '暂无上传的图片',
                    showCancel: false
                })
            }

            this.setData({
                isuploadclick: _query.isuploadclick,
                uploadError: []

            })

        }
    },
    onLoad: function (options) {
        // 初始化数据        
        if (typeof app.globalData.options) {
            app.globalData.options.access_key = 'BCTyY2cdvcFZApwz'
            app.globalData.options.store_id = 'C1509'
            app.globalData.options.branch_id = 'C1509-1'
            app.globalData.options.scene_name = '时尚街拍'
            app.globalData.options.channel_id = 'Beautify'
            app.globalData.options.product_sku = '1004576'
            app.globalData.options.if_correct = '1'
            app.globalData.options.Total_num = '0'//无限上传图片的标志 0是无限, 1是限制上传
            app.globalData.options.isjob_id = '1'
            app.globalData.options.finishMsgid = '0'  // 1是msgid类型
            app.globalData.options.CancelCTask = '0' //0表现显示取消任务上传任务按钮隐藏，1表示显示
            app.globalData.options.DeleteCPhotos = '1' //0表现显示删除照片按钮隐藏，1表示显示 
            app.globalData.options.isSort = '1'//是否排序，0是不排序,1是排序的
            app.globalData.options.finishlink = '' //0表现显示删除照片按钮隐藏，1表示显示
            app.globalData.options.customer_phone = app.globalData.userInfo.mobileNo ? app.globalData.userInfo.mobileNo : '13725372605'//'13725372605' 
            app.globalData.options.customer_name = '檬太奇'
            app.globalData.options.order_sn = app.globalData.roomInfo.room_no ? app.globalData.roomInfo.room_no : '' //'123'
            getAccessToken(this)
            var _this = this
            var params = app.globalData.options
            var finishMessage = ''
            if (params.finishMsgid != undefined) {
                wx.request({
                    url: app.globalData.hucaiApi + 'message/' + params.store_id + '_' + params.branch_id + '.json', //app.globalData.hucaiApi + 'messages/messages.json',
                    method: 'get',
                    success: function (res) {
                        var msg = res.data;
                        for (var k = 0; k < msg.length; k++) {
                            if (params.finishMsgid == msg[k].msgid) {
                                finishMessage = msg[k].messages
                                _this.setData({
                                    finishMessage: finishMessage
                                })
                                break;
                            }
                        }

                    }
                })
            }
            this.setData({
                order_sn: params.order_sn,
                Total_num: Number(app.globalData.options.Total_num),//无限上传图片的标志 0是无限, 1是限制上传
                isSort: Number(app.globalData.options.isSort),//是否排序，0是不排序,1是排序的
                finishlink: app.globalData.options.finishlink,// 空值是弹出结束任务单提示，值代表是跳转的链接
                finishMsgid: app.globalData.options.finishMsgid, // 结束任务单弹出信息msgid类型
                finishMessage: finishMessage,
                bannerSrc: options.bannerSrc ? options.bannerSrc : this.data.bannerSrc,
                posLeft: wx.getSystemInfoSync().windowWidth

            })
        }

        if (wx.getStorageSync('agreeProtocol')){
            this.setData({
                agreeProtocol: true
            })
        }
    },
    onShow: function () {
        this.setData({
            barrageFly: customerInfo.flyList
        })
    },
    /**
     * 点击按钮，返回上一页
     */
    gotoHome() {
        wx.redirectTo({
            url: '/pages/album/home/home?from_upload=1',
        })
    },
    /**
     * 点击按钮，“继续上传”
     */
    uploadContinue: function () {

        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff',
            animation: {
                duration: 400,
                timingFunc: 'easeIn'
            }
        })
        wx.setBackgroundColor({
            backgroundColor: '#ffffff', // 窗口的背景色为白色
        })
        this.setData({
            list: [],
            isloaded: false,
            isgreen: false,
            upload_loading: false, //  是否有上传图片
            isuploadclick: false, //上传按钮变灰色
            completePrent: 0,
            allSize: 0,
            completePrentNum: 0,
            loaded: 0
        })

    },
    checklist(_this) {
        var isgreen = false,
            _query = _this.data
        if (_query.list.length == 0) {
            isgreen = false
        } else {
            for (var q = 0; q < _query.list.length; q++) {
                if (_query.list[q].isupload == 0) {
                    isgreen = true
                    break;
                }
            }
        }
        _this.setData({
            isgreen: isgreen
        })
    },
    /**
     * 删除图片
     */
    deletePhotos(event) {
        var item, i;
        var _query = this.data
        if (JSON.stringify(event.currentTarget.dataset) !== "{}") {
            item = event.currentTarget.dataset.item
            i = event.currentTarget.dataset.key
            var file_name = item.FileName
            var formData = {
                access_token: app.globalData.options.access_token,
                job_id: app.globalData.options.job_id,
                file_name: file_name
            }
            var _this = this
            if (_query.list[i].isupload == 1) {
                wx.request({
                    url: app.globalData.ossApi + 'api/fileapi/DeleteCPhotos',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    data: formData,
                    success: function (res) {
                        var obj = res.data;
                        if (obj.code == 0) {
                            if (Number(_query.Total_num) > 0) {
                                var a = { src: null, isupload: 0, FileName: null };
                                _query.list[i] = a

                            } else {
                                _query.list.splice(i, 1);

                            }
                            _query.upload_num--;
                            _this.setData({
                                upload_num: _query.upload_num,
                                list: _query.list,
                            })
                            _this.checklist(_this)
                        } else {
                            wx.showModal({
                                title: '提示',
                                content: obj.message,
                                showCancel: false,
                                success: function (res) {
                                    if (res.confirm) {

                                    }
                                }
                            })
                        }
                    }
                })
            } else {
                if (_query.tempFiles[_query.list[i].src]) {
                    delete _query.tempFiles[_query.list[i].src]
                }
                if (Number(_query.Total_num) > 0) {
                    var a = { src: null, isupload: 0, FileName: null };
                    _query.list[i] = a

                } else {
                    _query.list.splice(i, 1);
                }
                _this.setData({
                    list: _query.list,
                    tempFiles: _query.tempFiles
                })
                _this.checklist(_this)
            }
        }
    },
    addCount() {
        this.setData({
            uploadKey: null,//正在上传图片的下标
            isloaded: true
        })
        homeModel.modifyRedPacket().then(res => {
            this.setData({
                amount: res.data,
                showVouchers: true
            })
        })
    },
    closeVouchers: function () {
        this.setData({
            showVouchers: false
        })
    },
    signProtocol(){
        this.setData({
            showProtocol: false,
            agreeProtocol: wx.getStorageSync('agreeProtocol')
        })
    },
    onShowProtocol(){
        this.setData({
            showProtocol: true
        })
    },
    showTip(e){
        var curIndex = e.currentTarget.dataset.index
        this.setData({
            ['list[' + curIndex +'].isupload']: -2
        })
    }
})
function uploadPhoto(_this, uploadfile, i) {
    var _query = _this.data
    // 获取文件路径
    var filePath = uploadfile[i].file;
    // 获取文件名
    // var fileName = filePath.match(/(wxfile:\/\/)(.+)/)
    // fileName = fileName[2]
    var isreplace = false;
    var formData = {
        access_token: app.globalData.options.access_token,
        job_id: app.globalData.options.job_id,
        length: _query.tempFiles[filePath].size
    }
    //if (_query.isSort == 1) {// 限制图片上传数量
    formData.sort = (uploadfile[i].sort_no + 1)
    //}
    if (_query.list[uploadfile[i].sort_no].isupload == 2) {
        formData.if_replace = 1
        isreplace = true
    }
    _this.setData({
        uploadKey: uploadfile[i].sort_no,//正在上传图片的下标
    })
    console.info(app.globalData.options.uploadurl)
    var upa = wx.uploadFile({
        url: app.globalData.options.uploadurl,
        //app.globalData.ossApi + 'api/fileapi/UploadCFile',//app.globalData.options.uploadurl, //"https://"+sres.region+".file.myqcloud.com/files/v2/"+sres.appid+"/"+sres.bucket+sres.folder+'wx'+new Date().getTime()+'.'+fileName.split('.')[1],
        filePath: filePath,
        name: 'filecontent',
        formData: formData,
        success: function (uploadRes) {
            i++;
            _query.completePrent = _query.completePrent + formData.length
            if (uploadRes.statusCode == 200) {
                var obj = JSON.parse(uploadRes.data);
                if (obj.code === 0) {
                    let a = uploadfile[(i - 1)].sort_no
                    if (isreplace == false) {
                        _query.upload_num++;
                    }
                    _query.list[a].isupload = 1;
                    _query.list[a].src = obj.data.oss_thumb_url;
                    _query.list[a].FileName = obj.data.FileName;
                    _query.list[a].picId = obj.data.FileName;
                    _query.list[a].picUrl = obj.data.OssPath;
                    _query.list[a].thumbnailUrl = obj.data.oss_thumb_url;
                    _query.upload_loading = true;
                    //图片校验 --> 改成后台校验，失败返回500
                    uploadModel.saveImageDetail(_query.list[a]).then(res => {
                        if(res.code == 500){
                            _query.list[a].isupload = -1
                            _this.setData({
                                list: _query.list
                            })
                        }
                        _query.upload_loading = true;
                        if (i === uploadfile.length) {
                            _query.finishtask = true;
                            _query.isuploadclick = false;
                            _this.addCount();
                            wx.setNavigationBarColor({
                                frontColor: '#000000',
                                backgroundColor: '#FFEB4F',
                                animation: {
                                    duration: 400,
                                    timingFunc: 'easeIn'
                                }
                            })
                            wx.setBackgroundColor({
                                backgroundColor: '#ffeb4f', // 窗口的背景色为白色
                            })
                        } else {
                            _query.isuploadclick = false;
                            uploadPhoto(_this, uploadfile, i)
                        }
                    })
                } else {
                    var d = uploadfile[(i - 1)].sort_no
                    _query.list[d].isupload = -1;
                    _query.uploadError.push("图" + i)
                    wx.hideLoading();
                    wx.showModal({
                        title: '提示',
                        content: obj.message,
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                if (i === uploadfile.length) {
                                    _this.setData({
                                        uploadKey: null,//正在上传图片的下标
                                    })
                                    if (_query.uploadError.length > 0) {
                                        wx.showModal({
                                            title: '提示',
                                            content: _query.uploadError.join(",") + "上传失败",
                                            showCancel: false,
                                            success: function (res) {
                                                if (res.confirm) {

                                                }
                                            }
                                        })
                                    }
                                    _query.finishtask = true;
                                    _query.isuploadclick = false;
                                } else {
                                    _query.isuploadclick = false;
                                    uploadPhoto(_this, uploadfile, i)
                                }
                            }
                        }
                    })
                }
            } else {
                wx.hideToast()
                _query.uploadError.push("图" + i)
                var _errorstr = ""
                wx.showModal({
                    content: _query.uploadError.join(",") + "上传失败",
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) {
                            if (i === uploadfile.length) {
                                _this.setData({
                                    uploadKey: null,//正在上传图片的下标
                                })
                                _query.finishtask = true;
                                _query.isuploadclick = false;
                            } else {
                                _query.isuploadclick = false;
                                uploadPhoto(_this, uploadfile, i)

                            }
                        }
                    }
                })
            }
            _this.setData({
                list: _query.list,
                upload_loading: _query.upload_loading,
                finishtask: _query.finishtask,
                isuploadclick: _query.isuploadclick,
                upload_num: _query.upload_num,
                uploadError: _query.uploadError,
                completePrent: _query.completePrent
            })

        },
        fail: function (e) {
            wx.showToast({
                title: '上传超时',
                mask: true,
                icon: 'loading',
                duration: 6000
            });
        }
    })
    //上传的进度条
    upa.onProgressUpdate((res) => {
        //(+已经上传的数据长度)/数据总长度
        var newPrenct = parseInt((_this.data.completePrent + res.totalBytesSent) / _this.data.allSize * 100)
        if (newPrenct == 100) {
            setTimeout(function () {
                _this.setData({
                    loaded: 1
                })
            }, 1500)
        }
        _this.setData({
            completePrentNum: newPrenct
        })
    })
}
function getAccessToken(that) {
    wx.showToast({
        title: '加载中...',
        mask: true,
        icon: 'loading',
        duration: 60000
    });
    var options = app.globalData.options
    var params = {
        access_key: options.access_key,
        store_id: options.store_id,
        branch_id: options.branch_id,
        customer_name: options.customer_name,
        customer_phone: options.customer_phone,
        scene_name: options.scene_name,
        product_sku: options.product_sku,
        if_correct: options.if_correct,
        channel_id: options.channel_id,
        job_id: options.order_sn,
    }
    var _this = that
    wx.request({
        url: app.globalData.ossApi + 'api/fileapi/GetCAccessToken',
        data: params,
        success: function (sres) {
            if (sres.data.code == 0) {
                app.globalData.options.access_token = sres.data.data.AccessToken
                app.globalData.options.job_id = sres.data.data.job_id
                app.globalData.options.uploadurl = sres.data.data.UploadUrl.substring(0, sres.data.data.UploadUrl.length - 1)
                _this.setData({
                    job_id: sres.data.data.job_id,
                    Total_photos: sres.data.data.Total_photos,
                    isload: false
                })
                wx.hideToast();
            } else {
                wx.hideLoading();
                var error_msg = sres.data.message
                if (error_msg == 'AccessKey无效') {
                    error_msg = '店铺密钥无效'
                } else if (error_msg == 'branch_id无效') {
                    error_msg = '渠道ID无效'
                }
                wx.showModal({
                    title: '提示',
                    content: error_msg,
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) {
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    }
                })
            }
        },
        fail: function (xf) {
            wx.hideLoading();
        }
    })
}


