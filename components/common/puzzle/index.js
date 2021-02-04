// components/common/puzzle/index.js
import regeneratorRuntime from '../../../utils/runtime';
import Puzzle from './puzzle';
const  puzzle = new Puzzle();
// const puzzle = new puzzle();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 图片数组
    arr:{
      type:Array,
      value: []
    },
    // 布局
    layout: {
      type:Array,
      value: []
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    // 是否显示编辑器
    mainShow: '',
    imagesInfo:[],
    currentInfo: {},
    currentIndex: null,
    tempTest:null,
    scale: 1,
    width: 0,
    height: 0,
    isShowTip: false,
    isLoading: false
  },
  attached(){
    this.main = wx.createCanvasContext('main',this);
    this.edit = wx.createCanvasContext('edit', this);
    this.automate = wx.createCanvasContext('automate',this);
    const { scale } = this.data;
    this._w = 286 * scale;
    this._h = 380 * scale;
    this.setData({
      width: 286 * scale,
      height: 380 * scale
    })
  },
  ready(){
    this.init();
    const that = this;
    wx.getStorage({
      key: 'showTip',
      success(res){
        console.info(res)
        that.setData({
          isShowTip: !res.data
        })
      },
      fail(err){
        that.setData({
          isShowTip: true
        })
      }
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 缩放图片
    scaleImage(scale){
        puzzle.list.map((item,index)=>{
          if(item.current){
            item.scale -= scale;
            if(item.scale < 1) item.scale = 1;
            if(item.scale > 4) item.scale = 4;
          }
        })
    },
    getImage(){
      return new Promise((resolve)=>{
        wx.canvasToTempFilePath({
          canvasId:'main',
          x: 0,
          y: 0,
          width: this._w,
          height: this._h,
          fileType: 'jpg',
          success(res) {
            resolve(res)
          },
          fail(e){
            console.info(e)
          }
        },this)
      }) 
    },
    tapTip(){
      const that = this;
      wx.setStorage({
        key: 'showTip',
        data: true,
        success(){
          that.setData({
            isShowTip: false
          })
        }
      })
    },
    moveEdit(e){
      if(e.touches.length > 1){
          const preTwoPoint = {
            x1: e.touches[0].x,
            y1: e.touches[0].y,
            x2: e.touches[1].x,
            y2: e.touches[1].y,
          }
          const twoPoint = this.point;
           // 计算距离，缩放
           var preDistance = Math.sqrt(Math.pow((preTwoPoint.x1 - preTwoPoint.x2), 2) + Math.pow((preTwoPoint.y1 - preTwoPoint.y2), 2))
           var curDistance = Math.sqrt(Math.pow((twoPoint.x1 - twoPoint.x2), 2) + Math.pow((twoPoint.y1 - twoPoint.y2), 2))
           this.scaleImage((curDistance - preDistance) * 0.0005)
      }else{
        const { x, y } = e.touches[0];
        let mx = this.currentInfo.x + x-this.currentTouch.x;
        let my = this.currentInfo.y + y-this.currentTouch.y;
        puzzle.list.map((item)=>{
          if(item.current) {
            const { dw,dh, info} = item;
            const w = (dw - info.width)/2;
            const h = (dh - info.height)/2;
            const mw = info.x + info.width - dw - (info.x-w);
            const mh = info.y + info.height - dh - (info.y - h);
            if(mx > w) mx =  w;
            if(mx <  mw ) mx = mw;
            if(my > h) my = h;
            if(my < mh) my = mh;
            item.x =  mx;
            item.y =  my;
          }
        })
      }
      
    },
    endEdit(e){
    },
    startEdit(e){
      this.currentTouch = e.changedTouches[0];
      puzzle.list.map((item,index)=>{
        item.current = false;
        const current = this.insidePolygon(item.coordinate,this.currentTouch);
        if(current) {
          item.current = true;
          this.currentInfo = Object.assign({},item);
          this.edit.save();
          puzzle.drawShap(this.edit,item.coordinate);
          this.edit.draw();
        }
      })

      if(e.touches.length > 1){
        this.point = {
          x1: e.touches[0].x,
          y1: e.touches[0].y,
          x2: e.touches[1].x,
          y2: e.touches[1].y
        }
      }
    },
    /**
     *  判断一个点是否在多边形内部
     *  @param points 多边形坐标集合
     *  @param testPoint 测试点坐标
     *  返回true为真，false为假
     *  */
    insidePolygon(points, testPoint) {
      let x = testPoint.x, y = testPoint.y;
      let inside = false;
      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
          let xi = points[i].x, yi = points[i].y;
          let xj = points[j].x, yj = points[j].y;
          let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
          if (intersect) inside = !inside;
      }
      return inside;
    },
    /**
     * 初始化
     */
    async init(){
      const data = this.data;
      this.setData({ isLoading: true })
      // wx.showLoading({
      //   title: "加载图片中...",
      //   mask:true
      // })
      this.timer = 0;
      puzzle.layout = data.layout;
      const arr = await puzzle.loadImage(data.arr);
      this.setData({
        arr,
        isLoading: false
      })
      // wx.hideLoading();
      puzzle.list = arr;
      puzzle.heartbeat(this.main, arr);
    },
    
    changeLayout(layout){
      const arr = this.data.arr;
      puzzle.layout = layout;
      puzzle._imageInfo(arr);
      this.edit.clearRect(0,0,400,500);
      this.edit.draw();
    },
  },
 
})
