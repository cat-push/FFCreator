const textlist = require('@/node/textlist');


describe('node/textlist', () => {
  test("marginTop: should add to y", () => {
    let tl = new textlist({

      list: [
        "test"
      ],
      style: {
        marginTop: 50,
      },
      x: 0,
      y: 0,
      height: 500,
      startEffect: "null",
    });
    tl.startHook()
    expect(tl.children.length).toEqual(1)
    expect(tl.children[0].getY()).toEqual(50)

  })

  test("pagenum: should 1 page", () => {
    let tl = new textlist({

      list: [
        "test",
        "test2",
        "test3"
      ],
      style: {
        lineHeight: 50,
      },
      x: 0,
      y: 0,
      height: 100,
      //width:200,
      page: 1,
      startEffect: "null",
    });
    tl.startHook()
    expect(tl.children.length).toEqual(2)

  })

  test("start effect: start effect shoule have delay", () => {
    let tl = new textlist({

      list: [
        "test",
      ],
      style: {
        lineHeight: 50,
      },
      x: 0,
      y: 0,
      height: 500,
      delay: 5,

    });
    tl.startHook()
    let target = tl.children[0]
    // start and stop
    expect(target.animations.list.length).toEqual(1)
    let startEffect = target.animations.list[0]
    expect(startEffect.delay).toEqual(5000)
  })

  test("get remain text: remain should are null", () => {
    let tl = new textlist({

      list: [],
      style: {
        lineHeight: 50,
      },
      x: 0,
      y: 0,
      height: 200,
      delay: 5,
    });
    let text = "test\r\ntest\r\ntest\r\ntest\r\ntest"
    let t = tl.getMaxHeightText(text, 200)
    expect(t.remainText).toEqual("")
    expect(t.text).toEqual(text)

    let text2 = "test\r\ntest\r\ntest\r\ntest\r\ntest\r\ntest"
    t = tl.getMaxHeightText(text2, 200)
    expect(t.remainText).toEqual("test")
    expect(t.text).toEqual(text)
  })

})
