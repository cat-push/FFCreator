'use strict';

const FFScene = require("./lib/node/scene");
const FFCreator = require("./lib/creator");
const {FFTextlist, FFText, FFVideo, FFDiv, FFImage, FFTimeSubTitle} = require("./lib");


FFCreator.setFFmpegPath('ffmpeg');
FFCreator.setFFprobePath('fprobe');
const creator = new FFCreator({
  cacheDir: './cache', // 缓存目录
  outputDir: './out', // 输出目录
  output: './test.mp4', // 输出文件名(FFCreatorCenter中可以不设)
  width: 720, // 影片宽
  height: 1080, // 影片高
  fps: 24, // fps
  debug: true, // 开启测试模式
  defaultOutputOptions: true,
  cacheFormat:"png",
  log:true
});


 const scene  =  new FFScene();
 const bgVideo = new FFVideo({
   path: './test2.mp4',
   width: 720,
   height: 1080,
   resetXY: true,
   x: 0 ,
   y: 0,
 });
 bgVideo.setAudio(false);

 scene.addChild(bgVideo);
 const subtitle = new FFTimeSubTitle({
    textStyle: {
      breakWords: true,
      wordWrap: true,
      fontFamily: '微软雅黑',
      fontWeight: 'bold',
      lineHeight: 52,
      backgroundColor: 'rgba(12,0,0,0.5)',
      align: 'center',
      opacity: 1,
      padding: 10,
      fill:true,
      wordWrapWidth:500
    },
   x: 200,
   y: 500,
   data:[
     {
       "EndTime": 5330,
       "SilenceDuration": 2,
       "BeginTime": 2940,
       "Text": "thank you for joining us for today's spotlight. i'm liz wade and i'm joshua leo. ",
       "ChannelId": 0,
       "SpeechRate": 115,
       "EmotionValue": 6.8
     },
     {
       "EndTime": 8880,
       "SilenceDuration": 0,
       "BeginTime": 5660,
       "Text": "spotlight uses a special english method of broadcasting. it is easier for people to understand, no matter where in the world they live. ",
       "ChannelId": 0,
       "SpeechRate": 112,
       "EmotionValue": 6.6
     },
     {
       "EndTime": 31670,
       "SilenceDuration": 5,
       "BeginTime": 30780,
       "Text": "yes. ",
       "ChannelId": 0,
       "SpeechRate": 67,
       "EmotionValue": 5.9
     },
     {
       "EndTime": 47890,
       "SilenceDuration": 4,
       "BeginTime": 36120,
       "Text": "in nineteen forty two, during world war two, a young jewish girl went into hiding with her family. ",
       "ChannelId": 0,
       "SpeechRate": 91,
       "EmotionValue": 6.8
     },
     {
       "EndTime": 55300,
       "SilenceDuration": 0,
       "BeginTime": 48850,
       "Text": "they hid in a secret room built especially for them. ",
       "ChannelId": 0,
       "SpeechRate": 93,
       "EmotionValue": 6.7
     },
     {
       "EndTime": 62540,
       "SilenceDuration": 0,
       "BeginTime": 56020,
       "Text": "it was above a dutch business in the city of amsterdam. ",
       "ChannelId": 0,
       "SpeechRate": 101,
       "EmotionValue": 6.7
     },
   ]
 });
 scene.addChild(subtitle)
creator.addChild(scene);
creator.start();
creator.on('start', () => {
  console.log('FFCreator start');
});
creator.on('error', e => {
  console.log(`FFCreator error: ${e}`);
});
creator.on('progress', (e) => {
  console.log(`FFCreator progress: ${(e.percent * 100) >> 0}%`);
});
creator.on('complete', e => {
  console.log(
    `FFCreator completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `
  );
});







