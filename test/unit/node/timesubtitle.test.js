const FFTimeSubtitle = require("@/node/timesubtitle");
describe("node/time subtitle",()=>{
  test("will set end time",()=>{
    const node = new FFTimeSubtitle({
      data:[
        {
          "EndTime": 1000,
          "SilenceDuration": 2,
          "BeginTime": 0,
          "Text": "thank you for joining us for today's spotlight. i'm liz wade and i'm joshua leo. ",
          "ChannelId": 0,
          "SpeechRate": 115,
          "EmotionValue": 6.8
        }
        ]
    });
    node.processData()
    expect(node.endTime).toEqual(1000);
  })
})
