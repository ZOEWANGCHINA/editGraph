import G6 from '@antv/g6';
var Util = G6.Util;
/**
 * 添加水波
 * @param {number} x           中心x
 * @param {number} y           中心y
 * @param {number} level       水位等级 0～1
 * @param {number} waveCount   水波数
 * @param {number} colors      色值
 * @param {number} group       图组
 * @param {number} clip        用于剪切的图形
 */
const addWaterWave = function(x, y, level, waveCount, colors, group, clip){
  var wave;
  var bbox = clip.getBBox();
  var width = bbox.maxX - bbox.minX;
  var height = bbox.maxY - bbox.minY;
  var duration = 2800;
  var delayDiff = 300;
  var minorWaveDiff = 10;

  for (var i = 0; i < waveCount; i++) {
    wave = group.addShape('path', {
      attrs: {
        path: Util.getWaterPath(
          width/2,
          (y+height/2) - height * level + i*minorWaveDiff,
          50, 0, 2, x, y
        ),
        fill: colors[i],
        clip: clip
      }
    });
    wave.animate({
      transform: [
        ['t', width/2, 0]
      ],
      repeat: true
    }, duration - i * delayDiff);
  }
}

export default addWaterWave;

