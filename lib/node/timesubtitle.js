const FFNode = require("./node");
const {ProxyObj, Text, TextMetrics} = require("inkpaint");
const DateUtil = require("../utils/date");
const FFLogger = require('../utils/logger');
const Materials = require("../utils/materials");
const TimelineUpdate = require("../timeline/update");
const forEach = require("lodash/forEach");

class FFTimeSubtitle extends FFNode {
  constructor(conf) {
    super({ type: 'timesubtitle', ...conf });
    const { startTime, data = [] ,textStyle = {}} = conf;
    this.setStartTime(startTime)
    if(data.length === 0){
      FFLogger.error("data  length is 0");
    }

    this.setDefaultStyle()
    this.setStyle(textStyle)
    this.time = 0;
    this.index = 0;
    this.data = data;
    this.textList = []
    this.materials = new Materials();
  }

  setDefaultStyle() {
    const padding = 10;
    const { color = '#ffffff', backgroundColor = '#00219c' } = this.conf;
    this.setStyle({ color, padding, backgroundColor, alpha: 0 });
  }

  /**
   * Set text style by object
   * @param {object} style - style by object
   * @public
   */
  setStyle(style) {
    this.display.updateStyle(style);
  }

  /**
   * Create display object.
   * @private
   */
  createDisplay() {
    const { fontSize = 20 } = this.conf;
    this.display = new ProxyObj();
    this.setStyle({ fontSize, alpha: 0 });
  }


  setStartTime(startTime = 0) {
    startTime = startTime || 0;
    startTime = DateUtil.toMilliseconds(startTime);
    this.startTime = startTime;
  }

  substituteText() {
    const proxyObj = this.display;
    this.display = new Text();
    this.display.substitute(proxyObj);
  }

  addTimelineCallback() {
    this.drawing = this.drawing.bind(this);
    TimelineUpdate.addFrameCallback(this.drawing);
  }

  drawing(time, delta) {
    this.time += delta;
    if (this.time < this.startTime) return;

    this.index++;
    if (this.time >= this.endTime) {
      this.display.text = '';
      this.setStyle({ alpha: 0 });
      return;
    }

    forEach(this.textList, textObj => {
      const { startTime, endTime, text, draw } = textObj;
      if (this.time >= startTime && this.time <= endTime && !draw) {
        this.updateText(text)
        textObj.draw = true;
        this.setStyle({ alpha: 1 });
      }
    });
  }

  updateText(text){
    this.display.text = text
    let testText = this.display
    const { align }=this.conf
    if(align === "center"){
      let globalWidth = this.rootConf("width")
      let metrics = TextMetrics.measureText(
        testText._text,
        testText._style,
        testText._style.wordWrap,
        testText.canvas
      )
      this.display.x = globalWidth/2 - metrics.width/2
    }
  }


  processData() {
    if(this.data.length === 0){
      return;
    }

    let endText = this.data[this.data.length - 1];
    const { EndTime } = endText;
    this.endTime = EndTime;
    for (const t of this.data) {
      const { Text, BeginTime, EndTime } = t;

      this.textList.push({text:Text,startTime:BeginTime,endTime:EndTime});
    }
  }

  start() {
    this.substituteText()
    super.start();
    this.processData()
    this.addTimelineCallback();
  }

  getWH() {
    const { textStyle = {}} = this.conf;
    if(textStyle.width){
      return [textStyle.width,this.height]
    }
    return super.getWH();
  }

}

module.exports = FFTimeSubtitle
