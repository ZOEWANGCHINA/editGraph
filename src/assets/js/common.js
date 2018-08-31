/**
 * 设置节点默认配置项数据
 * @param  cfg  配置项数据
 */
function defaultConfig (cfg){
  cfg.size[0] = parseInt(cfg.size[0]); // 宽
  cfg.size[1] = parseInt(cfg.size[1]); // 高
  cfg.x = parseInt(cfg.x);  // x 坐标
  cfg.y = parseInt(cfg.y);  // y 坐标

  /* 图片不具备以下属性 */
  if(cfg.shape != 'customImage'){
    cfg.fillColor = cfg.model.fillColor || 'rgba(190, 190, 190, 1)'; // 填充颜色
    cfg.strColor = cfg.model.strColor || 'rgba(145, 145, 145, 1)'; // 边框颜色 || 字体描边
    cfg.lineWidth = cfg.model.lineWidth || 1; // 边框厚度
    cfg.nodeRadius = cfg.model.nodeRadius || 0; // 边框弧度
  }
  cfg.nodeRotate = cfg.model.nodeRotate || 0 ; // 旋转角度
  cfg.title = cfg.model.title || ''; //节点名称
  /* label 属性 */
  if(cfg.shape === 'customText'){
    cfg.label = cfg.model.label || '文本'; //label默认字显示文本
    cfg.textAlign = cfg.model.textAlign || 'center';  // label 水平居中
    cfg.textBaseline  = cfg.model.textBaseline || 'middle'; // label 垂直对齐
    cfg.color = cfg.color || 'rgba(0, 0, 0, 1)'; // label字体颜色
    cfg.fontSize = cfg.model.fontSize || 14; // 字体大小
    cfg.fontWeight = cfg.model.fontWeight || 100; // 字体粗细
  }
  /* 扇形属性 */
  if(cfg.shape === 'customFan'){
    cfg.size[1] = 0; // 高
    cfg.endAngle = cfg.model.endAngle || 0.15; // 扇形默认结束角
    cfg.startAngle = cfg.model.startAngle ||  0; // 扇形默认开始角
    cfg.rs = cfg.model.rs || 0; // 扇形默认半径的内半径
  }
  /* 三角形属性 */
  if(cfg.shape === 'customTriangle'){
    cfg.size[1] = 0; // 高
    cfg.TriPoints = cfg.model.TriPoints || [ // 三角形默认点位置
        [cfg.x, cfg.y],
        [-(cfg.size[0]/2) + cfg.x, (cfg.size[0]/2) + cfg.y],
        [(cfg.size[0]/2) + cfg.x, (cfg.size[0]/2) + cfg.y]
      ];
  }
  /* 图片属性 */
  if (cfg.shape === 'customImage'){
    cfg.img = cfg.model.img || 'https://zos.alipayobjects.com/rmsportal/FDWrsEmamcNvtEf.png';  //设置默认图片源
  }
}
/**
 * 过滤shape字符
 * @param (shape) 形状
 */
function formatShape(shape){
  let s = shape.slice(6);
  if(s == 'Circle'){
    s = 'ellipse';
  }else if(s == 'Triangle'){
    s = 'polygon';
  }
  return s.toLowerCase();
}

/**
 * 节点形状判断
 * @param shape 形状
 * @param cfg   配置项
 * @param group 图组
 */
function judgeShape(shape,cfg,group){
  let box = group.getBBox();
  switch (shape){
    case 'rect':
      group.addShape('rect', {
        attrs: {
          x: cfg.x,
          y: cfg.y,
          width: cfg.size[0],
          height:cfg.size[1],
          fill: cfg.fillColor,
          stroke:cfg.strColor,
          lineWidth:cfg.lineWidth,
          rotate:cfg.nodeRotate,
          radius: cfg.nodeRadius
        }
      });
      break;
    case 'ellipse' :
      group.addShape('ellipse', {
        attrs: {
          x: cfg.x,
          y: cfg.y,
          rx: cfg.size[0]/2, //矩形内切椭圆的 长短半径 是矩形宽高的一半
          ry: cfg.size[1]/2,
          lineWidth:cfg.lineWidth,
          fill: cfg.fillColor,
          stroke: cfg.strColor,
          rotate:cfg.nodeRotate,
        }
      });
      break;
    case 'fan':
      group.addShape('fan', {
        attrs: {
          x: cfg.x,
          y: cfg.y,
          rs: cfg.rs,
          re: cfg.size[0]/2,
          startAngle:cfg.startAngle *Math.PI,
          endAngle: cfg.endAngle *Math.PI,
          stroke:cfg.strColor,
          fill:cfg.fillColor,
          lineWidth: cfg.lineWidth,
          rotate:cfg.nodeRotate
        }
      });
      break;
    case 'polygon':
      group.addShape('polygon', {
        attrs: {
          points: [
            [cfg.x, cfg.y],
            [-(cfg.size[0]/2) + cfg.x, (cfg.size[0]/2) + cfg.y],
            [(cfg.size[0]/2) + cfg.x, (cfg.size[0]/2) + cfg.y],
          ],
          x:cfg.x,
          y:cfg.y,
          fill:cfg.fillColor,
          stroke:cfg.strColor,
          lineWidth:cfg.lineWidth,
          rotate:cfg.nodeRotate
        }
      });
      break;
    case 'text':
      group.addShape('text',{
        attrs:{
          x:cfg.x + cfg.size[0]/2,
          y:cfg.y + cfg.size[1],
          text:cfg.label,
          textAlign:cfg.textAlign,
          textBaseline:cfg.textBaseline,
          fill:cfg.color,
          fontSize:cfg.fontSize,
          fontWeight:cfg.fontWeight,
          rotate:cfg.nodeRotate,
        }
      });
      break;
    case 'image' :
      group.addShape('image', {
        attrs: {
          x: cfg.x,
          y: cfg.y,
          width:cfg.size[0],
          height:cfg.size[1],
          img: cfg.img,
          rotate:cfg.nodeRotate,
        }
      });
      break;
    default:
      group.addShape("rect", {
        attrs: {
          x: cfg.x,
          y: cfg.y,
          width: box.width,
          height: box.height,
          rotate:box.nodeRotate
        }
      });
  }
}


/**
 * 键盘事件
 * @param i    当前索引
 * @param num  删除条数
 * @param data 待操作数据
 */
function keyboard(i,num,data){
  document.onkeydown=function(e){
    e=e||window.event;
    switch(e.keyCode){
      case 46:
        data.splice(i, num);
        break;//46 删除
    }
  };
}

export {
  defaultConfig,
  formatShape,
  judgeShape,
  keyboard,
};

