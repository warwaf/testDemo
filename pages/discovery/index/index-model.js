import { Base } from '../../../utils/base.js'

class Index extends Base {

    constructor() {
        super()
    }

    /**
     * 根据等级列出发现活动
    */
    listLevel(level,pageNum,pageSize,id){
        const data = {
            level: level,
            pageNum: pageNum,
            pageSize: pageSize
        }
        if(id) data.discoverId = id
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.ListLevel,
                data,
                method: 'GET'
            }).then(res => {
                resolve(res)
            })
        })
    }

    listSpecial(lat, lng, city, style){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.ListSecondLevel,
                data: {
                    lat,
                    lng,
                    city,
                    style
                },
                method: 'GET'
            }).then(res => {
                resolve(res)
            })
        })
    }

    getAllMovement(pageNum, pageSize){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetAllMovement,
                data: {
                    pageNum,
                    pageSize
                },
                method: 'GET'
            }).then(res => {
                resolve(res)
            })
        }) 
    }

    getStyleList(){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.getStyleList,
                method: 'GET'
            }).then(res => {
                resolve(res)
            })
        }) 
    }

    /**
     * 获取风格类型列表
     */
    getCommonProperties(){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.getCommonProperties + "?type=common_style",
                method: 'GET'
            }).then(res => {
                resolve(res)
            })
        }) 
    }

    /**
     * 获取门店列表
     * @param {Strig} unionId 用户
     * @param {Strig} shopNo 门店号
     * @param {Strig} lat 经度
     * @param {Strig} lng 纬度
     * @param {Strig} area 城市名称
     * @param {Strig} style 风格
     * @param {Strig} shopName 门店名称
     */
    getStoreList(lat, lng, unionId, shopNo, area, style, shopName){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.getStoreList,
                data: {
                    lat,
                    lng,
                    unionId,
                    shopNo,
                    area, 
                    style, 
                    shopName
                },
                method: 'GET'
            }).then(res => {
                resolve(res)
            })
        })
    }
    /**
     * 查询是否已咨询
     * @param {Strig} storeId 门店号
     * @param {Strig} partNo 商品编码
     * @param {Strig} unionId 用户
     */
    getCheckAppoiment(storeId, partNo, unionId){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.getCheckAppoiment,
                header: { 'Content-Type': 'application/json'},
                data: {
                    storeId,
                    partNo,
                    unionId
                },
                method: 'POST'
            }).then(res => {
                resolve(res)
            })
        })
    }

}
export { Index }