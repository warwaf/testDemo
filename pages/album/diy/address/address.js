import { isPhone } from '../../../../utils/util'
import { Diy } from '../diy-model'

var app = getApp()
var diyModel = new Diy()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: [],
        selectedIndex: 0,
        status: false, // false -- 展示  true -- 新增/编辑
        editInfo: {
            isDefault: 1
        },  //当前编辑地址的信息
        from: '../order/order'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.from) this.data.from = options.from
        this.setData({
            selectedIndex: options.index
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        diyModel.getAddress(100).then(list => {
            if(list.length > 0){
                this.setData({
                    address: list
                })
            }else{
                this.create()
            }
        })
    },

    pick(e) {
        
        app.globalData.addressSelectIndex = e.currentTarget.dataset.index
        console.log(app.globalData.addressSelectIndex);
        
        wx.navigateBack({
            delta: 1
        })
    },
    /**
     * 新增地址
     */
    create() {
        this.setData({
            editInfo: {
                isDefault: 1
            },
            status: true
        })
    },
    /**
     * 编辑地址
     */
    update(e) {
        this.setData({
            editInfo: this.data.address[e.currentTarget.dataset.index],
            status: true
        })
    },
    /**
     * 提交修改
     */
    confirm() {
        console.log(this.data.editInfo);

        if(!this.data.editInfo.Province || !this.data.editInfo.Address){
            wx.showToast({
                title: '地址不能为空',
                icon: 'none'
            });
            return false
        }
        if(!this.data.editInfo.ReceiverName || !this.data.editInfo.ReceiverPhone){
            wx.showToast({
                title: '姓名和联系方式不能为空',
                icon: 'none'
            });
            return false
        }
        if(!isPhone(this.data.editInfo.ReceiverPhone)){
            wx.showToast({
                title: '手机格式不正确',
                icon: 'none'
            });
            return false
        }
        wx.showLoading();
        const { editInfo } = this.data;
        const data = {
            address:editInfo.Address,
            area:editInfo.District,
            city:editInfo.City,
            isDefault:editInfo.isDefault,
            province:editInfo.Province,
            unionId:app.globalData.unionid,
            userName:editInfo.ReceiverName,
            userPhone:editInfo.ReceiverPhone,
            id: editInfo.Id
        }
        if (!this.data.editInfo.Id) {
            diyModel.addAddress(data).then(res => {
                this.setData({
                    status: false
                })
                //重新获取地址
                diyModel.getAddress(100).then(list => {
                    this.setData({
                        address: list
                    })
                    wx.hideLoading()
                })
            })
        } else {
            diyModel.editAddress(data).then(res => {
                this.setData({
                    status: false
                })
                //重新获取地址
                diyModel.getAddress(100).then(list => {
                    this.setData({
                        address: list
                    })
                    wx.hideLoading()
                })
            })
        }
    },
    /**
     * 删除
     */
    delete() {
        wx.showLoading()
        diyModel.deleteAddress(this.data.editInfo.id).then(res => {
            console.log(res);
            this.setData({
                status: false
            })
            //重新获取地址
            diyModel.getAddress().then(list => {
                this.setData({
                    address: list.origin
                })
                wx.hideLoading()
            })
        })
    },

    bindKeyInput(e) {
        this.data.editInfo[e.currentTarget.dataset.type] = e.detail.value
    },

    changeArea(e) {
        this.setData({
            'editInfo.Province': e.detail.value[0],
            'editInfo.City': e.detail.value[1],
            'editInfo.District': e.detail.value[2]
        })
    },

    setDefault(e) {
        this.data.editInfo.isDefault = e.detail.value ? 0 : 1
    }
})