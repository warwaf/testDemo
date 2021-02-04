import {
  Base
} from '../../../utils/base.js'

var app = getApp()

class newBeauty extends Base {

  constructor() {
    super()
  }

  get PicType() {
    return {
      Beauty: 2,
      Normal: 1
    }
  }

  /**
   * 获取看美照列表
   */
  getBeautyList(imgType, room_no) {
    return new Promise((resolve, reject) => {
      this.request({
        url: this.apiSettings.GetListByphomeNo,
        data: {
          imageType: imgType,
          // activityId: 'hc-f-290714'
          activityId: room_no ? room_no : app.globalData.roomInfo.room_no
        }
      }).then(res => {
        resolve(res.result)
      })
    })
  }
  /**
   * 获取房间配置
   */
  getToolsConfig(imgType) {
    return new Promise((resolve, reject) => {
      this.request({
        url: this.apiSettings.GetToolsConfig,
        data: {
          activityId: app.globalData.roomInfo.room_no,
          type: imgType
        },
        method: 'GET'
      }).then(res => {
        resolve(res)
      })
    })
  }
}

export {
  newBeauty
}
