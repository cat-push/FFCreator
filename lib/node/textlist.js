const FFNode = require('./node');
const FFText = require('./text');
const FFLogger = require('../utils/logger');
const { Container } = require('inkpaint');
const forEach = require('lodash/forEach');

class FFTextlist extends FFNode {
    constructor(conf) {
        super({ type: 'textlist', ...conf });
        if (!conf.height)
            FFLogger.error({ pos: 'FFTextList', error: 'This component must enter the height!' });

        this.children = [];
        this.saveText = []
        this.list = conf.list;
        this.page = conf.page

        this.setDuration(conf.duration);
        this.setTransition(conf.transition);
        this.setTransTime(conf.time || conf.transTime);
        // this.setDefaultStyle()
    }


    setText(list){
        this.list = list
    }

    setMaxPage(num){
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
        const { color = '#ffffff', backgroundColor = '#00219c' } = this.conf;
        this.setStyle({ color, padding, backgroundColor, alpha: 0 });
    }


    setTransTime(time = 1) {
        this.time = time;
    }

    createAniNames() {
        const { startEffect = "fadeInDown" } = this.conf
        return startEffect
    }

    createSingleText(text) {
        const t = new FFText({
            text: text,
            fontSize: this.conf.fontSize,
            color: this.conf.color,
            style: this.conf.style,
        })
        this.saveText.push(t)
    }

    createEffectAndStart() {
        let curX = 0
        let curY = 0
        let { delay  = 0, pageTime = 3, pageEffect = "fadingOut", stopTime = -1, stopEffect = "fadingOut" }  = this.conf
        let curTime = delay
        let thisWh = this.getWH()
        let curPageNum = 1
        let curPage = []
        let renderText = []
        for (const c of this.saveText) {
            let x = curX
            let y = curY
            let wh = c.getWH()
            // 如果超出这一页

            let style = c.getStyle()

            const { marginTop = 0, marginLeft = 0 } = style
            y += marginTop
            if(x === 0){
              x += marginLeft
            }

            if (y + wh[1] > thisWh[1]) {
                // if over pageNum, add stop effect and break
                if(curPageNum >= this.page ){
                    break
                }

                for (const t of curPage) {
                    t.addEffect(pageEffect, this.time, curTime-this.duration+pageTime+this.time)
                }
                curTime += pageTime
                curTime += this.time
                curPage = []
                curPageNum += 1
                y = 0
                y += marginTop
            }


            c.conf.x = x
            c.conf.y = y
            c.setXY(x, y)

            c.addEffect(this.createAniNames(), this.time, curTime)
            curTime += this.duration
            curPage.push(c)
            renderText.push(c)

            curY = y + wh[1]
        }
        // add  to render
        if(stopTime>0){
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
        forEach(this.list, text => this.createSingleText(text));
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
