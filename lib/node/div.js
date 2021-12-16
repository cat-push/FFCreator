// 它将是一个容器，类似于网页的div，但有指定的xy和配置，他会默认将自己的配置分配给子元素 例如style，偏移，但不应该覆盖
// 它将确保容器内元素不会相互覆盖，同时不需要指定x，y坐标，同时支持一些特定的样式
const FFCon = require('./cons');

class FFDiv extends FFCon {
  constructor(conf){
    super({ type: 'node', ...conf });
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
    // todo？ 是否应该添加行内元素类型 宽度相加溢出后自动移动到下一行
    for (const c of this.children) {
      let x = curX
      let y = curY
      if(c.display.style && c.display.style.marginTop){
        y += c.display.style.marginTop
      }
      if(c.display.style && c.display.style.marginLeft){
        x += c.display.style.marginLeft
      }
      c.conf.x = x
      c.conf.y = y
      c.setXY(x,y)

      let wh = c.getWH()
      curY = y + wh[1]
    }

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


  start(){
    super.start();
    this.updateChildPos()
    this.updateChildAnime()
    this.children.forEach(child => child.start());
  }
}

module.exports = FFDiv
