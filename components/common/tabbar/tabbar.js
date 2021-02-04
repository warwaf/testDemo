// components/common/tabbar/tabbar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        navigationHeight: {
            type: Number
        },
        navigateBlock: {
            type: Number
        },
        navigationAction: {
            type: String
        },
        scrollTop: {
            type: Number
        },
        move:{
            type:String
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        menu_list:[
            { menu_img: 'https://hcmtq.oss-accelerate.aliyuncs.com/resources/tab_0_2.png', menu_name: "相册"},
            { menu_img: 'https://hcmtq.oss-accelerate.aliyuncs.com/resources/tab_1_1.png', menu_name: "发现" },
            { menu_img: 'https://hcmtq.oss-accelerate.aliyuncs.com/resources/tab_2_1.png', menu_name: "我的" }
        ]
    },

    /**
     * 组件的方法列表
     */
    methods: {
        activeTab(e){
            var index = e.currentTarget.dataset['index']
            var item = e.currentTarget.dataset['item'].menu_img.split("_")[1].substring(0, 1);
            var list = this.data.menu_list
            list.forEach((list, index) => {
                this.data.menu_list[index].menu_img = `https://hcmtq.oss-accelerate.aliyuncs.com/resources/tab_${index}_1.png`
            })
            this.data.menu_list[item].menu_img = `https://hcmtq.oss-accelerate.aliyuncs.com/resources/tab_${item}_2.png`
            this.setData({
                menu_list: this.data.menu_list
            })
            if(item == 0){
                wx.redirectTo({
                    url: '/pages/album/checkin/checkin',
                })
            }else if(item == 1){
                wx.redirectTo({
                    url: '/pages/discovery/index/index',
                })
            }else{
                wx.redirectTo({
                    url: '/pages/mine/home/mine',
                })
            }
            
        }
    }
})
