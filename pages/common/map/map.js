// map.js
Page({
    data: {
        latitude: 0.000000,
        longitude: 0.000000,
        markers: [],
        showMap: false
    },

    onLoad(options){
        var marker = {
            iconPath: "http://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/v2.1/icon9.png",
            id: 0,
            latitude: options.lat,
            longitude: options.lng,
            width: 50,
            height: 50
        }
        var markers = [marker]
        this.setData({ markers, latitude: options.lat, longitude: options.lng }, () => {
          this.setData({ showMap: true })
        })
    },

    regionchange(e) {
      console.log(e.type)
    },
    markertap(e) {
      console.log(e.markerId)
    },
    controltap(e) {
      console.log(e.controlId)
    }
})

// address: "广东省东莞市东城街道旗峰公园-黄旗道院旗峰景区"
// lat: 23.018433
// level: 2
// lng: 113.725678