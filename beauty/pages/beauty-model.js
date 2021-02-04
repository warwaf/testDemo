import { Base } from '../../utils/base'
var app = getApp()

class Beauty extends Base{

    constructor() {
        super()
    }

    get statusEnum(){
        return {
            SATISFACTION: 1,    //满意
            UNSATISFACTION: 2,  //不满意
            PENDING: 0          //有更新
        }
    } 

    getProducts(pageNum=1,pageSize=50){
        return new Promise((resolve,reject) => {
            this.request({
                url: this.apiSettings.GetBeautyProducts,
                method: 'POST',
                data: {
                    "phoneNo": app.globalData.userInfo.mobileNo,
                    // "phoneNo": '18205488885',
                    "activityId": app.globalData.activityInfo.activityId,
                    // "activityId": 'hc-f-285886',
                    pageSize,
                    pageNum
                }
            }).then( res => {
                resolve(res.result);
            })
        })  
    }

    getProduct(taskId, pageNum=1, pageSize=50){
        return new Promise((resolve,reject) => {
            this.request({
                url: this.apiSettings.GetBeautyProduct,
                method: 'POST',
                data: {
                    taskId,
                    pageSize,
                    pageNum
                }
            }).then( res => {
                resolve(res.result);
            })
        })  
    }

    saveEvaluate(fileId, evaluate, taskId, comment=''){
        return new Promise((resolve,reject) => {
            this.request({
                url: this.apiSettings.SaveBeautyEvaluate,
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                data: {
                    comment,
                    evaluate,
                    fileId,
                    taskId,
                    activityId: app.globalData.activityInfo.activityId,
                    mobile: app.globalData.userInfo.mobileNo
                    // mobile: '18205488885'
                }
            }).then( res => {
                if(res.code == 500){
                    reject(res.message)
                    return
                }
                resolve(res.result)
            })
        }) 
    }
}

export { Beauty }