const FFTextlist = require("./textlist");
const forEach = require("lodash/forEach");
const FFText = require("./text");


class FFSingPageTextList extends FFTextlist {
  createEffectAndStart() {
    let {delay = 0, pageTime = 3, pageEffect = "fadingOut", stopTime = -1, stopEffect = "fadingOut"} = this.conf
    let curTime = delay
    let lastText = null
    let renderText = []
    for (const text of this.list) {
      if(lastText !== null) {
        lastText.addEffect(pageEffect, this.time, curTime+pageTime)
        curTime += pageTime
        curTime += this.time
      }
      let x = 0
      let y = 0
      let c = this.createSingleText(text)
      let style = c.getStyle()
      const {marginTop = 0} = style
      y += marginTop
      c.setXY(x, y)
      c.addEffect(this.getStartAniName(), this.time, curTime)
      curTime += this.duration
      curTime += this.time
      renderText.push(c)
      lastText = c
    }
    // add  to render
    if (stopTime > 0) {
      lastText.addEffect(stopEffect, this.time, curTime + stopTime)
    }
    forEach(renderText, text => this.addChild(text));
  }

  createSingleText(text) {
    if(this.conf.textStyle["wordWrapWidth"] === undefined) {
      let wh = this.getWH()
      this.conf.textStyle["wordWrapWidth"] = wh[0]
      this.conf.textStyle["width"] = wh[0]
    }
    return new FFText({
      text: text,
      fontSize: this.conf.fontSize,
      color: this.conf.color,
      style: this.conf.textStyle,
    })
  }

  createOriginalText(text) {
    let textStyle = {...this.conf.textStyle}
    if(this.conf.textStyle["wordWrapWidth"] === undefined) {
      let wh = super.getWH()
      textStyle["wordWrapWidth"] = wh[0]
    }
    return new FFText({
      text: text,
      fontSize: this.conf.fontSize,
      color: this.conf.color,
      style: textStyle,
    })
  }

  getWH() {
    let w = super.getWH()[0]
    let h = 0
    for (const text of this.list) {
      let c = this.createOriginalText(text)
      let textWH = c.getWH()
      if(textWH[1]>h){
        h = textWH[1]
      }
    }

    return [w,h]
  }
}

module.exports = FFSingPageTextList
