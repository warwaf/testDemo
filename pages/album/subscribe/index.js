// pages/album/subscribe/index.js
import regeneratorRuntime, { async } from '../../../utils/runtime';
import { Subscribe } from './subscribe-model';
var subscribe = new Subscribe()
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        visibile: false,
        rangeTime: [],
        tempActive: '1-50人',
        tempPhone: '',
        tempName: '',
        list: ['1-50人', ' 51-100人', '101-200人', '201-400人', '401-600人', '601-1000人', '1000人以上'],
        addrInfo: {},
        fromData: {
            address: '活动地址',
            time: '活动时间',
            name: '联系人',
            phone: '联系电话',
            active: '活动人数'
        },
        type:false,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        if(options.type){
            const { customerName, catalogNoName, listPrice, catalogNo, partNo  } = app.globalData.disProInfo;
            const res = await subscribe.searchCoupon({ GoodsId: partNo, catalog_no:catalogNo })
            res.result = res.result || []
            const fromData = {
                address: customerName,
                time:options.time,
                catalogNoName: catalogNoName,
                price: (listPrice - (res.result[0] ? Number(res.result[0].CouponMoney) : 0)).toFixed(2),
                couponCode: res.result[0] ? res.result[0].CouponNo : '',
                couponPrice: res.result[0]  ? res.result[0].CouponMoney : 0,
                name: '联系人',
                phone: '联系电话',
                active:0
            }
            this.setData({
                type: options.type,
                fromData,
                rangeTime:[options.time, '00:00', '23:59']
            })
            wx.setNavigationBarTitle({title:'填写预约信息'})
        }
    },
    async next() {
        const { fromData, rangeTime, addrInfo, type } = this.data;
        if (!addrInfo.province && type !=1) {
            wx.showToast({
                title: '请选择活动地址',
                icon: 'none'
            })
            return
        }
        if (fromData.time == '活动时间') {
            wx.showToast({
                title: '请选择活动时间',
                icon: 'none'
            })
            return
        }

        if (fromData.name == '联系人') {
            wx.showToast({
                title: '请填写联系人',
                icon: 'none'
            })
            return
        }
        if (fromData.phone == '联系电话') {
            wx.showToast({
                title: '请填写手机号码',
                icon: 'none'
            })
            return
        }
        if (fromData.active == '活动人数') {
            wx.showToast({
                title: '请选择活动人数',
                icon: 'none'
            })
            return
        }

        wx.showLoading({
            title: '数据保存中...',
            mask: true
        })
        if(type == 1) {
            const data = {
                unionId: app.globalData.unionid,
                customerNo:  app.globalData.disProInfo.customerNo,
                productNo: app.globalData.disProInfo.catalogNo,
                productName: app.globalData.disProInfo.catalogNoName,
                activityAddress:fromData.address,
                activityTime: rangeTime[0] + " 00:00:00",
                linkman: fromData.name,
                linkmanPhone: fromData.phone,
                catalogId: app.globalData.disProInfo.id,
                orderAmount: fromData.price,
                couponCode:fromData.couponCode
            }
            const res = await subscribe.saveStore(data);
            wx.hideLoading();
            if(res.code == 200){
                wx.redirectTo({
                    url: `/pages/album/diy/pay/pay?order_no=${res.result.OrderNo}&amount=${res.result.OrderPrice}&couponPrice=${fromData.couponPrice}`,
                })
            }else{
                wx.showToast({
                    title: res.message,
                    icon: 'none'
                })
            }
        }else{
            const data = {
                mobileNo: fromData.phone,
                startTime: rangeTime[0] + " " + rangeTime[1] + ":00",
                endTime: rangeTime[0] + " " + rangeTime[2] + ":00",
                userName: fromData.name,
                province: addrInfo.province,
                city: addrInfo.city,
                area: addrInfo.town,
                address: fromData.address,
                source: 1,
                activityId: app.globalData.activityInfo.activityId,
                number: fromData.active
            }
            if (app.globalData.userInfo.unionId) data.unionId = app.globalData.userInfo.unionId;
            const res = await subscribe.saveAdvancePhotos(data);
            wx.hideLoading();
            if (res.code == 0) {
                wx.showToast({
                    title: '保存成功',
                    icon: 'none',
                    duration: 2000
                })
                wx.redirectTo({
                    url: `/pages/album/subscribe/result/result?mobile_no=${res.data.mobileNo}`,
                })
            }
        }
        
    },
    getAddr(str) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: `https://api.map.baidu.com/geocoder/v2/?language_auto=1&extensions_town=true&coordtype=gcj02ll&location=${str}&output=json&latest_admin=1&ak=${app.globalData.mapAK}`,
                success(res) {
                    const addr = res.data.result.addressComponent
                    resolve(addr);
                }
            })
        })
    },
    getLocation() {
        return new Promise((resolve, reject) => {
            wx.chooseLocation({
                success(res) {
                    resolve(res);
                }
            })
        })
    },
    /**
     * 选择地理位置
     */
    async chooseAddr() {
        const { fromData, type } = this.data;
        if(type == 1) return;
        const res = await this.getLocation();
        const result = await this.getAddr(res.latitude + "," + res.longitude);
        this.setData({
            addrInfo: result,
            fromData: Object.assign(fromData, { address: res.address })
        })
    },
    // 弹窗
    tapPop(e) {
        const { value } = e.target.dataset;
        if(this.data.type == 1 && value == 'time') return
        this.setData({
            visibile: value
        })
    },
    /**
     * 点击确定
     */
    async tapComfirm(e) {
        const { visibile, fromData, tempActive, tempPhone, tempName } = this.data;
        if (visibile == 'time') {
            const { value, text } = e.detail;
            this.setData({
                visibile: false,
                rangeTime: value,
                fromData: Object.assign(fromData, {
                    time: text
                })
            })
        }
        if (visibile == 'active' && tempActive != '') {
            this.setData({
                visibile: false,
                fromData: Object.assign(fromData, { active: tempActive })
            })
        }
        if (visibile == 'phone') {
            if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(tempPhone))) {
                wx.showToast({
                    title: '手机号格式不正确,请重新输入',
                    icon: 'none'
                })
                return
            }
            if (tempPhone == '') {
                wx.showToast({
                    title: '请填写手机号',
                    icon: 'none'
                })
                return
            }
            this.setData({
                visibile: false,
                fromData: Object.assign(fromData, { phone: tempPhone })
            })
        }
        if (visibile == 'name') {
            if (tempName == '') {
                wx.showToast({
                    title: '请填写联系人',
                    icon: 'none'
                })
                return
            }
            const res = await subscribe.verifyContent(tempName)
            if(res){
                this.setData({
                    visibile: false,
                    fromData: Object.assign(fromData, { name: tempName })
                })
            }else{
                this.setData({
                    visibile: false,
                })
                wx.showToast({
                    title:'联系人内容审核不通过',
                    icon: 'none'
                })
            }
            
        }
    },
    /**
     * 手机号码改变
     * @param {*} e 
     */
    phoneChange(e) {
        this.setData({
            tempPhone: e.detail.value
        })
    },
    nameChange(e) {
        this.setData({
            tempName: e.detail.value
        })
    },
    /**
     * 时间变化时
     * @param {*} e 
     */
    rangeChange(e) {
        this.setData({
            rangeTime: e.detail
        })
    },
    /**
     * 活动人数变化时
     * @param {*} e 
     */
    bindChange(e) {
        const val = e.detail.value;
        this.setData({
            tempActive: this.data.list[val]
        })
    },
})