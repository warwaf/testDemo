import AwardModel from './award-model'
var app = getApp()

var mapList = {
    R2I072792I0: { title: '一等奖', img: 'http://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190816/C0187910920190816/origin/0266b3222b1147eea0362884c978b604.jpg', type: 2, proName: '鲜檬儿童个性定制相册', CouponCode: 'R2I072792I0', EndTime: '2020-5-8', StardTime: '2020-3-1' },
    REHY1261EHY: { title: '二等奖', img: 'http://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190816/C0187910920190816/origin/5914f1be2ed74adb9f17e595bdf72455.jpg', type: 2, proName: '鲜檬追梦插卡框', CouponCode: ' REHY1261EHY', EndTime: '2020-5-8', StardTime: '2020-3-1' },
    REJP1231EJP: { title: '二等奖', img: 'http://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190816/C0187910920190816/origin/0266b3222b1147eea0362884c978b604.jpg', type: 2, proName: '鲜檬儿童个性定制相册', CouponCode: 'REJP1231EJP', EndTime: '2020-5-8', StardTime: '2020-3-1' },
    R3XG75183XG: { title: '三等奖', img: 'http://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190816/C0187910920190816/origin/571d89ec918b4da1aed4d338524a1bfc.jpg', type: 2, proName: '鲜檬精致摆台', CouponCode: 'R3XG75183XG', EndTime: '2020-5-8', StardTime: '2020-3-1' },
    RNU86598NU8: { title: '三等奖', img: 'http://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190816/C0187910920190816/origin/0266b3222b1147eea0362884c978b604.jpg', type: 2, proName: '鲜檬儿童个性定制相册', CouponCode: 'RNU86598NU8', EndTime: '2020-5-8', StardTime: '2020-3-1' },
    R24J782124J: { title: '参与奖', img: 'https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/mtq/20200324/C0530678420200324/origin/4fd2c97e05d741b1a961ddd426cae139.png', type: 1, proName: '鲜檬个性定制儿童三件套7折券', CouponCode: 'R24J782124J', EndTime: '2020-5-8', StardTime: '2020-3-1' },
    RF2T1756F2T: { title: '参与奖', img: 'http://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190816/C0187910920190816/origin/1d20d44e5df2444cb8a329a46ab09a0d.jpg', type: 2, proName: '免费照片冲印卷', CouponCode: 'RF2T1756F2T', EndTime: '2020-5-8', StardTime: '2020-3-1' },
    REPN1365EPN: { title: '点赞奖', img: 'https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/mtq/20200324/C0530678420200324/origin/4fd2c97e05d741b1a961ddd426cae139.png', type: 1, proName: '鲜檬个性定制儿童三件套7折券', CouponCode: 'REPN1365EPN', EndTime: '2020-5-8', StardTime: '2020-3-1' },
    R2BE70192BE: { title: '点赞奖', img: 'http://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190816/C0187910920190816/origin/1d20d44e5df2444cb8a329a46ab09a0d.jpg', type: 2, proName: '免费照片冲印卷', CouponCode: 'R2BE70192BE', EndTime: '2020-5-8', StardTime: '2020-3-1' }
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        data: [

        ],
        imgSrc: '',
        showMask: false,
        imgs: [
            'http://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190816/C0187910920190816/origin/49ab15f2d3304ba8aacf362afd96d484.png',
            'http://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190816/C0187910920190816/origin/9761ab4f51074f21a6093c1ee3fd7b82.png',
            'http://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190816/C0187910920190816/origin/4b6e1d10354f4594beb9e155454cd8d7.png',
            'http://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190816/C0187910920190816/origin/6b98a73b3081413ebbb7ded65b80d73d.png',
            'http://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190816/C0187910920190816/origin/5c466ad7855a4ce6bc1a95cb5c1a493f.png',
            'http://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190816/C0187910920190816/origin/4550acf195d14ff99b5d0f5e28680d47.png'
        ],
        curIndex: 0,
        showIndictor: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        var sing = await AwardModel.getSign()
        var res = await AwardModel.getActivityCode(sing.result)
        var list = (res.Data && res.Data.ActivityCouponList) || []
        if(list && Array.isArray(list)){
            list = list.map(item => mapList[item.CouponCode] || {})
            list = list.filter(item => JSON.stringify(item) != '{}')
        }
        // 判断是否获得一等奖
        let _res = await AwardModel.getAdwardsList()
        console.log(">>>", _res, list)
        if (_res.result) {
            list.unshift({ title: '一等奖', img: 'https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/mtq/20200324/C0530678420200324/origin/4fd2c97e05d741b1a961ddd426cae139.png', type: 0, proName: '鲜檬儿童个性定制儿童三件套', CouponCode: '', EndTime: '2020-5-8', StardTime: '2020-4-17' })
        }
        this.setData({
            data:  this.data.data.concat(list)
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    check(e){
        var item = e.currentTarget.dataset.item
        switch (item.type) {
            case 1:
                app.globalData.mta.Event.stat("c_mtq_Dynamics_mxqh_use",{})
                wx.navigateToMiniProgram({
                    appId: 'wxbf9f2e9fde7a772d',
                    path: 'pages/goodsDetail/goodsDetail?goodsId=DSGW160&productId=1009858',
                    extraData: {
                        goodsId: 'DSGW160',
                        productId: '1009858'
                    }
                })
                break;
            case 2: 
                this.setData({ showIndictor: true })
                break;
            default:
                this.setData({ imgSrc: item.img, showMask: true })
                break;
        }


    },

    hideMask(){
        this.setData({ showMask: false })
    },

    scrollEventHandler(e){
        this.setData({ curIndex: e.detail.current })
    },

    closeIndictor(){
        this.setData({ showIndictor: false, curIndex: 0 })
    }
})