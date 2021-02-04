//index.js
//获取应用实例
var app = getApp(),
  userinfo, order_work_id, share, max_number, has_number, is_self, article_id, refresh = 1, image_upload_arr = new Array()
  
Page({
  data: {
    list: [],
    access_token: '',//  访问令牌    
    Total_photos: 0,//  当前产品的图片数量   
    curent: null, //  当前操作list的图片的下标
    upload_num: 0, // 已经上传的图片数量
    len: 0, //  上传时遍历file的下标
    upload_loading: false, //  是否有上传图片
    isuploadclick: false, //上传按钮变灰色
    UploadUrl: '', // 上传Url
    _broswer: '', //浏览器环境信息
    finishtask: false, // 结束上传任 
    Total_num: 0,//无限上传图片的标志 0是无限, 1是限制上传
    isSort: 1,//是否排序，0是不排序,1是排序的
    order_sn: '',//订单编号
    job_id:'', // 作业单号 
    tempFiles: {}, // 临时存储已经选好图片的本地文件列表，每一项是一个 File 对象
    finishlink: '',// 空值是弹出结束任务单提示，值代表是跳转的链接
    finishMsgid: '1', // 结束任务单弹出信息msgid类型
    finishMessage:'',//结束任务单信息
    CancelCTask: '0',//0表现显示取消任务上传任务按钮隐藏，1表示显示
    DeleteCPhotos:'0',//0表现显示删除照片按钮隐藏，1表示显示
    isdel: false,//是否点击了删除按钮
    iscancel: false,//是否点击了取消任务
    isload:true,
    uploadError:[],//上传过程中失败的图片提示信息
    percent:0,//上传进度
    uploadKey:null,//正在上传图片的下标

  },
  onItemClick: function (event) {
    console.log('event', event)    
    var _this = this;
    var _query=this.data 
    var _item=null, key=null
    this.setData({
      curent: null
    })
    if (JSON.stringify(event.currentTarget.dataset) !== "{}") {
       _item = event.currentTarget.dataset.item
       key = event.currentTarget.dataset.key
      this.setData({
        curent: key
      })
    }
    let count=1;
    if (_item !== null && key !== null && _item.src == null){   
    let currentSize = 0;
    for (var i = 0; i < _query.list.length; i++) {
      var item = _query.list[i];
      if (item.src !== null) {
        currentSize++;
      }
    }
     count =
      currentSize == 0
        ? _query.list.length > 9 ? 9 : _query.list.length
        : _query.list.length - currentSize > 9
          ? 9
          : _query.list.length - currentSize;
    }else{
      if (_item == null && key == null){
        count = 9
      }else{
        count = 1 
      }
     
    }
    wx.chooseImage({
      count: count,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // console.log(res);
        var fileLen = res.tempFilePaths.length;
        if (fileLen > 0) {
         // uploadPhoto(_this, res.tempFilePaths, res.tempFiles, 0)
          _this.previewWechat(res.tempFilePaths, res.tempFiles,null) 
              
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
    var _query=this.data
    if (_query.curent !== null) {//限制了图片图片数量
      if (base64url != null) {
        _query.list[_query.curent].src = base64url[0];
        base64url.splice(0, 1);
      } else {
        _query.list[_query.curent].src = tempFilePaths[0];
        console.log(_query.list)
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
        //  if(this.list[this.list.length]==undefined){
        //    //  src不等于null, isupload为0时当前图片还未上传,为1时当前图片已经上传,为-1时当前图片上传失败， 点击上传时需要上传改张图片
        //    this.file[this.list.length] = files.FormFileData[i];
        //  this.file[this.list.length]={ src: cur_src, isupload: 0, FileName:null };
        //  }else{
        //     this.list[this.list.length].src = cur_src;
        //     this.file[this.list.length] = cur_src;
        //  }
        
        _query.list.push({ src: cur_src, isupload: 0, FileName: null })
        _query.tempFiles[tempFilePaths[i]] = tempFiles[i]

      }


    }
    this.setData({
      list: _query.list,     
      tempFiles: _query.tempFiles     
    })
    wx.hideLoading()
    console.log('_query.list', _query.list)
  },
  uploadimage:function(){
    var _query=this.data    
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
          }
        }
      if (uploadfile.length>0){
        uploadPhoto(this, uploadfile, 0);
      }else{        
        wx.showModal({
          title: '提示',
          content: '暂无上传的图片',
          showCancel: false
        }) 
      }
     
      this.setData({
        isuploadclick: _query.isuploadclick,
        uploadError:[]  

      }) 
     
    }
  },  
  onLoad: function (options) {
    // 初始化数据    
    if (typeof app.globalData.options) {
      getAccessToken(this)
      var _this=this
      var params = app.globalData.options
      var finishMessage=''
      if (params.finishMsgid !=undefined){
         wx.request({
           url: app.globalData.hucaiApi + 'message/' + params.store_id + '_' + params.branch_id + '.json', //app.globalData.hucaiApi + 'messages/messages.json',
          method:'get',         
          success: function (res) {
            var msg=res.data; 
      /*  var msg = [
          {
            "msgid": "1",
            "messages": "上传任务已经结束，订单编号为{{订单编号}}"
          },
          {
            "msgid": "2",
            "messages": "上传任务已经结束，作业单号为{{作业单号}}"
          }
        ] */
            for (var k = 0; k < msg.length; k++){
              if (params.finishMsgid==msg[k].msgid){
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
        Total_num: Number(params.Total_num == '0' ? 0 : 1),//无限上传图片的标志 0是无限, 1是限制上传
        isSort: Number(params.isSort == '0' ? 0 : 1),//是否排序，0是不排序,1是排序的
        finishlink: params.finishlink != undefined ? params.finishlink:'0',// 空值是弹出结束任务单提示，值代表是跳转的链接
        finishMsgid: params.finishMsgid, // 结束任务单弹出信息msgid类型
        finishMessage: finishMessage
      })
    }
  },
  onShow: function () {
   

  },
  GetCPhotos:function() {
    // 获取已上传照片列表
    var _this=this
    var params = app.globalData.options
    var parm = {
      access_token: params.access_token,
      job_id: params.job_id,
      sort:'1' //params.isSort > 0 ? "1" : "0"
    };
    wx.request({
      url: app.globalData.ossApi + 'api/fileapi/GetCPhotos',
      data: parm,
      success: function (res) {

        var obj = res.data;
        if (obj.code == 0) {
          var sortList = obj.data;
          _this.totalphotos(sortList);
        } else {
          wx.showModal({
            title: '提示',
            content: obj.message,
            showCancel:false
          })
      }
        wx.hideToast();
      }
    })
  },
  totalphotos: function(sortList) {
    //  展示当前订单图片总数
    // console.log(sortList)
    var Photos = sortList.Photos;
    var _this=this.data
    var _list = new Array, _file=new Array, _upload_num = _this.upload_num, _finishtask = _this.finishtask
    if (Number(_this.Total_num) > 0) {
      for (var i = 0; i < Number(_this.Total_photos); i++) {        //  单张的上传

        var a = { src: null, isupload: 0, FileName: null }; //  src不等于null, isupload为0时当前图片还未上传,为1时当前图片已经上传,为-1时当前图片上传失败， 点击上传时需要上传改张图片
        for (var k = 0; k < Photos.length; k++) {
          if (i === Number(Photos[k].sort_no) - 1) {
            a.src = Photos[k].oss_thumb_url;
            a.FileName = Photos[k].file_name;
            a.isupload = 1;
            _upload_num++;
            _finishtask = true
            break;
          }
        }

        _list.push(a);
      }
      //  _this.list= new Array(Number(_this.$route.query.total_photos))     
      if (Number(_this.Total_photos) == 0) {
        _list = new Array(Number(_this.Total_photos)); // 单张的上传
        
      }
      
    } else {  // 不限制图片上上传数量

      for (var k = 0; k < Photos.length; k++) {
        var a = { src: Photos[k].oss_thumb_url, isupload: 1, FileName: Photos[k].file_name }; //  src不等于null, isupload为0时当前图片还未上传,为1时当前图片已经上传,为-1时当前图片上传失败， 点击上传时需要上传改张图片
        _upload_num++;
        _finishtask = true
        _list.push(a);

      }
    
    }
    this.setData({
      upload_num: _upload_num,
      finishtask: _finishtask,     
      list: _list
    })
  },
  FinishCTask:function(){
    var _query=this.data
    var params = app.globalData.options
    var parm = {
      access_token: params.access_token,
      job_id: params.job_id}
     wx.request({
      url: app.globalData.ossApi + 'api/fileapi/FinishCTask',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },      
      data: parm,
      success: function (res) {
        var obj = res.data;
        if (obj.code == 0)  {
          if (_query.finishMsgid == '0') {
            if (_query.finishlink !== '0') {//是否跳转
              window.location.href = _query.finishlink
            }
          } else { 
          var _readystr='';          
          var _tempstr='';
          var isflag=false;
          for (var i = 0; i < _query.finishMessage.length; i++){
            var _str = _query.finishMessage[i]
              if(_str =='{'){
                isflag=true;
                _str=''
              } else if (_str == '}') {
                _str = ''
                if (_tempstr=='订单编号'){
                  _str = params.order_sn
                } else if (_tempstr == '作业单号') {
                  _str = params.job_id
                }              
                _tempstr = '';
                isflag = false;
               
              }
            if (isflag){
              _tempstr = _tempstr+_str
              }else{
                  _readystr = _readystr + _str
              }
         }
          wx.showModal({
            title: '提示',
            content: _readystr != '' ? _readystr:'上传任务已经结束',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                if (_query.finishlink !=='0'){//是否跳转
                  // wx.navigateTo({
                  //   url: _query.finishlink
                  // }) 
                  var _path = encodeURIComponent(_query.finishlink)
                  wx.navigateTo({
                    url: '/pages/webview/webview?path=' + _path
                  })
                }
              }
            }
          }) 
        }
         } else {
          wx.showModal({
            title: '提示',
            content: obj.message,
            showCancel: false
          })
        }
        wx.hideLoading();
      },
   
  fail:function(error){
    wx.hideLoading();
    wx.showModal({
      title: '提示',
      content: error.status,
      showCancel: false
    })
  }  
  }) 
  },
  showdeletcon:function() {
    var _query=this.data
    if (_query.isdel == false) {    
      this.setData({
        isdel: true       
      })
    } else {
      this.setData({
        isdel: false
      })
    }
  },
  deletePhotos(event) {    
    var item,i;
    var _query=this.data
    if (JSON.stringify(event.currentTarget.dataset) !== "{}") {
      item = event.currentTarget.dataset.item
      i = event.currentTarget.dataset.key
    var file_name = item.FileName
    //file_name.substring(0,file_name.lastIndexOf("."))
    //  var parm = {
    //   access_token: this.access_token,
    //   job_id: this.job_id,
    //   file_name:file_name
    // };   
    var formData={
      access_token:app.globalData.options.access_token,
      job_id:app.globalData.options.job_id,
      file_name:file_name
    }
    var _this = this
      if (_query.list[i].isupload==1){    
      wx.request({
        url: app.globalData.ossApi + 'api/fileapi/DeleteCPhotos',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
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
    }else{
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
    }
    }
  },
  CancelCTaskClick() {//取消上传任务
    var _query=this.data
    if (!_query.iscancel) {
      var parm = {
        access_token: app.globalData.options.access_token,
        job_id: app.globalData.options.job_id,
      };
      var _this = this
      
      _this.setData({
        iscancel:true
      })
      wx.showModal({
        title: '提示',
        content: '您确定要取消当前上传任务吗！',        
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.ossApi + 'api/fileapi/CancelCTask',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              data: parm,
              success: function (res) {     
                var obj = res.data;
                if (obj.code == 0) {            
                  wx.showModal({
                    title: '提示',
                    content: '当前上传任务已经成功取消！',
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {

                      }
                    }
                  }) 
                  

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
                _this.setData({
                  iscancel: false
                })
              },        
              })
          } else if (res.cancel) {
            _this.setData({
              iscancel: false
            })
          }
        }
      })
    }
  },

})





