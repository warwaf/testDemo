import { Base } from '../../../utils/base.js'

class Coupon extends Base{

    constructor() {
        super()
    }
    /**
     * 获取优惠卷信息
     */
    getCounpons(){
        return new Promise((resolve, reject) => {
            var list = [
                {
                    id: 1,
                    activityName: '天涯海角三亚旅拍',
                    code: 'DAU13Q7D',
                    img: 'https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20181118/C0001317120181118/origin/C0001317120181118_0096.png',
                    qrcode: 'https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190403/C0003763920190403/origin/C0003763920190403_0361.png',
                    avatarUrl: 'https://hcmtq.oss-accelerate.aliyuncs.com/resources/avatar-1.png'
                },
                {
                    id: 2,
                    activityName: '3D立体摄影',
                    code: 'U8JD79DD',
                    img: 'https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20181118/C0001317120181118/origin/C0001317120181118_0096.png',
                    qrcode: 'https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190403/C0003763920190403/origin/C0003763920190403_0362.png',
                    avatarUrl: 'https://hcmtq.oss-accelerate.aliyuncs.com/resources/avatar-2.png'
                }
            ]

            resolve(list)
        })
    }
    /**
     * 获取已收到优惠券
     */
    // getReceived(){
    //     return new Promise((resolve, reject) => {
    //         var list = [
    //             {
    //                 amount: 100,
    //                 activityName: '3D立体摄影',
    //                 code: 'DHSJKH',
    //                 img: 'http://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20181118/C0001317120181118/origin/C0001317120181118_0096.png'
    //             }
    //         ]
    //         resolve(list)
    //     })
    // }
}

export { Coupon }