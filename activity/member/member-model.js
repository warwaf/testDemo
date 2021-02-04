import { Base } from '../../utils/base.js'

var app = getApp()

class Member extends Base{
    
  constructor() {
      super()
  }

  /**
   * 创建订单号
   */
  createOrder(data) {
    return new Promise((resolve, reject) => {
      this.request({
        url: this.apiSettings.createPOrder,
        header: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        data,
      }).then(res => {
        resolve(res)
      })
    })
  }


}

export const MemberModel = new Member()