// components/discovery/searchMine/searchMine.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        mineImg:{
            type:Object
        },
        mine:{
            type:Number
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        select:false,
        cartArr:[1,2,3,4],
        selectBtn:false
    },

    /**
     * 组件的方法列表
     */
    methods: {
        activeSelect(e) {
            // console.log(e)
            // console.log(this.data.mineImg)
            var num = e.currentTarget.dataset['num']
            var mineImg = this.data.mineImg
            mineImg.forEach((item, index) => {
                console.log(item)
            })
        },
        radioChange(e){
            console.log(e.detail.value)
            this.setData({
                selectBtn: true
            })

        }
    }
})
