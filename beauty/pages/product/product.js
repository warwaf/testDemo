import { Beauty } from '../beauty-model'
var beautyModel = new Beauty()

const {  } = getApp().globalData
var data = []
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        acriveIndex: 0,
        statusEnum: beautyModel.statusEnum,
        counter: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.taskId = options.taskId
        getApp().globalData.mta.Event.stat("c_mtq_photoablum_product_checkproduct",{})
    },

    onShow(){
        beautyModel.getProduct(this.data.taskId).then(list => {
            var counter = 0
            list.forEach(item => {
                item.evaluate == beautyModel.statusEnum.PENDING && counter ++
            })
            data = list
            list = data.filter(item => (item.newState))
            if(list.length){
                this.setData({
                    acriveIndex: 1
                }) 
            }else{
                list = data
            }
            this.setData({
                list,
                counter
            })
        })
    },

    switchTap(e){
        var status = e.currentTarget.dataset.status, list = []
        switch (parseInt(status)) {
            case 0:
                list = data
                break;
            case 1:
                list = data.filter(item => (item.newState))
                break;
            case 2:
                list = data.filter(item => (item.evaluate == beautyModel.statusEnum.UNSATISFACTION))
                break;
            case 3:
                list = data.filter(item => (item.evaluate == beautyModel.statusEnum.SATISFACTION))
                break;
            default:
                break;
        }
        this.setData({
            list,
            acriveIndex: status
        })
    },

    toPhotoDetail(e){
        var id = e.currentTarget.dataset.id, index = 0
        data.forEach((item, key) => {
            if(item.id == id){
                index = key
            }
        })
        wx.navigateTo({
            url: `../photo/photo?taskId=${this.data.taskId}&index=${index}`
        })
    }
})