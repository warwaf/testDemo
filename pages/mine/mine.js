import {
    Home
} from '../../pages/album/home/home-model.js'
import {
    Checkin
} from '../../pages/album/checkin/checkin-model.js'
import {
    Mine
} from './mine-model.js'
var homeModel = new Home()
var mineModel = new Mine()
var checkinModel = new Checkin();
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {
            avatarUrl: '',
            nickName: '',
            autograph: ''
        },
        follow: 0,
        fans: 0,
        newsCount: 0,
        amount: 0,
        newsAddCount: 0,
        //tabBar选中状态
        tabShow: true,
        tabbarActive: 1,
        navigationHeight: app.globalData.navigationHeight,
        isSignIn: false,
        signInState: 0,
        signInInfo: {
            date: []
        },
        prize: 0.00,
        authorityTips: false,
        vipIcon: "",
        isInit: 0
    },

    onLoad: function () {
        // checkinModel.getPrizeList().then(res=>{
        //     this.setData({
        //         signInInfo:res.result,
        //     })
        // });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function () {
        // if (JSON.stringify(app.globalData.userInfo) == '{}') {
        //     this.setData({
        //         authorityTips: true,
        //         isInit: 1
        //     })
        //     return
        // } else {
        //     this.setData({
        //         authorityTips: false,
        //         isInit: 0
        //     })
        // }
        mineModel.getFllows().then(res => {
            this.setData({
                follow: res.result ? res.result.follows.length : "",
                fans: res.result ? res.result.fans.length : "",
                newsCount: res.result ? res.result.newsCount : "",
                newsAddCount: res.result ? res.result.newsAddCount : ""
            })
        })
        // homeModel.getRedPacket().then(res => {
        //     this.setData({
        //         amount: 0 // Math.floor(res.result.amount * 100) / 100
        //     })
        // })
        //解决从设置页返回不刷新bug...
        homeModel.getUserPhoneByUnionId(true).then(res => {
            this.setData({
                userInfo: app.globalData.userInfo,
                anonymous: JSON.stringify(app.globalData.userInfo) == '{}'
            })
            this.checkMemberStatus()
        })        
    },
    checkMemberStatus() {
        let openingStatus = 0, // 初始值 - 金卡、银卡均未开通
            vipIcon = "" // 初始值 - 金卡、银卡vip图标
        // 只开通了金卡
        if (this.data.userInfo.isMember == 1 && this.data.userInfo.silverMember == 0) {
            openingStatus = 1
            vipIcon = "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/1.10.2/gold_icon.png"
        }
        // 只开通了银卡
        if (this.data.userInfo.isMember == 0 && this.data.userInfo.silverMember == 1) {
            openingStatus = 2
            vipIcon = "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/1.10.2/silver_icon.png"
        }
        // 开通了金卡和银卡
        if (this.data.userInfo.isMember == 1 && this.data.userInfo.silverMember == 1) {
            openingStatus = 3
            vipIcon = "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/1.10.2/gold_icon.png"
        }
        this.setData({
            openingStatus,
            vipIcon
        })
    },
    // 签到
    // toSignIn(){
    //     checkinModel.getPrizeList().then(res=>{
    //         this.setData({
    //             signInInfo:res.result,
    //             isSignIn: true
    //         })
    //         this.getTabBar().hide();
    //     });

    // },
    // 签到
    async tapSignIn() {
        if (this.data.signInInfo.state == 1) {
            this.colseRed({
                target: {
                    dataset: {
                        mask: 1
                    }
                }
            })
        } else {
            const res = await checkinModel.getSignIn();
            if (res.code == 200) {
                if (res.result.prize) {
                    this.setData({
                        signInState: 1,
                        prize: res.result.prize
                    })
                } else {
                    this.colseRed({
                        target: {
                            dataset: {
                                mask: 1
                            }
                        }
                    })
                }
            }
        }
    },
    checkLogin() {
        if (JSON.stringify(app.globalData.userInfo) !== '{}') {
            return false
        } else {
            this.setData({
                authorityTips: true
            })
            this.getTabBar().hide();
            return true;
        }
    },
    // 打开红包
    openRed() {
        this.setData({
            signInState: 2
        })
    },
    // 关闭红包
    colseRed(e) {
        const {
            mask
        } = e.target.dataset;
        if (!mask) return;
        this.setData({
            isSignIn: false,
            signInState: 0
        })
        // 显示 tab
        setTimeout(() => {
            this.getTabBar().show();
        }, 500)
    },
    /**
     * 修改个人信息
     */
    toPersonal() {
        if (this.checkLogin()) return;
        let str = JSON.stringify(this.data.userInfo)
        wx.navigateTo({
            url: `/mine/personal/personal?userInfo=${str}`
        })
    },
    /**
     * 照片页面
     */
    photoUrl() {
        if (this.checkLogin()) return;
        wx.navigateTo({
            url: '/mine/photo/photo'
        })
    },
    /**
     * 相册页面
     */
    albumUrl() {
        console.log(this.checkLogin());

        if (this.checkLogin()) return;
        wx.navigateTo({
            url: '/mine/minealbum/minealbum',
        })
    },
    /**
     * 动态页面
     */
    dynamicUrl() {
        if (this.checkLogin()) return;
        wx.navigateTo({
            url: '/mine/dynamic/dynamic',
        })
    },
    /**
     * 钱包页面
     */
    wallet() {
        if (this.checkLogin()) return;
        wx.navigateTo({
            url: '/mine/wallet/wallet?amount=' + this.data.amount,
        })
    },
    /**
     * 订单页面
     */
    order() {
        if (this.checkLogin()) return;
        wx.navigateTo({
            url: '/mine/order/order',
        })
    },
    /**
     * diy页面
     */
    diy() {
        if (this.checkLogin()) return;
        wx.navigateTo({
            url: '/mine/diylist/diylist',
        })
    },
    toCoupon() {
        if (this.checkLogin()) return;
        wx.navigateTo({
            url: '/mine/coupon/coupon',
        })
    },
    /**
     * 粉丝中心
     */
    follow(e) {
        if (this.checkLogin()) return;
        wx.navigateTo({
            url: '/mine/follow/follow?id=' + e.currentTarget.dataset.id,
        })
    },
    /**
     * 消息
     */
    message() {
        if (this.checkLogin()) return;
        wx.navigateTo({
            url: '/pages/common/message/message',
        })
    },

    showProtocol() {
        if (this.checkLogin()) return;
        wx.navigateTo({
            url: '/mine/protocol/protocol'
        })
    },

    toActivity() {
        if (this.checkLogin()) return;
        wx.navigateTo({
            url: '/activity/personal/record/record'
        })
    },

    async toMember() {
        if (this.checkLogin()) return;
        console.log(">>>", this.data.userInfo, this.data.openingStatus)
        await this.checkMemberStatus()
        wx.navigateTo({
            url: `/mine/member/presentation/presentation?openingStatus=${this.data.openingStatus}&tabcode=${this.data.openingStatus == 2 ? 'silver' : 'gold'}`
        })
        return
        switch (this.data.userInfo.isMember) {
            case 1:
                wx.navigateTo({
                    url: '/mine/member/equity/equity'
                })
                break;
            default:
                wx.navigateTo({
                    url: '/activity/member/member'
                })
                break;
        }
    },

    onGotUserInfo(e) {
        //拒绝获取权限
        if (e.detail.errMsg.indexOf('deny') !== -1) {
            return this.setData({
                alreadyTry: true
            })
        }
        mineModel.updateUserInfo(e).then(() => {
            this.setData({
                userInfo: app.globalData.userInfo,
                anonymous: false,
                alreadyTry: true,
                authorityTips: false
            })
            this.getTabBar().show();
        })
    },
    hideAuthority() {
        // if (this.data.isInit == 1) {
        //     return wx.switchTab({
        //         url: '/pages/album/checkin/checkin'
        //     })
        // }
        this.setData({
            authorityTips: false
        })
        this.getTabBar().show();
    },

    toQa() {
        wx.navigateTo({
            url: '/mine/qa/qa'
        })
    },

    handleContact(e) {
        console.log(e);
    }
})