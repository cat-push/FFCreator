'use strict';

/*!
 * FFCreator - a lightweight and flexible short video production library
 * Copyright(c) TNFE Team
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */

require('./polyfill/polyfill')();

const echarts = require('echarts');
const FFCreator = require('./creator');
const FFNode = require('./node/node');
const FFRect = require('./node/rect');
const FFText = require('./node/text');
const FFImage = require('./node/image');
const FFChart = require('./node/chart');
const FFVideo = require('./node/video');
const FFScene = require('./node/scene');
const FFAlbum = require('./node/album');
const FFExtras = require('./node/extras');
const FFGifImage = require('./node/gif');
const FFVtuber = require('./node/vtuber');
const FFSubtitle = require('./node/subtitle');
const FFVideoAlbum = require('./node/videos');
const FFAudio = require('./audio/audio');
const FFCon = require('./node/cons')
const FFDiv = require('./node/div')
const FFTextlist = require('./node/textlist')
const FFEmojiText = require('./node/emojitext')
const FFSingPageTextList = require('./node/singtextlist')
const FFTimeSubTitle = require('./node/timesubtitle')
const FFTween = require('./animate/tween');
const FFLogger = require('./utils/logger');
const FFCreatorCenter = require('./center/center');

module.exports = {
  echarts,
  FFCreator,
  FFNode,
  FFRect,
  FFText,
  FFImage,
  FFVideo,
  FFScene,
  FFChart,
  FFAudio,
  FFAlbum,
  FFExtras,
  FFGifImage,
  FFVtuber,
  FFSubtitle,
  FFVideoAlbum,
  FFCon,
  FFDiv,
  FFTextlist,
  FFEmojiText,
  FFSingPageTextList,
  FFTimeSubTitle,
  FFTween,
  FFLogger,
  FFCreatorCenter,
};
