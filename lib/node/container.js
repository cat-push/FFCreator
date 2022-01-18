const FFNode = require("./node");
const {Container, ProxyObj} = require("inkpaint");
const Utils = require("../utils/utils");
const forEach = require("lodash/forEach");


class FFContainer extends FFNode {
  constructor(conf) {
    super({type: 'container', ...conf});
    const {width = 0, height = 0} = this.conf;
    this.children = [];
    this.setWH(width, height)
  }


  startHook() {

    this.children.forEach(child => {
      child.startHook();
    });
    super.startHook();
  }

  /**
   * Create display object
   * @private
   */
  createDisplay() {
    this.display = new Container();
  }

  start() {
    forEach(this.children, child => child.start());
    super.start()
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

  /**
   * Remove child elements
   * @param {FFNode} child - node object
   * @public
   */
  removeChild(child) {
    child.parent = null;
    this.display.removeChild(child.display);
    Utils.deleteArrayElement(this.children, child);
  }

  /**
   * Clear all child elements and add unique elements
   * @param {FFNode} children - any node object
   * @public
   */
  addOnlyDisplayChild(...children) {
    this.removeAllDisplayChildren();
    forEach(children, child => this.display.addChild(child.display));
  }

  showOnlyDisplayChild(scene) {
    forEach(this.display.children, child => {
      child.visible = false;
      scene.display.visible = true;
    });
  }

  removeAllDisplayChildren() {
    const { display } = this;
    for (let i = display.children.length - 1; i >= 0; i--) {
      const child = display.children[i];
      if (child instanceof ProxyObj) continue;

      display.removeChild(display.children[i]);
    }
  }

  addDisplayChild(child) {
    this.display.addChild(child.display);
  }

  removeDisplayChild(child) {
    this.display.removeChild(child.display);
  }

  destroy() {
    forEach(this.children, child => child.destroy());
    this.removeAllDisplayChildren();
    super.destroy();

    this.children.length = 0;
    this.children = null;
    this.display = null;
  }
}

module.exports = FFContainer
