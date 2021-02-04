import { Base } from '../../utils/base.js'

class Photo extends Base{
    constructor(){
        super()
    }

    getCollectionList(){
        return new Promise((resolve, reject)  => {
            return this.request({
                url: this.apiSettings.GetCollection,
                method:'GET',
                data: {
                    unionId: getApp().globalData.unionid
                }
            }).then(res => {
                resolve(res)
            })
        })
    }

    getImageList(){
        return new Promise((resolve, reject) => {
            return this.request({
                url: this.apiSettings.GetImageList,
                method: 'GET',
                data: {
                    unionId: getApp().globalData.unionid
                }
            }).then(res => {
                resolve(res)
            })
        })
    }
}

export { Photo }