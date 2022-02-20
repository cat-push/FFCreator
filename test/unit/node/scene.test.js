const FFText = require('@/node/text');
const FFScene  = require('@/node/scene');
describe("node/secne",() => {
test("should auto set stop time ",() => {

  let scene = new FFScene(
    {

    }
  )
  let text = new FFText()


  text.addEffect("null",1, 19)

  scene.addChild(text)

  scene.startHook()

  expect(scene.duration).toEqual(20)
})

  test("auto set shoule can set min time", ()=>{
    let scene = new FFScene(
      {
        duration:10
      }
    )
    let text = new FFText()


    text.addEffect("null",1, 0)

    scene.addChild(text)

    scene.startHook()

    expect(scene.duration).toEqual(10)
  })
})
