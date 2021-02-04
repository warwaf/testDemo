// 首页波浪加载指示器
var canvas = null, ctx = null, waveImage = null, needAnimate = false
Component({
    /**
     * 组件的属性列表
     */
    timer: null,
    properties: {
        value: {
            type: Number,
            default: 0
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        init(){
            // this.createSelectorQuery()
            // .select('#wave')
            // .fields({ node: true, size: true })
            // .exec(res => {
            //     canvas = res[0].node    // 无法获取canvas ????
            //     ctx = canvas.getContext('2d')
            //     wx.downloadFile({
            //         url: 'http://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190326/C0002928120190326/origin/845f094058a7475593a955dd1cde28df.png',
            //         success: result => {
            //             waveImage = result.tempFilePath
            //             needAnimate = true
            //             setTimeout(() => {
            //                 if (needAnimate) this.animate()
            //             }, 500)
            //         }
            //     })
            // })

            // ctx = wx.createCanvasContext('wave', this)
            // wx.downloadFile({
            //     url: 'http://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190326/C0002928120190326/origin/845f094058a7475593a955dd1cde28df.png',
            //     success: result => {
            //         waveImage = result.tempFilePath
            //         needAnimate = true
            //         this.animate()
            //     }
            // })
        },

        // animate(){
	    //     var waveX = 0
        //     var waveY = 0
        //     var canvasHeight = 60, canvasWidth = 60
	    //     var waveX_min = -63
        //     var waveY_max = canvasHeight * 0.7
        //     var requestAnimationFrame = function (callback) { setTimeout(callback, 1000 / 60) }
	    //     function loop () {
	    //         if (!needAnimate) return
	    //         if (waveY < waveY_max) waveY += 0.5
	    //         if (waveX < waveX_min) waveX = 0; else waveX -= 1
	            
	    //         ctx.globalCompositeOperation = 'source-over'
	    //         ctx.beginPath()
	    //         ctx.arc(canvasWidth/2, canvasHeight/2, canvasHeight/2, 0, Math.PI*2, true)
	    //         ctx.closePath()
	    //         ctx.fill()
        //         ctx.draw()
	    //         ctx.globalCompositeOperation = 'source-in'
        //         ctx.drawImage(waveImage, waveX, canvasHeight - waveY, 136, 92)
        //         ctx.draw(true)
	    //         requestAnimationFrame(loop)
	    //     }
	    //     loop()
        // }
    },

    lifetimes: {
        ready() {
            this.init()
        },
    }
})
