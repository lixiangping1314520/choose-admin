<template>
<div class="lookmap">
  <div class="lookmap_list">
    <el-table
    :data="tableData"
    style="width:100%">
    <el-table-column
      type="index"
      :index="indexMethod">
    </el-table-column>
    <el-table-column
      prop="date"
      label="建筑类型"
      >
    </el-table-column>
    <el-table-column
      prop="name"
      label="建筑楼层"
      >
    </el-table-column>
    <el-table-column
      prop="name"
      label="四个坐标点"
      >
    </el-table-column>
     <el-table-column
      prop="name"
      label="中心点"
      >
    </el-table-column>
    <el-table-column
      prop="name"
      label="地址"
      >
    </el-table-column>
    <el-table-column
      prop="name"
      label="采集类型"
      >
    </el-table-column>
     <el-table-column label="操作" width="180px">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="danger"
          @click="handleSee2D(scope.$index, scope.row)">2D查看</el-button>
           <el-button
          size="mini"
          type="danger"
          @click="handleSee3D(scope.$index, scope.row)">3D查看</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog title="查看3D地图" :modal-append-to-body="false" :visible.sync="dialogVisible3d" width="60%" @open="dialogOpen3d">
    <el-button size="mini" type="danger" @click="navigation">模拟导航</el-button>
    <el-button size="mini" type="danger" @click="orbital">轨道</el-button>
    <div id="container" class="map"></div>
  </el-dialog>
  <el-dialog title="查看2D地图" :modal-append-to-body="false" :visible.sync="dialogVisible" width="40%" @open="dialogOpen">
      <canvas ref="hello" width="500" height="400" style="margin:0px auto;"></canvas>
  </el-dialog>
  </div>
  <div class="lookmap_paging">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
  </div>
