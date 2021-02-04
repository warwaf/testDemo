// pages/recognition/recognition.js
import regeneratorRuntime from '../../../utils/runtime';
import util from "../../../utils/util"
import apiSettings from '../../../utils/ApiSetting'
var app = getApp()
Page({
    data: {
        height: '360',
        width: '20',
        status: true,
        scanStatus: 'none',
        msg: "请点击识别图片",
        animation: '',
        src: '',
        token: '',
        // 是否元旦活动结束
        isNewYearActOver:false,
        showTime: "2020/12/31 23:59:59", // 霸屏页开始展示时间
        // showTime: "2020/12/29 10:10:10", // 霸屏页开始展示时间
        endTime:'2021/01/05 23:59:59',// 元旦活动结束时间
    },

    onLoad: function(options) {
        if(options.newyear == 1){
            this.setData({
                isNewYearAct : 1
            })
        }
        let currentTime = this.dateGetTime(util.formatTime1(new Date()).replace(/-/ig, "/"))
        let startTime = this.dateGetTime(this.data.showTime) //活动开始时间
        let endTime = this.dateGetTime(this.data.endTime)
        if(currentTime<startTime||currentTime>endTime){
            this.setData({
                isNewYearActOver:true
            })
        }

        this.i = 0;
        this.ctx = wx.createCameraContext();
        // wx.getSystemInfo({
        //   success: res => {
        //     this.setData({ height: res.windowHeight*.8, width: res.windowWidth});
        //   }
        // });
        wx.request({
            url: apiSettings.Host + '/mtq/api/ar/video/getSearchToken',
            method: 'POST',
            success: res => {
                this.data.token = res.data.message
                setTimeout(() => this.takePhoto(), 3000);
            }
        })

        
        this.animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'linear',
            delay: 10,
            transformOrigin: 'center center 0',
        })
        getApp().globalData.mta.Event.stat("c_mtq_Albm_Ar_PopularlyClick",{})
    },
    dateGetTime(date) {
        return new Date(date).getTime()
    },

    startScan() {
        this.setData({ status: true });
        this.interval = setInterval(() => {
            this.i++;
            this.rotateAni(this.i)
        }, 1000)
    },
    stopScan() {
        setTimeout(() => {
            clearInterval(this.interval);
            this.setData({ status: false });
        }, 2000)
    },

    rotateAni: function(n) {
        const scale = n % 2 == 0 ? 0.8 : 1
        this.animation.rotate(180 * (n)).scale(scale).step()
        this.setData({
            animation: this.animation.export()
        })
    },

    urlTobase64(imgPath) {
        let that = this;

        wx.getFileSystemManager().readFile({
            filePath: imgPath, //选择图片返回的相对路径
            encoding: 'base64', //编码格式
            success: res => { //成功的回调
                that.searchPhotp(res.data)
            }
        })
    },

    searchPhotp: function(imageBase64) {
        let that = this;
        wx.request({
            url: 'https://cn1-crs.easyar.com:8443/search',
            data: {
                image: imageBase64
            },
            header: {
                'Authorization': that.data.token,
                'content-type': 'application/json' // 默认值
            },
            method: 'POST',
            success(res) {
                console.log(res.data.date, 'res<<<')
                
                if (res.data.statusCode == 0) {
                    setTimeout(() => {
                        if(that.data.isNewYearActOver){
                            wx.redirectTo({
                                url: `./showAr/showAr?meta=${res.data.result.target.meta}`
                            });
                        }else{
                            console.log(util.toDate(res.data.date, 1), 777)
                            let str = encodeURIComponent(res.data.result.target.meta)
                            getApp().globalData.mta.Event.stat('c_mtq_aractivity',{'arscansuccess': app.globalData.unionid})
                            getApp().globalData.mta.Event.stat('c_mtq_aractivity',{'arscansuccessurl': `/activity/arAct/showAr/showAr?meta=${str}`})
                            getApp().globalData.mta.Event.stat('c_mtq_aractivity',{'arscansuccessphone': app.globalData.userInfo.mobileNo})
                            getApp().globalData.mta.Event.stat('c_mtq_aractivity',{'arscansuccessdate': util.toDate(res.data.date, 1)})
                            console.log(res.data.result.target.meta, 'res.data.result.target.meta')
                            wx.redirectTo({
                                url: `/activity/arAct/showAr/showAr?meta=${str}`
                            });
                        }
                    }, 500);
                } else {
                    that.stopScan();
                }
            },

            fail(err) {
                // that.status = false;
                that.stopScan();
            }
        })
    },

    takePhoto: function() {
        if (this.status) return;
        this.startScan();
        this.ctx.takePhoto({
            quality: 'normal',
            success: res => {
                this.urlTobase64(res.tempImagePath);
            },
            fail: err => {
                this.stopScan();
            }
        });
    },
    toActivityDetail(){
        wx.redirectTo({
            url: '/activity/arAct/arAct',
        })
    },
})