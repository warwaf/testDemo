// pages/mine/wallet/wallet.js
import Wallet from './wallet-model'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        amount: '0',
        withdrawAmount: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            amount: options.amount
        })
    },

    withdraw(){
        // wx.redirectTo({
        //     url: '/pages/mine/wallet/result/result',
        // })
        // wx.showToast({
        //     title: '满50元才可以提现',
        //     icon: 'none'
        // })
        
        Wallet.withdraw(this.data.withdrawAmount).then(res => {
            if(res.code != 200){
                wx.showToast({
                    title: res.message,
                    icon: 'none'
                })
            }
        })

    },

    inputEventHandler(e){
        this.setData({
            withdrawAmount: e.detail.value
        })
    }
})