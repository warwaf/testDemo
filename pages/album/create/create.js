// pages/album/create/create.js
import { Setting } from '../setting/setting-model.js'
import { Home } from '../home/home-model'

var settingModel = new Setting()
var homeModel = new Home()

const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [{
                'activeImg': 'https://hcmtq.oss-accelerate.aliyuncs.com/resources/love.png',
                'activityType': '情侣',
                'activityDesc': '约会、生日、纪念日、旅行、恋爱美好日常...\n 从现在开始, 留住每一个爱的瞬间',
                'activityName': [
                    '执子之手，与子偕老',
                    '念念不忘，手心挚爱',
                    '我们的小暧昧',
                    '爱的足迹',
                    '思念是一种病',
                    '爱的魔力转圈圈'
                ]
            },
            {
                'activeImg': 'https://hcmtq.oss-accelerate.aliyuncs.com/resources/family.png',
                'activityType': '家人',
                'activityDesc': '宝宝照、旅游、家庭聚会、日常生活照、全家福... \n 纵使时光飞逝，定格我们幸福的时光',
                'activityName': [
                    '爱的港湾',
                    'Happy Family',
                    '温馨小窝',
                    '爱我的人和我爱的人',
                    '你看这一家子',
                    'We R 伐木累',
                    '正儿八经一家人'
                ]
            },
            {
                'activeImg': 'https://hcmtq.oss-accelerate.aliyuncs.com/resources/friend.png',
                'activityType': '朋友',
                'activityDesc': '同窗故事、日常聚会、生日Party、兴趣爱好、追星... \n 每张照片上的相聚都是友谊的见证',
                'activityName': [
                    '友谊天长地久',
                    '一起走过的日子',
                    '永远的你我他',
                    '损友帮',
                    '老友记'
                ]
            },
            {
                'activeImg': 'https://hcmtq.oss-accelerate.aliyuncs.com/resources/colleague.png',
                'activityType': '同事',
                'activityDesc': '公司庆典、发布会、团建、年会、拓展、培训... \n 每一个和你用心起舞的日子始终记着',
                'activityName': [
                    '本公司我们最浪',
                    '革命战友根据地',
                    '公司风华录',
                    '吃饭组局子一起浪',
                    ' 一起签卡一起秀'
                ]
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.data.activityStyle = options.type
    },

    //创建相册
    select: function(e) {
        var curIndex = e.currentTarget.dataset.index
        var activityNameList = this.data.list[curIndex]['activityName']
        var data = {
            activityName: activityNameList[Math.floor(Math.random() * activityNameList.length)],
            activityType: this.data.list[curIndex]['activityType'],
            startTime: '2019-01-01 00:00:00',
            endTime: '2019-12-30 00:00:00',
            unionId: getApp().globalData.unionid,
            powerType: 1,
            activityStyle: this.data.activityStyle
        }
        wx.showLoading()
        settingModel.createActivityRoom(data).then(res => {
            app.globalData.roomInfo.room_no = res.result.activityId
            homeModel.addRecord().then(() => {
                wx.hideLoading()
                if (res.code == 200) {
                    wx.redirectTo({
                        url: `/pages/album/home/home?room_no=${res.result.activityId}&fromCreate=1`,
                    })
                }
            })
        })
    },

    /**
     * 合成封面
     */
    generateCover(activityInfo){
        var ctx = wx.createCanvasContext('cover', this)

    }

})