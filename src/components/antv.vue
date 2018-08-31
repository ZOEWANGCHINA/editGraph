<template>
  <div id="c1" >
    <div class="timing">{{currentTime}}</div>
  </div>
</template>

<script>
  import G6 from '@antv/g6';
  import addWaterWave  from  '../assets/js/wave';
  export default {
    name:'antv',
    data () {
      return {
        currentTime:10,
        "nodes": [
        {
          "shape": "http://www.wangqiaoli.com/antv/img/tower2.png",
          "label": "事故水塔",
          "id": "事故水塔",
          "x": 200,
          "y": 480,
          "size": [
            100,
            210
          ]
        },
        {
          "shape": "normal",
          "id": "酸洗机组",
          "label": "酸洗机组",
          "x": 350,
          "y": 370
        },
        {
          "shape": "normal",
          "id": "精整机组",
          "label": "精整机组",
          "x": 350,
          "y": 450
        },
        {
          "shape": "normal",
          "id": "水闸开关",
          "label":"水闸开关",
          "status": "开启",
          "x": 700,
          "y": 550
        },
        {
          "shape": "initial",
          "id": "至排水管道",
          "label": "至排水管道",
          "x": 200,
          "y": 700
        },
        {
          "shape": "waterTank",
          "id": "消防水池",
          "label": "消防水池",
          "val": 52,
          "x": 550,
          "y": 450
        },
        {
          "shape": "waterTank",
          "id": "吸水井",
          "label": "吸水井",
          "val": 21,
          "x": 550,
          "y": 650
        },
        {
          "shape": "normal",
          "id": "平整机组",
          "label": "平整机组",
          "x": 350,
          "y": 600
        },
        {
          "shape": "normal",
          "id": "轧机机组",
          "label": "轧机机组",
          "x": 350,
          "y": 530
        }
      ],
        "edges": [
        {
          "shape": "HVH",
          "source": "事故水塔",
          "id": "0f25fa8e",
          "target": "酸洗机组"
        },
        {
          "shape": "HVH",
          "source": "事故水塔",
          "id": "0f25fa8a",
          "target": "平整机组"
        },
        {
          "shape": "HVH",
          "source": "事故水塔",
          "id": "0f25fa8b",
          "target": "轧机机组"
        },
        {
          "shape": "HVH",
          "source": "事故水塔",
          "id": "0f25fa8c",
          "target": "精整机组"
        },
        {
          "shape": "HVH",
          "source": "酸洗机组",
          "id": "7cbab3c3",
          "target": "消防水池"
        },
        {
          "shape": "HVH",
          "source": "精整机组",
          "id": "873dfeb9",
          "target": "消防水池"
        },
        {
          "shape": "HVH",
          "source": "轧机机组",
          "id": "c069bb9e",
          "target": "消防水池"
        },
        {
          "shape": "HVH",
          "source": "平整机组",
          "id": "76768a8d",
          "target": "消防水池"
        },
        {
          "shape": "HVH",
          "source": "消防水池",
          "id": "ae6ea322",
          "target": "水闸开关"
        },
        {
          "shape": "HVH",
          "source": "水闸开关",
          "id": "ae6ea32q",
          "target": "吸水井"
        },
        {
          "shape": "HVH",
          "source": "吸水井",
          "id": "ae6ea327",
          "target": "至排水管道"
        }
      ],
      statusStore:''
      }
    },
    computed:{
    },
    mounted(){
      G6.Global.nodeLabelStyle = {
        fill: '#fff',
        textAlign: 'center',
        textBaseline: 'middle',
        fontSize: 12
      };
      var Util = G6.Util;
      // 普通节点
      G6.registNode('normal', {
        afterDraw: function(cfg, group) {
          var originData = cfg.model;
          group.addShape('text', {
            attrs: {
              x: cfg.x,
              y: cfg.y - 20,
              text: originData.status,
              textAlign: 'center',
              fill: '#CCCCCD'
            }
          });
        }
      });
      // 起始终止节点
      G6.registNode('initial', {
        afterDraw: function(cfg, group) {
          var originData = cfg.model;
          group.addShape('text', {
            attrs: {
              x: cfg.x,
              y: cfg.y - 20,
              // text: originData.id,
              // textAlign: 'center',
              fill: '#40BCF3'
            }
          });
        }
      }, 'circle');
      //水池节点
      G6.registNode('waterTank', {
        draw: function(cfg, group){
          var width = 150;
          var height = 100;
          var labelMarginTop = 10;
          var shape = group.addShape('rect', {
            attrs: {
              x: cfg.x-width/2,
              y: cfg.y-height/2,
              width: width,
              height: height,
              stroke: '#d9d9d9',
              lineDash: [5,5]
            }
          });
          addWaterWave(cfg.x, cfg.y, cfg.size, 3, ['#7caff7', '#5491e8', '#3373ce'], group, shape);
          group.addShape('text', {
            attrs: {
              x: cfg.x,
              y: cfg.y + height/2 + labelMarginTop,
              text: cfg.label + '蓄水量：'+ cfg.model.val  + '%',
              textAlign: 'center',
              textBaseline: 'top',
              fill: '#CCCCCD'
            }
          });
          return shape;
        },
        //设置锚点
        getAnchorPoints: function(){
          return [
            [1, 0.5], // 右边边的中点
            [0, 0.5] // 左边边的中点
          ];
        }
      });
      //带动画HVH折线
      G6.registEdge('HVH', {
        afterDraw(cfg, group, keyShape) {
          var shape;
          var points = cfg.points;
          var speed = 0.1; // 0.1 像素每毫秒
          var totalLength = 0;
          var p2;
          Util.each(points, function(p1, i){
            p2 = points[i+1];
            if(p2){
              totalLength += Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
            }
          });
          shape= keyShape;
          const center = shape.getPoint(1);
          const colors = shape.__attrs.color;
          var tinyPoint =group.addShape('circle', {
            attrs: {
              x: center.x,
              y: center.y,
              r: 2.5,
              fill: colors
            }
          });
          tinyPoint.animate({
            onUpdate: function(frame, ratio){
              var p = shape.getPoint(ratio);
              frame.attrs.x = p.x;
              frame.attrs.y = p.y;
            },
            repeat: true
          }, totalLength/speed);
          return shape;
        }
      });
      const net = new G6.Net({
        id: 'c1',            // 容器ID
        height: window.innerHeight - 10,         // 画布高
        fitView: 'cc', // 渲染完毕后，画布不变，将图形放置在中间
        grid: null
      });
      net.get('container').style.background = '#000';
      net.source(this.nodes, this.edges);
      net.tooltip(true);
      net.node()
        .label('label')
        .size(function(obj){
          if(obj.val){
            var domain = 100;
            return obj.val/domain;
          }else if(obj.label){
            return null
          }
          return 10
        })
        .tooltip('id*label*val')
        .style({
          stroke: '#CCCCCD'
        });
      net.edge()
        .size(5)
        .style({
          color:'#0099ff',
          stroke: "#1977fa",
          lineJoin:'round',
        });
      net.render();
//      net.on('itemmouseenter',ev => {
//        const item = ev.item;
//        if(net.isNode(item)){
//          net.removeBehaviour(['resizeNode']);
//        }
//      });
      net.on('itemmousedown', ev => {
        const item = ev.item;
        //获取相关的边
        if(net.isNode(item)){
          const edges = item.getEdges();
          if(ev.item.get('model').id =='水闸开关'){
            if(ev.item.get('model').status =="开启"){
              net.update(item, {
                status :"关闭"
              });
              //更新相关的边
              Util.each(edges, edge => {
                net.update(edge, {
                  style:{stroke: "gray",lineJoin:'round'},
                });
              });
            }else{
              net.update(item, {
                status :"开启"
              });
              //更新相关的边
              Util.each(edges, edge => {
                net.update(edge, {
                  style:{stroke: "#1977fa",lineJoin:'round', color:'#0099ff'},
                });
              });
            }
          }
        }
        net.refresh();
      });
    },
    methods:{
      timer(val){
        let interval = window.setInterval(function() {
          if ((val--) <= 0) {
            val = 0;
            window.clearInterval(interval);
          }
        }, 1000);
      }
    },
  }
</script>
<style>
  body{
    margin: 0;
  }
  .timing{
    color:#fff;
  }
</style>
