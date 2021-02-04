Component({
    relations: {
        '../loading/loading': {
            type: 'child'
        }
    },
    /**
     * 组件的属性列表
     */
    properties: {
        data: {
            type: Object,
            observer(newVal, oldVal, changedPath) {
                const { column } = this.properties;
                // 根据 column 初始化 imgArr 数据；
                if(this.data.imgArr.length <= 0) {
                    this.setData({
                        imgArr:getEmptyArr(column,true)
                    })
                }
                const { imgArr } = this.data;
                // 1.深拷贝 三维渲染数组 [[[第一次跟新的数组],[第二次跟新的数组],[第三次跟新的数组]],[[第一次跟新的数组],[第二次跟新的数组],[第三次跟新的数组]]]
                const arr = JSON.parse(JSON.stringify(imgArr));
                let arr_two = [];
                let temp = getEmptyArr(column)
                // 2.把三维数组 转化为 二维数组
                arr.map((item,i)=>{
                    arr_two[i] = item.reduce(function (a, b) { return a.concat(b)})
                })
                const w = this.data.columnWidth;
                // 遍历新增的数组
                newVal.map(item => {
                    // 获取高度最小的列
                    const min = getMinColumn(arr_two);
                    arr_two[min].push(item);
                    temp[min].push(item);
                })
                // 获取高度最小的列
                function getMinColumn(arr){
                    // 遍历二维数组
                    let h = -1;
                    let i = 0;
                    arr.map((item,index)=>{
                        const _h = item.reduce((pre, cur) => {
                           return pre + cur.picHeight*(w/cur.picWidth)+31;
                        },0)
                        if(h == -1) h = _h;
                        if(_h < h) {
                            h = _h;
                            i = index;
                        }
                    })
                    return i;
                }
                
                // 创建空数组
                function getEmptyArr(column,isThree){
                    let arr = []
                    for (let index = 0; index < column; index++) {
                        if(isThree) {
                            arr[index] = [[]];
                        }else{
                            arr[index] = [];
                        }
                    }
                    return arr;
                }
                
                // 局部更新数据
                let obj = {}
                imgArr.map((item,i) => {
                    const key = `imgArr[${i}][${imgArr[i].length}]`
                    obj[key] = temp[i];
                    
                })
                this.setData(obj)
            }
        },
        //列数
        column: {
            type: Number,
            value: 2
        },
        hot: {
            type: Boolean,
            default: false
        },
        discoverId: {
            type: Number,
            default: 0
        }
    },

    externalClasses: [
        'water-class'
    ],

    /**
     * 组件的初始数据
     */
    data: {
        //每列宽度
        columnWidth: 0,
        colunmnHeight: [0, 0],
        // 三维展示数组
        imgArr: [],
        paddingWidth: 5,
        //存放已选择图片
        selectedImgs: [],
    },

    /**
     * 组件的方法列表
     */
    methods: {
       
        //初始化瀑布流
        init() {
            const { column } = this.properties;
            const { paddingWidth } = this.data;
            const ww = wx.getSystemInfoSync().windowWidth;
            var columnWidth = Math.floor(((ww  - 2 * column * paddingWidth) -  column * paddingWidth) / column);
            this.setData({
                columnWidth
            })
        },

        /**
         * 跳转详情页
         */
        toDetail(event) {
            var id = event.currentTarget.dataset.id
            var unionId = event.currentTarget.dataset.unionid
            var praise = event.currentTarget.dataset.praise
            console.log(event);
            
            // indexModel.addMovementHot(this.properties.discoverId, id, 1)
            wx.navigateTo({
                url: `/pages/discovery/detail/detail?id=${id}&unionId=${unionId}&praiseCount=${praise}`,
            })
        },
        /**
         * 跳转到个人中心
         */
        toPersonal(event){
            var unionId = event.currentTarget.dataset.id
            wx.navigateTo({
                url: `/pages/discovery/hishomepage/hishomepage?unionId=${unionId}`,
            })
        }
    },

    lifetimes: {
        attached() {
            this.init()
        }
    }
})
