let url = 'https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/mtq/20201222/C0767694720201222/origin/53e6caf1905e4be3a00b57c0570501f8.png'
let urlStr = {
  // getUrl (val) {
  //   console.log(val, 'val<<<')
  //   url = val
  // }
}
const wxml = `
<view class="poster_content">
  <image class="poster_content_img" src="${url}"></image>
  <image class="qrCode" src="https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/mtq/20201222/C0767694720201222/origin/thumb/4fdfcd873ff54877ade71f4bf4973d3a_small.png?x-oss-process=image/resize,w_400/auto-orient,1"></image>
</view>
`

const style = {
  poster_content:{
    // display: 'flex',
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    // position: 'absolute',
    // left: 0,
    // textAlign: 'center'
    // top:0
  },
  poster_content_img:{
    width: 349,
    height: 504,
    marginTop: 13,
    marginLeft: 13,
  },
  qrCode:{
    position: 'absolute',
    bottom: 24,
    left: 42,
    width: 80,
    height: 80,
  }
}

module.exports = {
  wxml,
  style,
  urlStr
}
