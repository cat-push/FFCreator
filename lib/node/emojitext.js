const fontkit = require('fontkit');
const {Texture} = require("inkpaint");
const emojiRegex = require('emoji-regex');
const {FFText, FFLogger, FFImage} = require("../index");
const FFContainer = require("./container");


class FFEmojiText extends FFContainer {
  constructor(
    conf
  ) {
    super({ type: 'emojitext', ...conf });
    this.fontpath = conf.fontpath
    this.textwh = []
    this.text = conf.text;
  }

  hasEmoji(){
    return this.text.match(emojiRegex())
  }

  isMultiLine(){
    const { breakWords = false } = this.conf.style;
    return breakWords || this.text.indexOf("\n") > -1
  }

  setFontPath(fontpath){
    this.fontpath = fontpath
  }

  setText(text){
    this.text = text
  }


  copyText(text){
    const t = new FFText(this.conf)
    t.setText(text)
    return t
  }


  getStyle() {
    return this.conf.style;
  }

  setStle(style){
    // Merge style  objects
    this.conf.style = {...this.conf.style, ...style}
  }


  parserEmoji(text){
    const regex = emojiRegex();
    let data_list = [];
    let least_end = 0;

    let match;
    while ((match = regex.exec(text))) {
      const emoji = match[0];
      const index = match.index;

      if (least_end !== index) {
        data_list.push({
          type: 'text',
          text: text.slice(least_end, index)
        });
      }

      let text_data = {
        text: emoji
      };
      text_data.type = 'emoji';
      text_data.emoji = emoji;
      least_end = index + ([...emoji].length * 2);
      data_list.push(text_data);
    }
    if (least_end !== text.length) {
      data_list.push({
        type: 'text',
        text: text.slice(least_end, text.length)
      });
    }
    return data_list
  }


  createEmoji(text,size){
    let image = this.font.layout(text).glyphs[0].getImageForSize(size);
    let texture = Texture.fromImage(image.data);
    return new FFImage({
      image: texture,
      width: size,
      height: size,
      resetXY: true,
    })
  }

  createSingleLineNode(textlist){
    let charWidth = this.textwh[0]
    for (const data of textlist) {
      if(data.type === "text"){
        const t = this.copyText(data.text)
        this.addChild(t)
      }else {
        let imageSize = this.textwh[1]
        let image_node = this.createEmoji(data.text,imageSize)
        this.addChild(image_node)
      }
    }
  }

  createMultiLineNode(textlist){
    let charWidth = this.textwh[0]/2
    let lineWidth = this.getStyle().wordWrapWidth
    let remainWidth = lineWidth
    for (const data of textlist) {
      if(data.type === "text"){
        let remain = data.text
        while (remain !== "") {
          const { text = "", remainText = "", remainTextWidth= 0} = this.readTextbyWidth(remain, charWidth,remainWidth)
          const t = this.copyText(text)
          this.addChild(t)
          if(remainTextWidth !== 0){
            remainWidth = remainTextWidth
          }else {
            remainWidth = lineWidth
          }
          remain = remainText
        }
      }else {
        let imageSize = this.textwh[1]
        let imageWidth = imageSize
        let image_node = this.createEmoji(data.text,imageSize)
        this.addChild(image_node)
        if(imageWidth>remainWidth){
          remainWidth = lineWidth
        }else {
          remainWidth -= imageWidth
        }
      }
    }
  }

  readTextbyWidth(text, width, remainwidth){
    const reg = /[\u4e00-\u9fa5]/g // 匹配汉字

    // 默认一个汉字的宽度是一个英文的2倍
    const c = text.match(reg) || []
    const total = text.length + c.length

    let maxNum =  Math.floor(remainwidth/width)
    if(maxNum > total){
      return {
        text: text,
        remainText:"",
        remainTextWidth: remainwidth - total*width
      }
    }else {
      let curNum = 0
      let index = 0
      for (const t of text) {
        if(t.match(reg)){
          curNum += 2
        }else {
          curNum += 1
        }
        index += 1
        if(curNum>=maxNum){
          return {
            text: text.slice(0,index-1),
            remainText: text.slice(index-1),
            remainTextWidth: 0
          }
        }
      }
    }
  }



  createNode(textlist){
    let style = this.getStyle()
    let isMultLine = this.isMultiLine()
    if(!isMultLine) {
      return this.createSingleLineNode(textlist, style)
    }else {
      return this.createMultiLineNode(textlist, style)
    }

  }

  startRender(){
    let curX = 0
    let curY = 0
    let isMultLine = this.isMultiLine()
    if(!isMultLine) {
      for (const c of this.children) {
        let x = curX
        let y = curY
        let wh = c.getWH()
        curX += wh[0]
        c.setXY(x,y)
      }
    }else {
      let style = this.getStyle()
      let lineWidth = style.wordWrapWidth
      for (const c of this.children) {
        let x = curX
        let y = curY
        let wh = c.getWH()
        if(x + wh[0] > lineWidth){
          x = 0
          y += wh[1]
          curX = wh[0]
          curY += wh[1]
        }else {
          curX += wh[0]
        }
        c.setXY(x,y)
      }
    }
  }

  metricsTextWH(){
    let testText = new FFText(this.conf);
    testText.setText("好")
    const measured = testText.metrics()
    this.textwh =  [measured.width,measured.height]
  }

  getFontPath(){
    if(this.fontpath){
      return this.fontpath
    }
    return this.rootConf('emojiFont');
  }

  renderText(){
    try {
      this.font = fontkit.openSync(this.getFontPath()).fonts[0]
    }catch (e) {
      FFLogger.error({ pos: 'FFEmojiTxet', error: e });
      return
    }
    this.metricsTextWH()
    let data_list = this.parserEmoji(this.text);

    this.createNode(data_list)
    this.startRender()
  }

  start() {
    if(this.hasEmoji() === null){
      const text = new FFText(this.conf)
      text.setXY(0,0)
      this.addChild(text)
    }else {
      this.renderText()
    }
    super.start();
  }
}

module.exports = FFEmojiText
