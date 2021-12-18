// 它将是一个容器，类似于网页的div，但有指定的xy和配置，他会默认将自己的配置分配给子元素 例如style，偏移，但不应该覆盖
// 它将确保容器内元素不会相互覆盖，同时不需要指定x，y坐标，同时支持一些特定的样式
const { defaultsDeep } = require('lodash');
const FFCon = require('./cons');

class FFDiv extends FFCon {
  constructor(conf){
    super({ type: 'div', ...conf });
  }

  preProcessing(){

  }

  addChild(child) {
    this.display.addChild(child.display);
    child.parent = this;
    child.conf = {...this.conf, ...child.conf}
    this.children.push(child);
  }

  // 更新子元素的坐标
  updateChildPos(){
    let curX = this.conf.x
    let curY = this.conf.y
    let preW = 0
    let preH = 0
    let thisWh = this.getWH()
    for (const c of this.children) {
      let x = curX
      let y = curY
      let wh = c.getWH()
      let style = c.getStyle()
      if(!style){
        continue
      }
      
      // 左右中对齐
      if(style.align){
        switch(style.align){
           case "left" :
               x = this.conf.x
               break
           case  "right":
               x =  this.conf.x + thisWh[0] - wh[0]
               break
           case "center":
               x = this.conf.x + (thisWh[0] - wh[0])/2
               break
           default:
               //  todo  log error
               break
        }
      }

      // 是否允许元素相邻
      const {display = "block"} = style
      if(display){
        switch(display){
          case "block":
            // 如果这行已经有一个元素 强制换行
            if(curX != this.conf.x){
              y = curY + preH
              
            }else{
              y = curY
            }
            curY = y + wh[1]
            break
          case  "inline-block":
            // fixme 如果宽大于div的宽 会被迫换行
            if(curX+wh[0]>this.conf.x +thisWh[0]){
              x = this.conf.x
              y = curY + preH
            }else{
               x = curX
               y = curY
            }
            curX = x + wh[0]
            curY = y
            break
        }
      }

      // 间距
      const {marginTop = 0, marginLeft = 0} = style
      y += marginTop
      x += marginLeft

      c.conf.x = x
      c.conf.y = y
      c.setXY(x,y)

      preW = wh[0] += marginLeft
      preH = wh[1]
      if(style && style.marginBottom){
        preH += style.marginBottom
      }
    }
  }

  // 更新子元素的宽高
  updateChildWH(){
    let thiswh = this.getWH()
    let width = thiswh[0]
    let height = thiswh[1]
    for (const c of this.children) {
      let wh = c.getWH()
      let w  = wh[0]
      let h  = wh[1]
      let style = c.getStyle()
      if(style && style.width){
        w  = style.width
        if(w.endsWith("%")){
          let scale = w.slice(0, -1);
          w = width * (scale/100)
        }
      }
      if(style && style.height){
        h =  style.height
        if(h.endsWith("%")){
          let scale = h.slice(0, -1);
          h = height * (scale/100)
        }
      }
      c.setWH(w,h)
    }
  }
  /**
   * Set x,y position
   * @param {number} x - x position
   * @param {number} y - y position
   * @public
   */
   setXY(x = 0, y = 0) {
   // this.display.x = x;
   // this.display.y = y;
      this.conf.x = x
      this.conf.y = y
  }


  updateChildAnime(){

    for (const c of this.children) {
      if(!c.animations){
        return
      }
      if(c.animations.list.length>0){
        c.animations.list = []
        for (const anime of c.addAnimationsHistory) {
          anime(c)
        }
      }
    }
  }

  // todo 实现div嵌套需要计算div自身宽高
  getWH(){
    const { width = 0, height = 0 } = this.conf;
    if (width && height) {
      return [width, height];
    } else {
      return [this.display.width, this.display.height];
    }
  }

  setWH(width, height){
    this.conf.width =  width
    this.conf.height =  height
    this.display.width = width
    this.display.height = height
  }


  start(){
    super.start();
    this.updateChildWH()
    this.updateChildPos()
    this.updateChildAnime()
    this.children.forEach(child => child.start());
  }
}

module.exports = FFDiv
