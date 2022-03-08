const textlist = require('@/node/singtextlist');

describe("node/singtextlist",()=>{
  test("createOriginalText should use list width as  text max width",() => {
    const list = new textlist({
      resetXY: true,
      textStyle: {
        breakWords: true,
        wordWrap: true,
        fontFamily: '微软雅黑',
        fontWeight: 'bold',
        lineHeight: 50,
      },
      width: 200,
      fontSize: 50,
      height: 100,
    });
    let text = list.createOriginalText("test test test test test test")
    let wh = text.getWH()
    expect(200).toBeGreaterThanOrEqual(wh[0]);


  })

  test("all text width should and config width equal",()=>{
    let data =  [
      '3things that can skil change you life in 1year',
      'number1 pick one skil you want to cultibvate and put all you effort into developing that',
    ]
    const list = new textlist({
      resetXY: true,
      textStyle: {
        breakWords: true,
        wordWrap: true,
        fontFamily: '微软雅黑',
        fontWeight: 'bold',
        lineHeight: 50,
      },
      list: data,
      width: 200,
      fontSize: 50,
      height: 100,
    });
    let wh = list.getWH()
    let text2 = list.createSingleText(data[0])
    let text3 = list.createSingleText(data[1])
    expect(wh[0]).toEqual(text2.conf.style.width)
    expect(wh[0]).toEqual(text3.conf.style.width)
  })

})
