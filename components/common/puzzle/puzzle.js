import regeneratorRuntime from '../../../utils/runtime';
var app = getApp();

export default class puzzle {
   constructor() {
      // 心跳器间隔时间
      this.intervalTime = 100;
      this.list = [];
      this.layout = [];
      this.scale = 1;
      this._w = 286 ;
      this._h = 380 ;
   }
   /**
   * 进入拼图编辑器时 加载所有图片信息
   * @param {*} arr 
   */
   async loadImage(arr){
      const temp = []
      arr.map((item,index)=>{
          const url = item.replace('http://','https://')
          temp[index] = getImageInfo(url)
      })
      const t =  await Promise.all(temp);
      return this._imageInfo(t);
   }
   /**
     * 心跳器
     * @param {*} ctx  canvas
     * @param {*} arr 要渲染的数组
     */
   heartbeat(ctx,arr){
      ctx.save();
      setInterval(()=>{
        ctx.clearRect(0,0,400,500);
        arr.map((item)=>{
          this.drawShap(ctx,item.coordinate,true);
          const pre = this._w/this._h;
          const tp = item.width/item.height;
          let w =0,h =0;
          if(tp> pre){
            h = this._h * item.scale;
            w = this._h/item.height*item.width * item.scale
          }else{
            w = this._w * item.scale;
            h = this._w/item.width*item.height * item.scale
          }
          let x = item.x - (w-item.info.width)/2 + item.info.x;
          let y = item.y - (h-item.info.height)/2 + item.info.y;
          ctx.drawImage(item.path, x,y,w,h);
          ctx.restore();
          item.dw = w;
          item.dh = h;
        })
        ctx.draw();
      },this.intervalTime);
   }
   /**
   * 处理加载后的图片信息
   * @param {*} arr 
   */
    _imageInfo(arr) {
      const defaultInfo = {
        x:0, // x坐标
        y:0, // y坐标
        type: 'image', // 数据类型
        scale:1, // 缩放
        rotate:0, // 旋转
        current:false // 当前是否选中 默认为 false
      } 
      arr.map( (item,index) => {
        delete item.errMsg;
        const coordinate = parseArrByStr(this.layout[index])
        defaultInfo.info = parseInfoByArr(coordinate, this.scale);
        defaultInfo.coordinate = coordinate;
        item = Object.assign(item,defaultInfo)
      })
      return arr;
    }
    /**
     * 绘制图形
     * @param {*} ctx 
     * @param {*} arr 
     * @param {*} clip 
     */
    drawShap(ctx, arr, clip){
      // const { scale } = this.data;
      ctx.save();
      ctx.beginPath();
      arr.map((item, index) => {
        if (index == 0) {
          ctx.moveTo(item.x, item.y)
        } else {
          ctx.lineTo(item.x, item.y)
        }
      })
      ctx.closePath();
      if(clip == true) {
        ctx.setFillStyle('#f1f1f1')
        ctx.fill();
        ctx.clip();
      }else{
        ctx.setStrokeStyle('#0484FF');
        ctx.setLineWidth(3)
        ctx.stroke();
      }
    }
}
/**
 * 解析
 */
function parseArrByStr(str) {
  const temp = [];
  let x = 0;
  str.split(',').map((item, index) => {
    if (index % 2 == 0) {
      x = item
    } else {
      temp.push({
        x: x,
        y: item
      })
    }
  })
  return temp;
}
/**
 * 解析数组,获取 x,y,width,height
 */
function parseInfoByArr(arr,scale){
  let minX = 0, minY = 0, maxX = 0, maxY = 0;
  arr.map((item, index) => {
    const x = parseInt(item.x);
    const y = parseInt(item.y);
    if (index == 0) { minX = x; minY = y; }
    else {
      if (x <= minX) minX = x;
      if (y <= minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  })
  return {
    x: minX*scale,
    y: minY*scale,
    width: maxX*scale - minX*scale,
    height: maxY*scale - minY*scale
  }
}

// 获取图片
const getImageInfo = function(url) {
  return new Promise((resolve, reject) =>{
    wx.getImageInfo({
      src: url+ "?x-oss-process=image/resize,l_900",
      success(res){
        resolve(res)
      }
    })
  })
}