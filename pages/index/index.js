//index.js
//获取应用实例
var app = getApp()
var userinfo = app.globalData.userInfo
Page({
  data: {
    index: 0,
    nocancel: true,
    hiddenModal: true,
    promptText: '',
    isshow:false,
    isjob_id:'',
    isphone: false,//true显示电话号码，false不显示电话号码 
    order_sn:''

  },  
  //事件处理函数
  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  formBindsubmit: function (e) {
    var _this = this
    if (e.detail.value.customer_phone == '') {     
      wx.showModal({
        title: '提示',
        content: '手机号不能为空',
        showCancel: false
      })
    } else if (!/^1[3|4|5|7|8][0-9]\d{8}$/.test(e.detail.value.customer_phone)) {      
      wx.showModal({
        title: '提示',
        content: '手机号码格式不正确',
        showCancel: false
      })
    } else {
      // 验证订单是否
      var userinfo = app.globalData.userInfo
      if (JSON.stringify(userinfo) == "{}") {
        wx.hideToast();
        wx.showModal({
          content: '暂时还未登陆，确定重新登陆！',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              app.login(_this.formBindsubmit(e));
            }
          }
        })
        return
      }
      app.globalData.options.customer_phone = e.detail.value.customer_phone     
      if (e.detail.value.order_sn != '' && app.globalData.options.isjob_id=='0') {
        app.globalData.options.order_sn = e.detail.value.order_sn
        _this.setData({
          order_sn: app.globalData.options.order_sn,

        })
      } 
      var obj = judeUrlParms();
      if(obj.msg==''){      
          if (obj.isflag) {
            wx.navigateTo({
              url: '/pages/sence/sence'
            })
          } else {
           
            wx.navigateTo({
              url: '/pages/image/image'
            })
          }
        
      }else{
        wx.showModal({
          content: obj.msg,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
            
            }
          }
        })
      }
      
    }
  },
  bindconfirm: function () {
    var _this = this
    _this.setData({
      hiddenModal: true,
      promptText: '',
      nocancel: true
    })
  },
  bindcancel: function () {
    var _this = this
    _this.setData({
      hiddenModal: true,
      promptText: '',
      nocancel: true
    })
  },
  onLoad: function (options) {
    // 判断参数
     if (JSON.stringify(options) == "{}") {
      
      //  wx.showModal({
      //    title: '提示',
      //    content: '参数缺失',
      //    showCancel: false
      //  })
       app.globalData.options.access_key ='YhBuiK7F4l0ecS40'
       app.globalData.options.store_id = 'C1508'
       app.globalData.options.branch_id = 'D4260'
       app.globalData.options.product_sku = '1004576'
       app.globalData.options.if_correct = '0'
       app.globalData.options.scene_name = '时尚街拍'
       app.globalData.options.channel_id ='ssjp' 

    } else {
       console.log('index_options', options) 
     //app.globalData.options = options
       var _options = decodeURIComponent(options.s).split(",")
       app.globalData.options.access_key=_options[0]
       app.globalData.options.store_id=_options[1]
       app.globalData.options.branch_id=_options[2]
       app.globalData.options.scene_name = _options[3] == 'null' ? '' : _options[3]
       app.globalData.options.channel_id = _options[4] == 'null' ? '' : _options[4]    
       app.globalData.options.product_sku=_options[5]
       app.globalData.options.if_correct=_options[6]     
       app.globalData.options.Total_num=_options[7]     
       app.globalData.options.isjob_id = _options[8]          
       app.globalData.options.finishMsgid = _options[9]  // 1是msgid类型
       app.globalData.options.CancelCTask = _options[10] //0表现显示取消任务上传任务按钮隐藏，1表示显示
       app.globalData.options.DeleteCPhotos = _options[11] //0表现显示删除照片按钮隐藏，1表示显示 
       console.log('globalData', app.globalData.options)
     }
       if (app.globalData.options.job_id !== undefined && app.globalData.options.job_id!='' ) {
      app.globalData.options.order_sn = options.job_id
        this.setData({
          order_sn: app.globalData.options.order_sn,
          
        })
      } 
     this.setData({      
        isjob_id: app.globalData.options.isjob_id,
       isphone: (app.globalData.options.customer_phone == undefined || app.globalData.options.customer_phone == '') ?false:true,
       customer_phone: (app.globalData.options.customer_phone == undefined || app.globalData.options.customer_phone == '') ? '' : app.globalData.options.customer_phone
      }) 
      console.log('options', options)     
      var userinfo = app.globalData.userInfo
      if (JSON.stringify(userinfo) != "{}") {      
          wx.hideToast();
          var _query = app.globalData.options
          var flag = _query.access_key !== undefined && _query.store_id !== undefined
            && _query.branch_id !== undefined && _query.customer_name !== undefined 
            && _query.customer_phone !== undefined && _query.customer_phone !== '' && _query.scene_name !== undefined
        && _query.product_sku !== undefined && _query.if_correct !== undefined
        && _query.channel_id !== undefined
        if (flag && _query.isjob_id == '1') {
          if (_query.scene_name == '' || _query.channel_id == ''){
            wx.navigateTo({
              url: '/pages/sence/sence'
            })
          }else{         
          wx.navigateTo({
            url: '/pages/image/image'
          })
          }
        }else{
          this.setData({
            isshow: false           
          })          
        }
      }     
    
  },
  onShow: function () {
    var _this = this
    var userinfo = app.globalData.userInfo

    if (JSON.stringify(userinfo) != "{}") {
      console.log(app.globalData)
      wx.hideToast();
    } else {
      wx.showToast({
        title: '登陆中...',
        mask: true,
        icon: 'loading',
        duration: 60000
      });
      app.login()
    }

    wx.getClipboardData({
      success: function (res) {
        if (res.errMsg == "getClipboardData:ok") {
          if (/^E\d{23}$/.test(res.data))
            _this.setData({
              order_sn: res.data
            })
        }
      }
    })
  }
})

// 判断链接参数
function judeUrlParms(){
var msg='';
var isflag=false;
  var _query = app.globalData.options
  var flag = _query.access_key !== undefined && _query.store_id !== undefined
    && _query.branch_id !== undefined && _query.customer_name !== undefined
    && _query.customer_phone !== undefined && _query.customer_phone !== '' && _query.scene_name !== undefined
    && _query.product_sku !== undefined && _query.if_correct !== undefined
    && _query.channel_id !== undefined
  if (flag){    
    if (_query.access_key == '') {       
      msg ='access_key不能为空'
      } else if (_query.store_id == '') {       
      msg ="store_id不能为空"
      } else if (_query.branch_id == '') {       
      msg ="branch_id不能为空"
      } else if (_query.customer_name == '') {
      msg = "customer_name不能为空"
      } else if (_query.customer_name.length >100) {
      msg = "客户姓名不能超过100个字符"
      } else if (_query.customer_phone == '') {       
      msg = "customer_phone不能为空"
      } else if (_query.scene_name == '') {       
      isflag=true      
      } else if (_query.scene_name.length>100) {
      msg = "场景名称不能超过100个字符" 
      isflag = true
      }  else if (_query.channel_id == '') {        
      isflag = true
      } else if (_query.product_sku == '') {      
      msg = "product_sku不能为空"
      } else if (_query.product_sku.length>100) {
      msg = "产品Sku不能大于100个字符"
      }
  }
  var o={}
  o.isflag = isflag
  o.msg = msg
  return o

}