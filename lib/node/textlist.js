const FFNode = require('./node');
const FFText = require('./text');
const FFLogger = require('../utils/logger');
const {Container} = require('inkpaint');
const forEach = require('lodash/forEach');

class FFTextlist extends FFNode {
  constructor(conf) {
    super({type: 'textlist', ...conf});
    if (!conf.height)
      FFLogger.error({pos: 'FFTextList', error: 'This component must enter the height!'});

    this.children = [];
    this.list = conf.list;
    this.page = conf.page

    this.setDuration(conf.duration);
    this.setTransition(conf.transition);
    this.setWH(conf.width, conf.height)
    this.setTransTime(conf.time);
    // this.setDefaultStyle()
  }


  setText(list) {
    this.list = list
  }

  setPage(num) {
    this.page = num
  }

  createDisplay() {
    this.display = new Container();
  }

  setDuration(duration = 2) {
    this.duration = duration;
  }

  setTransition(transition = 'random') {
    this.transition = transition;
  }

  setDefaultStyle() {
    const padding = 10;
    const {color = '#ffffff', backgroundColor = '#00219c'} = this.conf;
    this.setStyle({color, padding, backgroundColor, alpha: 0});
  }


  setTransTime(time = 1) {
    this.time = time;
  }

  getStartAniName() {
    const {startEffect = "fadeInDown"} = this.conf
    return startEffect
  }

  createSingleText(text) {
    return new FFText({
      text: text,
      fontSize: this.conf.fontSize,
      color: this.conf.color,
      style: this.conf.style,
    })
  }

  isMultiLine(text) {
    return text.indexOf("\n") > -1 || text.indexOf("\r\n") > -1
  }

  splitText(text) {
    let arr = text.split(/\r?\n/)
    let result = []
    forEach(arr, (item) => {
      result.push(item)
    })
    return result
  }

  getMaxHeightText(text, height) {
    let temptext = this.splitText(text)
    let temp = ""
    for (let i = 0; i < temptext.length; i++) {
      if (i === 0) {
        temp += temptext[i]
      } else {
        temp += "\r\n" + temptext[i]
      }
      let c = this.createSingleText(temp)
      let wh = c.getWH()
      if (wh[1] > height) {
        return {
          text: temp,
          remainText: temptext.slice(i).join("\r\n"),
          remainHeight: 0
        }
      }
    }

    let c = this.createSingleText(temp)
    let wh = c.getWH()
    return {
      text: temp,
      remainText: "",
      remainHeight: height - wh[1]
    }
  }

  createTextNode() {

  }


  getListStyle() {
    return this.conf.listStyle
  }

  createEffectAndStart() {
    let curX = 0
    let curY = 0
    let {delay = 0, pageTime = 3, pageEffect = "fadingOut", stopTime = -1, stopEffect = "fadingOut"} = this.conf
    let curTime = delay
    let thisWh = this.getWH()
    let curPageNum = 1
    let curPage = []
    let renderText = []
    for (const [i, text] of this.list.entries()) {
      let x = curX
      let y = curY


      let c = this.createSingleText(text)
      let style = c.getStyle()
      let wh = c.getWH()
      const {marginTop = 0} = style
      y += marginTop

      // 如果超出这一页和这不是多行文本
      if (y + wh[1] > thisWh[1]) {

        // 如果是非多行文本和还没有一个元素就什么都不做 让这个元素在本页
        if (curPage.length === 0 && !this.isMultiLine(text)) {

        } else {
          // 如果不是多行文本 直接下一页
          if (!this.isMultiLine(text)) {
            // if over pageNum, add stop effect and break
            if (curPageNum >= this.page) {
              break
            }
          } else {
            let remainHeight = thisWh[1] - y
            let t = this.getMaxHeightText(text, remainHeight)
            let textNode = this.createSingleText(t.text)

            textNode.setXY(x, y)
            textNode.addEffect(this.getStartAniName(), this.time, curTime)
            curTime += this.duration
            curPage.push(textNode)
            renderText.push(textNode)
            if (curPageNum >= this.page) {
              break
            }

            if (t.remainText != "") {
              this.list[i + 1] = t.remainText + (this.list[i + 1] ? this.list[i + 1] : "")
            }
          }
          for (const t of curPage) {
            t.addEffect(pageEffect, this.time, curTime - this.duration + pageTime + this.time)
          }

          curTime += pageTime
          curTime += this.time
          curPage = []
          curPageNum += 1
          y = 0
          y += marginTop
          continue
        }
      }


      c.setXY(x, y)

      c.addEffect(this.getStartAniName(), this.time, curTime)
      curTime += this.duration
      curPage.push(c)
      renderText.push(c)

      curY = y + wh[1]
    }
    // add  to render
    if (stopTime > 0) {
      for (const t of curPage) {
        t.addEffect(stopEffect, this.time, curTime + stopTime)
      }
    }
    forEach(renderText, text => this.addChild(text));
  }

  /**
   * Add child elements
   * @param {FFNode} child - node object
   * @public
   */
  addChild(child) {
    this.display.addChild(child.display);
    child.parent = this;
    this.children.push(child);
  }


  start() {
    this.animations.start();
    // forEach(this.list, text => this.createSingleText(text));
    this.createEffectAndStart();
    forEach(this.children, children => children.start());
  }

  destroy() {
    forEach(this.children, children => {
      children.destroy();
    });
    this.list = null
    this.saveText = null
    this.children = null
    super.destroy()
  }

}

module.exports = FFTextlist
