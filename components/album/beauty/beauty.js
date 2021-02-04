// components/album/beauty/beauty.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        data: {
            type: Array,
            observer(newVal, oldVal, changedPath) {
                newVal.forEach((item, index) => {
                    if (JSON.stringify(item) !== '{}') {
                        var minIndex = this.data.colunmnHeight[0] > this.data.colunmnHeight[1] ? 1 : 0
                        this.data.colunmnHeight[minIndex] += Math.floor((168 / item.picWidth) * item.picHeight)
                        this.data.imgArr[minIndex].push(item)
                    }
                })
                this.setData({
                    colunmnHeight: this.data.colunmnHeight,
                    imgArr: this.data.imgArr
                })
            }   
        },
        index: {
            type: Number
        },
        praiseArr: {
            type: Array,
            observer(newVal, oldVal, changedPath) {
                if(newVal.length > 0){
                    for(let i = 0; i < newVal.length; i++){
                        this.data.imgArr.forEach((arr, j) => {
                            arr.forEach((item, index) => {
                                if(item.picId == newVal[i].picId){
                                    this.setData({
                                        ['imgArr['+j+']['+index+'].praiseCount'] : newVal[i].praiseCount
                                    })
                                }
                            })

                        })
                    }
                }
            }   
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        //每列宽度
        colunmnHeight: [0, 0],
        imgArr: [[], []]
    },

    /**
     * 组件的方法列表
     */
    methods: {
        toDetail(e){
            this.triggerEvent('clickEvent', {
                index: this.properties.index,
                position: e.currentTarget.dataset.position
            })
        }
    },

    lifetimes: {
        attached() {

        }
    }
})