function uploadPhoto(_this, uploadfile,i) {
  var _query=_this.data
  /* var tt = '/' + uploadfile.length + '张'
  wx.showToast({
    title: i + tt,
    mask: true,
    icon: 'loading',
    duration: 60000
  });*/
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
    console.log(formData)
  //}
  if (_query.list[uploadfile[i].sort_no].isupload == 2) {   
    formData.if_replace=1
    isreplace = true
  }
  console.log('i', i)
  console.log('formData',formData)
  _this.setData({
    uploadKey: uploadfile[i].sort_no,//正在上传图片的下标
  })
  var upa = wx.uploadFile({
    url: app.globalData.options.uploadurl,//app.globalData.ossApi + 'api/fileapi/UploadCFile',//app.globalData.options.uploadurl, //"https://"+sres.region+".file.myqcloud.com/files/v2/"+sres.appid+"/"+sres.bucket+sres.folder+'wx'+new Date().getTime()+'.'+fileName.split('.')[1],
    filePath: filePath,
    name: 'filecontent',
    formData: formData,
    success: function (uploadRes) {
      i++;
      if (uploadRes.statusCode == 200) {       
        var obj = JSON.parse(uploadRes.data);
        if (obj.code === 0) {
          var a = uploadfile[(i-1)].sort_no
          if (isreplace == false) {
             _query.upload_num++;
          } 
        
          _query.list[a].isupload = 1;
          _query.list[a].src = obj.data.oss_thumb_url;
          _query.list[a].FileName = obj.data.FileName;
          _query.upload_loading = true;
         
          if (i === uploadfile.length) {
            wx.showToast({
              title: '上传完毕',
              icon: 'success',
              duration: 2000
            })           
            _query.finishtask = true;           
            _query.isuploadclick = false;
            _this.setData({
              uploadKey:null,//正在上传图片的下标
            })
          } else {
            _query.isuploadclick = false;
            uploadPhoto(_this, uploadfile, i)
          }

        } else {
          var d = uploadfile[(i - 1)].sort_no
          _query.list[d].isupload = -1; 
          _query.uploadError.push("图" + i)
          wx.hideLoading();
          console.log(obj)
           wx.showModal({
            title: '提示',
             content: obj.message,
            showCancel:false,
            success: function (res) {
              if (res.confirm) {
                if (i === uploadfile.length) {
                  _this.setData({
                    uploadKey: null,//正在上传图片的下标
                  })
                  if (_query.uploadError.length>0){
                    wx.showModal({
                      title: '提示',
                      content: _query.uploadError.join(",") + "上传失败",
                      showCancel: false,
                      success: function (res) {
                        if (res.confirm) {
                         
                        }
                      }
                    })  
                  }else{
                  wx.showToast({
                    title: '上传完毕',
                    icon: 'success',
                    duration: 2000
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
        var _errorstr=""          
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
      //setTimeout(function(){
        _this.setData({
          list: _query.list,
          upload_loading: _query.upload_loading,
          finishtask: _query.finishtask,
          isuploadclick: _query.isuploadclick,
          upload_num: _query.upload_num,
          uploadError: _query.uploadError
        })
      //},500)
     
    },
    fail: function (e) {
      console.log('上传出错', e)
      // if(res.errMsg == "uploadFile:fail timeout"){
      wx.showToast({
        title: '上传超时',
        mask: true,
        icon: 'loading',
        duration: 6000
      });
      
      // }
    }
  })

  upa.onProgressUpdate((res) => {
    console.log('上传进度', res.progress)
    console.log('已经上传的数据长度', res.totalBytesSent)
    console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
    /* _this.setData({
      percent: res.progress,//上传进度      
    })
    console.log('上传进度',_this.data.percent)
   wx.showToast({
      title: (res.progress == 100 ? i + 1 : i) + tt + ', ' + res.progress + '%',
      mask: true,
      icon: 'loading',
      duration: 60000
    });*/
    var progress = res.progress
    if (progress < 60) {
      _this.setData({
        percent: parseInt(progress / 10),//上传进度      
      })
    } else {
      var intervalid = null      
      console.log('旧cur', _this.data.percent)
      var incrementNumber = function () {
        
        if (_this.data.uploadKey == null) {
          _this.setData({
            percent: 100,//上传进度      
          })
          clearInterval(intervalid)
        } else {
          console.log('新cur', _this.data.percent)         
          if (_this.data.percent > 95) {
            clearInterval(intervalid)
          } else if (_this.data.percent > 85) {
            _this.setData({
              percent: _this.data.percent + 0.5,//上传进度      
            })
          }else{
            _this.setData({
              percent: _this.data.percent + 4,//上传进度      
            })
          }
        }

      }
      intervalid = setInterval(incrementNumber, 500)
      
    }
    
   
  })
}

function delayProgressUpdate(_this,progress){//延迟刷新进度条
  
  if (progress<80){    
    _this.setData({
      percent: progress / 20,//上传进度      
    })
  } else{   
   var intervalid=null
    var cur = progress / 20
    console.log('旧cur', cur)
    var incrementNumber = function () {
      cur = cur + 10
      if (_this.data.uploadKey==null) {
        _this.setData({
          percent: 100,//上传进度      
        })
        clearInterval(intervalid)
      } else{        
        console.log('新cur', cur)
        _this.setData({
          percent:cur,//上传进度      
        })
        if (cur>90){
          clearInterval(intervalid)
        }
      }

    }
    intervalid = setInterval(incrementNumber,500) 
    console.log('cur1', cur)
  }
  
 

}


function init() {

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
  console.log('options', options)
  //(e.detail.value.order_sn).toString()//C0000248620180724
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
         isload:false
       })
        _this.GetCPhotos()
        console.log(app.globalData.access_token)
        
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
          showCancel:false,
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
    fail: function(xf){     
      wx.hideLoading();
    }
  })
}

function sureParms(){// 确认当前没有传递的参数的默认值
  var params = app.globalData.options
  if (params.Total_num ==undefined){
    app.globalData.options.Total_num='0' 
  }else if (params.isSort == undefined) {
    app.globalData.options.isSort = '0' 
  } else if (params.isjob_id == undefined) {
    app.globalData.options.isjob_id = '0' 
  } else if (params.finishlink == undefined) {
    app.globalData.options.finishlink = '0' 
  } else if (params.finishMsgid == undefined) {
    app.globalData.options.finishMsgid = '1' 
  } else if (params.CancelCTask == undefined) {
    app.globalData.options.CancelCTask = '0' 
  } else if (params.DeleteCPhotos == undefined) {
    app.globalData.options.DeleteCPhotos = '0' 
  }

}