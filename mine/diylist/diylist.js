import { Diy } from './diy-model'
var diyModel = new Diy()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        isLoading: false,
        isSingle: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({ isLoading: true })
        diyModel.getWorkList().then(res => {
            this.setData({
                list: res.filter((item)=>{
                    if(item.work_name != '') return item
                }),
                isLoading: false
            })
        })

        // diyModel.getPartInfo('W0057746820190530').then(res => {
        //     console.log(res);
        //     // 1007007 是冲印产品
        //     if (res.code == 200 && res.result.catalogNo == '1007007') {
        //         this.setData({
        //             isChong: true
        //         })
        //     }
        // })
    },

    /**
     * 编辑当前diy作品
     */
    async toPreview(e) {
        var job_id = this.data.list[e.currentTarget.dataset.index].work_no;
        console.log(job_id)
        const res = await diyModel.getPartInfo(job_id);
        let isSingle = false
        if (res.code == 200 && res.result.catalogNo == '1007007') {
            isSingle = true
        }
        wx.redirectTo({
            url: `./preview/preview?job_id=${job_id}&isSingle=${isSingle}`
        });
    },
    /**
     * 删除当前diy作品
     */
    deleteMsg(e) {
        var value = e.currentTarget.dataset['index']
        console.log("删除当前的diy作品：" + value)

    }
})