</div>
</template>
<script>
import CanvasZoom from "../../static/js/canvas_zoom";
import { realconsole } from "@/assets/js/canvas3d";
// import THREE from "../../static/js/three";
export default {
    name: 'mapBox',
    data(){
        return{
           map:null,
          currentPage4:5,
          dialogVisible3d:false,
          imgg:require("../assets/img/timg2.jpeg"),
          img:require("../assets/img/time.png"),
          camera: null,
          scene: null,
          renderer: null,
          ctx:null,
          mesh: null,
          INTERSECTED: null,
          raycaster: null,
          mouse: null,
            tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          tag: '家'
        }],
        dialogVisible: false,
        gui:{
          amount:10,
          bevelThickness:2,
          bevelSize:1,
          bevelEnabled:true,
          bevelSegments:3,
          curveSegments:12,
          steps:1
          },
          roomw:{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              0,
              53.54030739150022
            ],
            [
              -48.515625,
              35.460669951495305
            ],
            [
              -56.953125,
              13.581920900545844
            ],
            [
              -21.09375,
              0.7031073524364909
            ],
            [
              12.3046875,
              3.8642546157214084
            ],
            [
              24.960937499999996,
              8.059229627200192
            ],
            [
              34.453125,
              16.97274101999902
            ],
            [
              36.9140625,
              31.952162238024975
            ],
            [
              31.289062500000004,
              40.713955826286046
            ],
            [
              12.3046875,
              44.08758502824516
            ],
            [
              8.0859375,
              49.83798245308484
            ],
            [
              0,
              53.54030739150022
            ]
          ]
        ]
      }
    }
  ]
},
        room:{
        "layout": "0 0,500 0,500 400,0 400",  
        "imagePath": "OCG.jp",
        "imageData": "A",
        "shapes": [
          {
            "line_color": null,
            "shape_type": "polygon",
            "points": [
              [
                68.2222222222222,
                66.29629629629629
              ],
              [
                68.96296296296296,
                134.8148148148148
              ],
              [
                118.96296296296293,
                134.44444444444443
              ],
              [
                119.33333333333331,
                66.29629629629629
              ]
            ],
            "flags": {},
            "fill_color": null,
            "label": "1803"
          },
          {
            "line_color": null,
            "shape_type": "polygon",
            "points": [
              [
                113.03703703703701,
                253.33333333333331
              ],
              [
                112.29629629629628,
                337.77777777777777
              ],
              [
                152.66666666666663,
                338.5185185185185
              ],
              [
                151.92592592592592,
                253.33333333333331
              ]
            ],
            "flags": {},
            "fill_color": null,
            "label": "会议室"
          },
          {
            "line_color": null,
            "shape_type": "polygon",
            "points": [
              [
                55.62962962962962,
                100.37037037037037
              ],
              [
                3.037037037037024,
                101.1111111111111
              ],
              [
                4.518518518518505,
                2.5925925925925926
              ],
              [
                55.25925925925924,
                1.4814814814814814
              ]
            ],
            "flags": {},
            "fill_color": null,
            "label": "1802"
          },
          {
            "line_color": null,
            "shape_type": "polygon",
            "points": [
              [
                247.48148148148147,
                60.74074074074073
              ],
              [
                246.7407407407407,
                2.222222222222222
              ],
              [
                323.037037037037,
                1.111111111111111
              ],
              [
                323.4074074074074,
                62.96296296296296
              ]
            ],
            "flags": {},
            "fill_color": null,
            "label": "1809"
          },
          {
            "line_color": null,
            "shape_type": "polygon",
            "points": [
              [
                3.7777777777777715,
                252.96296296296293
              ],
              [
                48.59259259259258,
                253.7037037037037
              ],
              [
                48.96296296296296,
                338.88888888888886
              ],
              [
                2.666666666666657,
                338.5185185185185
              ]
            ],
            "flags": {},
            "fill_color": null,
            "label": "1801"
          },
          {
            "line_color": null,
            "shape_type": "polygon",
            "points": [
              [
                223.77777777777777,
                253.33333333333331
              ],
              [
                224.51851851851848,
                338.14814814814815
              ],
              [
                322.66666666666663,
                338.88888888888886
              ],
              [
                323.4074074074074,
                256.2962962962963
              ]
            ],
            "flags": {},
            "fill_color": null,
            "label": "管理中心"
          },
          {
            "line_color": null,
            "shape_type": "polygon",
            "points": [
              [
                247.48148148148147,
                95.55555555555554
              ],
              [
                247.48148148148147,
                172.2222222222222
              ],
              [
                324.88888888888886,
                172.96296296296296
              ],
              [
                323.4074074074074,
                95.92592592592592
              ]
            ],
            "flags": {},
            "fill_color": null,
            "label": "VIP接待室"
          },
          {
            "line_color": null,
            "shape_type": "polygon",
            "points": [
              [
                160.07407407407408,
                253.7037037037037
              ],
              [
                160.07407407407408,
                338.14814814814815
              ],
              [
                214.88888888888886,
                338.88888888888886
              ],
              [
                215.62962962962962,
                254.07407407407405
              ]
            ],
            "flags": {},
            "fill_color": null,
            "label": "路演厅"
          },
          {
            "line_color": null,
            "shape_type": "polygon",
            "points": [
              [
                51.925925925925924,
                336.66666666666663
              ],
              [
                51.55555555555554,
                254.8148148148148
              ],
              [
                106.37037037037035,
                253.7037037037037
              ],
              [
                105.99999999999997,
                336.66666666666663
              ]
            ],
            "flags": {},
            "fill_color": null,
            "label": "1813"
          },
          {
            "line_color": null,
            "shape_type": "polygon",
            "points": [
              [
                60.44444444444443,
                0.37037037037037035
              ],
              [
                61.18518518518516,
                49.629629629629626
              ],
              [
                152.66666666666663,
                49.629629629629626
              ],
              [
                151.18518518518516,
                2.962962962962963
              ]
            ],
            "flags": {},
            "fill_color": null,
            "label": "1804"
          },
          {
            "line_color": null,
            "shape_type": "polygon",
            "points": [
              [
                157.85185185185185,
                48.148148148148145
              ],
              [
                157.48148148148147,
                2.5925925925925926
              ],
              [
                244.51851851851848,
                4.0740740740740735
              ],
              [
                243.77777777777777,
                48.888888888888886
              ]
            ],
            "flags": {},
            "fill_color": null,
            "label": "1807"
          },
          {
            "line_color": null,
            "shape_type": "polygon",
            "points": [
              [
                247.1111111111111,
                177.03703703703704
              ],
              [
                323.77777777777777,
                178.14814814814812
              ],
              [
                322.66666666666663,
                247.037037037037
              ],
              [
                247.85185185185185,
                245.92592592592592
              ]
            ],
            "flags": {},
            "fill_color": null,
            "label": "休息区"
          },
          {
            "line_color": null,
            "shape_type": "polygon",
            "points": [
              [
                131.9259259259259,
                65.55555555555556
              ],
              [
                132.2962962962963,
                135.92592592592592
              ],
              [
                158.59259259259255,
                134.07407407407408
              ],
              [
                157.85185185185185,
                66.66666666666666
              ]
            ],
            "flags": {},
            "fill_color": null,
            "label": "1805"
          },
          {
            "line_color": null,
            "shape_type": "polygon",
            "points": [
              [
                3.7777777777777715,
                150.0
              ],
              [
                48.96296296296296,
                151.48148148148147
              ],
              [
                48.96296296296296,
                104.07407407407406
              ],
              [
                5.259259259259238,
                104.81481481481481
              ]
            ],
            "flags": {},
            "fill_color": null,
            "label": "男厕所"
          },
          {
            "line_color": null,
            "shape_type": "polygon",
            "points": [
              [
                4.888888888888886,
                176.66666666666666
              ],
              [
                41.925925925925924,
                177.77777777777777
              ],
              [
                42.296296296296276,
                222.59259259259258
              ],
              [
                1.9259259259259238,
                220.37037037037035
              ],
               [
                10.9259259259259238,
                200.37037037037035
              ]
            ],
            "flags": {},
            "fill_color": null,
            "label": "女厕所"
          }
        ],
        "version": "3.15.2",
        "flags": {},
        "fillColor": [
          255,
          0,
          0,
          128
        ],
        "lineColor": [
          0,
          255,
          0,
          128
        ],
        "imageWidth": 326,
        "imageHeight": 342
        }
        }
    },
    mounted(){
    },
    methods:{
      render(){
      this.map.render()
      this.map.controls.update()
      requestAnimationFrame(this.render)
      },
       handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
       indexMethod(index) {
        return index * 2;
      },
       changeColor() {
      var colors = [
        "rgba(220, 169, 105, 0.2)",
        "rgba(76, 181, 216, 0.2)",
        "rgba(225, 215, 155, 0.1)",
        "rgba(230, 110, 250, 0.2)",
        "rgba(76, 181, 216, 0.2)"
      ];
      var random = this.getRandom(0, colors.length - 1);
      return colors[random];
    },
    getRandom(n, m) {
      var n = Number(n); //强制转换成数字
      var m = Number(m);
      if (isNaN(n) || isNaN(m)) {
        //判断是否为有效数字 ，其中一个不是有效数字就返回[0,1)之间的随机小数
        return math.random();
      }
      if (n > m) {
        //如果n>m则交换
        var temp = n;
        n = m;
        m = temp;
      }
      return Math.round(Math.random() * (m - n) + n);
    },
    changeData(a) {
            // var b = a.split(",");
            // console.log(b)
            String.prototype.Trim = function() {
              return this.replace(/(^\s*)|(\s*$)/g, "");
            };
            // var c = b.filter(v => {
            //   return !!v;
            // });
            var d = a.map(v => {
              // console.log(v)
              return {
                x: v[0],
                y: v[1]
              };
            });
            return d;
      },
      changeDatas(a) {
      var b = a.split(",");
      String.prototype.Trim = function() {
        return this.replace(/(^\s*)|(\s*$)/g, "");
      };
      var c = b.filter(v => {
        return !!v;
      });
      var d = c.map(v => {
        return {
          x: v.Trim().split(" ")[0],
          y: v.Trim().split(" ")[1]
        };
      });
      return d;
    },
      dialogOpen () {
        this.$nextTick(()=>{
          let canvas = this.$refs.hello;
          let ctx = canvas.getContext("2d");
          var index =this.room.layout;
          canvas.width=this.room.imageWidth;
          canvas.height=this.room.imageHeight;
          let tangram = {};
          tangram.room = {};
            tangram.room.p = this.changeDatas(index);
            tangram.room.color = this.changeColor();
            tangram.room.bordercolor = this.changeColor();
            tangram.room.title = "";
            tangram.module = [];
            tangram.module = this.room.shapes.map(v => {
              return {
                p: this.changeData(v.points),
                title:v.label,
                color: this.changeColor(),
                bordercolor: this.changeColor()
              };
            });
            this.canvasZoom = new CanvasZoom({
              canvas: canvas,
              mapInfo: tangram,
              isFullPage: false,
              ratio: {
                x: 9.4,
                y: 5.3
              }
            });
          // var subrooms = resp.data.room.subrooms;
        })
        // let canvas = this.$refs;
        // let ctx = canvas.getContext("2d");
      },
      handleSee2D(index,row){
        this.dialogVisible = true;
      },
      //3d画图
      handleSee3D(){
        this.dialogVisible3d=true;
      },
      //模拟导航
      navigation(){
         this.map.Simulation()
      },
      //导航模拟
      orbital(){
        this.map.Orbitsimulation()
      },
      dialogOpen3d(){
        this.$nextTick(()=>{
           let self = this;
           let id=1;
          this.map= new Map(document.getElementById('container'))
          this.map.init(id,this.imgg)
          this.render()
        })
    //       var TrackballControls = require('three-trackballcontrols');
    //       let canvas3d = this.$refs.crc3d;
    //       // this.ctx = canvas3d.getContext("2d");
    //       this.canvas3d=canvas3d;
    //       // this.ctx = canvas3d.getContext("2d");
    //         var index = this.room.layout;
    //         canvas3d.width=this.room.imageWidth;
    //         canvas3d.height=this.room.imageHeight;
    //         let tangram = {};
    //         tangram.room = {};
    //         tangram.room.p = this.changeDatas(index);
    //         var subrooms = this.room.shapes;
    //         var  canva = document.getElementById("canvas");
    //         // WebGLRenderer
    //         this.renderer = new THREE.WebGLRenderer({
    //           antialias: true
    //       });
    //       //  this.renderer.setClearColor(0xF1F2F7);
    //       //  this.renderer.setSize(window.innerWidth, window.innerHeight);
    //         this.scene = new THREE.Scene();
    //         this.scene.background = new THREE.Color(0xf1f2f7);
    //         this.camera = new THREE.PerspectiveCamera(
    //           45,
    //           400/300,
    //           0.1,
    //           100
    //         );
    //         this.camera.lookAt(new THREE.Vector3(20, 0, 20));
    //         this.camera.position.set(0, 40, 50);
    //         // 光线的照射
    //         var ambiColor = "#f2f2f2";
    //         var spotLight = new THREE.SpotLight(ambiColor);
    //         spotLight.position.set(-100, 200, -100);
    //         this.scene.add(spotLight);
    //         var spotLight2 = new THREE.SpotLight(ambiColor);
    //         spotLight2.position.set(100, 100, 150);
    //         this.scene.add(spotLight2);
    //         this.controls = new TrackballControls( this.camera );
    //         this.controls.rotateSpeed = 1.0;
    //         this.controls.zoomSpeed = 1.2;
    //         this.controls.panSpeed = 0.8;
    //         this.controls.noZoom = false;
    //         this.controls.noPan = false;
    //         this.controls.staticMoving = true;
    //         this.controls.dynamicDampingFactor = 0.3;
    //         this.raycaster = new THREE.Raycaster();
    //         this.mouse = new THREE.Vector2();
    //         // CanvasRenderer
    //           this.renderer = new THREE.WebGLRenderer({
    //           // 将canvas交给renderer 一个渲染的容器
    //           canvas: this.$refs.crc3d,
    //           antialias: true,
    //           // 平滑， 抗锯齿 输出的画面会进行优化，不会带毛边
    //           });
    //         canvas3d.addEventListener('click', this.onDocumentMouseClick, false);
    //         // document.canvas3d.on('click', onDocumentMouseClick, false)
    //         //  this.createSpriteText();
    //         this.creatCube(subrooms);
    //         this.render();
    //     })
    //   },
    //   onDocumentMouseClick(event) {
    //     event.preventDefault();
    //     this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //     this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    //  },
    //    creatCube(index,tangram) {
    //      // 材质定义
    //     var yellow = [];
    //     // 右侧面
    //     yellow.push(new THREE.MeshLambertMaterial({color: "#F8D3A5"}));
    //     // 左侧面
    //     yellow.push(new THREE.MeshLambertMaterial({color: "#F8D3A5"}));
    //     // 顶侧面
    //     yellow.push(new THREE.MeshBasicMaterial({color: "#F8D3A5",transparent:true,opacity:0.8}));
    //     // 地侧面
    //     yellow.push(new THREE.MeshLambertMaterial({color: "#F8D3A5"}));
    //     // 前侧面
    //     yellow.push(new THREE.MeshLambertMaterial({color: "#F8D3A5"}));
    //     // 后侧面
    //     yellow.push(new THREE.MeshLambertMaterial({color: "#F8D3A5"}));
    //     var white = [];
    //     white.push(new THREE.MeshLambertMaterial({color: "#fff"}));
    //     white.push(new THREE.MeshLambertMaterial({color: "#fff"}));
    //     white.push(new THREE.MeshBasicMaterial({color: "#fff"}));
    //     white.push(new THREE.MeshLambertMaterial({color: "#fff"}));
    //     white.push(new THREE.MeshLambertMaterial({color: "#fff"}));
    //     white.push(new THREE.MeshLambertMaterial({color: "#fff"}));
    //     var purple = [];
    //     purple.push(new THREE.MeshLambertMaterial({color: "#E3B7F7"}));
    //     purple.push(new THREE.MeshLambertMaterial({color: "#E3B7F7"}));
    //     purple.push(new THREE.MeshBasicMaterial({color: "#E3B7F7",transparent:true,opacity:0.8}));
    //     purple.push(new THREE.MeshLambertMaterial({color: "#E3B7F7"}));
    //     purple.push(new THREE.MeshLambertMaterial({color: "#E3B7F7"}));
    //     purple.push(new THREE.MeshLambertMaterial({color: "#E3B7F7"}));
    //     var orange = [];
    //     orange.push(new THREE.MeshLambertMaterial({color: "#FFC965"}));
    //     orange.push(new THREE.MeshLambertMaterial({color: "#FFC965"}));
    //     orange.push(new THREE.MeshBasicMaterial({color: "#FFC965",transparent:true,opacity:0.5}));
    //     orange.push(new THREE.MeshLambertMaterial({color: "#FFC965"}));
    //     orange.push(new THREE.MeshLambertMaterial({color: "#FFC965"}));
    //     orange.push(new THREE.MeshLambertMaterial({color: "#FFC965"}));
    //     let texture1 = new THREE.TextureLoader().load(this.img);//凹凸
    //     let texture2 = new THREE.TextureLoader().load(this.img);//打底
    //     // // 底部左侧的地板
    //     var cubeBottomLeftGeometry = new THREE.BoxGeometry(50,0.2,40);
    //     var cubeBottomLeftMaterial =  new THREE.MeshFaceMaterial(white);
    //        // // 底部左侧的地板
    //     var cubeBottomLeftGeometry = new THREE.BoxGeometry(50,0.1,40);
    //     var cubeBottomLeftMaterial = new THREE.MeshPhongMaterial({
    //         map: texture2,
    //         bumpMap: texture1,
    //         bumpScale: 0.3
    //     });
    //     var cubeBottomLeft = new THREE.Mesh(cubeBottomLeftGeometry,cubeBottomLeftMaterial);
    //     cubeBottomLeft.position.x = 0;
    //     cubeBottomLeft.position.y = 0;
    //     cubeBottomLeft.position.z = 0;
    //     this.scene.add(cubeBottomLeft);
    //        var materials = [ 
    //     new THREE.MeshBasicMaterial( { map:new THREE.TextureLoader().load(this.imgg) } ), // right
    //     new THREE.MeshBasicMaterial( { map:new THREE.TextureLoader().load(this.imgg) } ), // left
    //     new THREE.MeshBasicMaterial( { map:new THREE.TextureLoader().load(this.imgg) } ), // top
    //     new THREE.MeshBasicMaterial( { map:new THREE.TextureLoader().load(this.imgg) } ), // bottom 
    //     new THREE.MeshBasicMaterial( { map:new THREE.TextureLoader().load(this.imgg) } ), // front 
    //     new THREE.MeshBasicMaterial( { map:new THREE.TextureLoader().load(this.imgg) } ), // back
    //     ];
    //      //添加一个精灵
    //     for(var i = 0; i < index.length; i++){
    //        var layout=this.changeData(index[i].points);
    //        console.log(layout)
    //        layout.color=this.changeColor();
    //       // tangram.room.color = this.changeColor();
    //       // tangram.room.bordercolor = this.changeColor();
    //     var face1Material = new THREE.MeshFaceMaterial(materials);
    //     var cube1Geom = new THREE.BoxGeometry((Number(layout[2].x)-Number(layout[0].x))/10,this.cubeHeight,(Number(layout[2].y)-Number(layout[0].y))/10);
    //     var cube1 = new THREE.Mesh(cube1Geom, face1Material);
    //     cube1.position.x =(Number(layout[2].x)+Number(layout[0].x))/2/10-25 ;
    //     cube1.position.y = 1;
    //     cube1.position.z = (Number(layout[2].y)+Number(layout[0].y))/2/10-20;
    //     this.scene.add(cube1);
    //     var canvas = this.drawCanvas({text:index[i].label, width:256, height:64});
    //     var spriteMapCube = new THREE.Texture(canvas);
    //     spriteMapCube.wrapS = THREE.RepeatWrapping;
    //     spriteMapCube.wrapT = THREE.RepeatWrapping;
    //     spriteMapCube.needsUpdate = true;
    //     var spriteCube = new THREE.Sprite(new THREE.SpriteMaterial({map: spriteMapCube, color: 0x0000000}));
    //     spriteCube.position.set((Number(layout[2].x)+Number(layout[0].x))/2/10-16,10,(Number(layout[2].y)+Number(layout[0].y))/2/10-24); //设置位置
    //     spriteCube.scale.set(20, 5, 1); //设置scale进行大小设置
    //     spriteCube.center.set(0.5, 2); //设置位置点处于精灵的最下方中间位置
    //     this.scene.add(spriteCube);
    //     var depth = 2;
    //     var extrudeSettings1 = {
    //         amount:0.1,
    //         bevelThickness:1,
    //         bevelSize:0.5,
    //         bevelEnabled:true,
    //         bevelSegments:1,
    //         curveSegments:1,
    //         steps:1,
    //     };
    //     var geometry = new THREE.ExtrudeGeometry( this.drawShape(),extrudeSettings1);
    //     var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    //     var mesh = new THREE.Mesh( geometry, material ) ;
    //     // mesh.position.set(-10, 0, 0 );
    //     this.scene.add( mesh );
    //       }
    //       var x = 0, y = 0;
    },
    drawShape() {

        // 实例化shape对象
        var shape = new THREE.Shape();

        // 设置开始点的位置
        shape.moveTo(20, 10);

        // 从起始点绘制直线到当前位置
        shape.lineTo(20, 40);

        //设置一条曲线到30 40
        shape.bezierCurveTo(15, 25, -5, 25, -20, 40);

        // 设置一条通过当前所有顶点的光滑曲线
        shape.splineThru(
            [
                new THREE.Vector2(-22, 30),
                new THREE.Vector2(-18, 20),
                new THREE.Vector2(-20, 10)
            ]
        );

        // 设置曲线回到顶点
        shape.quadraticCurveTo(0, -15, 20, 10);

        // 添加第一个眼
        var hole1 = new THREE.Path();
        hole1.absellipse(6, 20, 2, 3, 0, Math.PI * 2, true);
        shape.holes.push(hole1);

        // 添加第二个眼
        var hole2 = new THREE.Path();
        hole2.absellipse(-10, 20, 2, 3, 0, Math.PI * 2, true);
        shape.holes.push(hole2);

        // 添加嘴巴，一半的圆
        var hole3 = new THREE.Path();
        hole3.absarc(0, 5, 2, 0, Math.PI, true);
        shape.holes.push(hole3);

        // 返回shape
        return shape;
    },
    //创建canvas对象
    drawCanvas(options) {     
        let canvas = document.createElement("canvas");
        canvas.width = options.width;
        canvas.height = options.height;
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "rgba(0, 0, 0, 0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "10px Verdana";
        ctx.fillStyle = "#fff";
        ctx.fillText(options.text, 0, 56, options.width);
        return canvas;
    },
    createSpriteText(){
              // let ctx = this.canvas3d.getContext("2d");
              // console.log(ctx)
			        this.ctx.fillStyle = "#ffff00";
			        this.ctx.font = "Bold 100px Arial";
			        this.ctx.lineWidth = 4;
			        this.ctx.fillText("100",4,100);
              let texture = new THREE.Texture(this.canvas3d);
			        texture.needsUpdate = true;
              //使用Sprite显示文字
              let material = new THREE.SpriteMaterial({map:texture,transparent:true});
              let textObj = new THREE.Sprite(material);
              textObj.scale.set(0.5 * 100, 0.25 * 100, 0.75 * 100);
              textObj.position.set(0,0,98);
              return textObj;
			},
    // render() {
    //     this.controls.update();
    //     requestAnimationFrame(this.render);
    //     this.renderer.render(this.scene, this.camera);
    //     this.raycaster.setFromCamera(this.mouse, this.camera);
    //     var intersects = this.raycaster.intersectObjects(this.scene.children)
    //     if (intersects.length > 0) {
    //         if (this.INTERSECTED !== intersects[0].object) {
    //             // 判断对象是否是mesh 并且是有六个面材质的
    //             if (this.INTERSECTED && this.INTERSECTED instanceof THREE.Mesh && this.INTERSECTED.material.length === 6) {
    //                 for(var i = 0; i < 6; i++){
    //                     this.INTERSECTED.material[i].color.setHex(this.INTERSECTED.currentHex);
    //                 }
    //             }
    //             this.INTERSECTED = intersects[0].object;
    //             if(this.INTERSECTED instanceof THREE.Mesh && this.INTERSECTED.material.length === 6){
    //                 for(var i = 0; i < 6; i++){
    //                     this.INTERSECTED.currentHex = this.INTERSECTED.material[i].color.getHex();
    //                     // console.log(this.INTERSECTED.currentHex)
    //                     // 如果是底面 因为底面的颜色获取后打印结果为：16777215
    //                     if(this.INTERSECTED.currentHex !== 16777215)
    //                     // console.log(this.INTERSECTED.currentHex)
    //                         this.INTERSECTED.material[i].color.set( "#FFC965" );
    //                 }
    //             }
    //         }
    //     } else {
    //         if (this.INTERSECTED && this.INTERSECTED instanceof THREE.Mesh && this.INTERSECTED.material.length === 6) {
    //             for(var i = 0; i < 6; i++){
    //                 this.INTERSECTED.material[i].color.set(this.INTERSECTED.currentHex);
    //             }
    //         }
    //         this.INTERSECTED = null;
    //     }
    // },
      handleSizeChange(){
      },
      handleCurrentChange(){
      },
    }
    
}
</script>
<style scoped lang="scss">
.lookmap{
    width: 100%;
    margin-top: 20px;
    .lookmap_add{
        width: 100%;
    }
    .lookmap_list{
        width: 100%;
        margin-top: 20px;
    }
    .lookmap_paging{
        width: 100%;
        margin-top: 20px;
        float:right;
    }
    .map{
      height:300px;
      width:700px;
      margin:0 auto;
    }
}
</style>