import { createComponent, event } from "../../../reactivity/index";
//保存房间所有图片,分页数据从此数组中取
var photoArr = []
createComponent()({
    /**
     * 组件的初始数据
     */
    data: {
        photoList:[],
        pageNo: 1,
        photoTotal: 0,
        showWaterFall: true,
        datePhotoArr:[], // 时间轴
    },
    created(){
        // 订阅页面滚动事件
        event.subscrible('onPageScroll', (e) => this.onPageScroll(e,this))
    },
    mounted(){
        this.loadPhotoData();
    },
    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 刷新
         */
        _reflesh(){
            photoArr = [];
            this.set({
                pageNo: 1,
                photoTotal: 0,
                showWaterFall: false
            })
            this.loadPhotoData();
            this.set({
                showWaterFall: true
            })
        },
        _toggle(){
            console.log("切换视图");
        },
        _puzzling(max){
            console.log("选图模式");
        },
        async loadPhotoData(){
            const res = await this.fetch({
                url: "/activityRoom/gePhotosByActivityId",
                method: 'GET', 
                data: {
                    activityId: "hc-f-659357",
                    pageNo: this.data.pageNo++,
                    pageSize: 30,
                    classification: "默认",
                    type: 5
                }
            })
            if(res.code == 200 && res.result.Code == 0){
                this.set({
                    photoList: res.result.Photos,
                    photoTotal: res.result.Total,
                })
                photoArr = photoArr.concat(res.result.Photos)
            }
        },
        /**
         * 页面滚动事件
         */
        onPageScroll:(e,o) => {
            if (e.target[0].scrollTop > 500 * o.data.pageNo) {
                if (photoArr.length >= o.data.photoTotal) return
                o.loadPhotoData()
            }
        }
    }
})
