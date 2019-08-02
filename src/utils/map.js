import * as THREE from 'three'
import {MTLLoader,OBJLoader} from 'three-obj-mtl-loader'
import {TrackballControls} from '@/utils/TrackballControls'
import {axisChange} from '@/utils/axisChange'
import json from '@/json/china.json'
import yintaicheng1F from '@/json/yintaicheng1F.json'
import daohang from '@/json/daohang.json'
// import yintaicheng1FF from '@/json/yintaicheng1F.json'
import time2 from '../assets/img/timg2.jpeg'
export class Map {
  constructor(container) {
    this.container = container
  }
  // 初始化
  init(id,img) {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(45,300/200, 0.1, 100)
    this.camera.lookAt(new THREE.Vector3(20, 0, 20));
    this.camera.position.set(0, 40, 50);
    // 光线的照射
    var ambiColor = "#f2f2f2";
    var spotLight = new THREE.SpotLight(ambiColor);
    spotLight.position.set(-100, 200, -100);
    this.scene.add(spotLight);
    var spotLight2 = new THREE.SpotLight(ambiColor);
    spotLight2.position.set(100, 100, 150);
    this.scene.add(spotLight2);
    this.controls = new TrackballControls(this.camera, this.container)
    this.controls.rotateSpeed = 1.0
    this.controls.zoomSpeed = 1.2
    this.controls.panSpeed = 0.8
    this.controls.noZoom = false
    this.controls.noPan = false
    this.controls.staticMoving = true
    this.controls.dynamicDampingFactor = 0.3
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.container.appendChild(this.renderer.domElement)
    this.renderer.setClearAlpha(0)

    this.renderer.shadowMapSoft = true
    this.renderer.shadowCameraNear = 1
    this.renderer.shadowCameraFar = this.camera.far
    this.renderer.shadowCameraFov = 60
    this.renderer.shadowMapBias = 0.0025
    this.renderer.shadowMapDarkness = 0.5
    this.renderer.shadowMapWidth = this.container.clientWidth
    this.renderer.shadowMapHeight = this.container.clientHeight
    // AmbientLight( color : Integer, intensity : Float )
    // color - (参数可选）颜色的rgb数值。缺省值为 0xffffff。
    // intensity - (参数可选)光照的强度。缺省值为 1。
    let light = new THREE.AmbientLight( 0xffffff )
    this.scene.add(light)
    this.geoMap(img);
  }
  // 渲染
  render () {
    this.renderer.render(this.scene, this.camera)
  }
  // 添加obj模型
  async addObj () {
    let mtlLoader = new MTLLoader();
    let objLoader = new OBJLoader();
    let obj = await new Promise((resolve, reject)=>{
      mtlLoader.load("/static/obj/obj.mtl",(materials)=> {
        materials.preload()
        objLoader.setMaterials(materials)
        objLoader.load('/static/obj/obj.obj', (object) => {
          resolve(object)
        })
      })
    })
    obj.position.x = 0;
    obj.position.y = 0;
    obj.position.z = -120;
    obj.scale.set(0.05, 0.05, 0.05)
    this.scene.add(obj)
  }
  // 添加坐标轴
  addAxis() {
    // x轴红色
    let xMaterial = new THREE.LineBasicMaterial({
      color: 0xff0000
    })
    let xGeometry = new THREE.Geometry()
    xGeometry.vertices.push(
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 100, 0, 0 )
    )
    let xLine = new THREE.Line( xGeometry, xMaterial )
    this.scene.add(xLine)

    // y轴绿色
    let yMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff00
    })
    let yGeometry = new THREE.Geometry()
    yGeometry.vertices.push(
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 0, 100, 0 )
    )
    let yLine = new THREE.Line( yGeometry, yMaterial )
    this.scene.add(yLine)

    // z轴蓝色
    let zMaterial = new THREE.LineBasicMaterial({
      color: 0x0000ff
    })
    let zGeometry = new THREE.Geometry()
    zGeometry.vertices.push(
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 0, 0, 100 )
    )
    let zLine = new THREE.Line( zGeometry, zMaterial )
    this.scene.add(zLine)
  }
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
      return {
        x: v[0],
        y: v[1]
      };
    });
    return d;
}
  // 地理数据处理
  geoMap(img) {
    let data = []
    let imgg=img;
    data =yintaicheng1F.shapes;
    this.addMesh(data,imgg);
  }

  // 创建地图区块
  async addMesh(data,img) {
        var yellow = [];
        // 右侧面
        yellow.push(new THREE.MeshLambertMaterial({color: "#F8D3A5"}));
        // 左侧面
        yellow.push(new THREE.MeshLambertMaterial({color: "#F8D3A5"}));
        // 顶侧面
        yellow.push(new THREE.MeshBasicMaterial({color: "#F8D3A5",transparent:true,opacity:0.8}));
        // 地侧面
        yellow.push(new THREE.MeshLambertMaterial({color: "#F8D3A5"}));
        // 前侧面
        yellow.push(new THREE.MeshLambertMaterial({color: "#F8D3A5"}));
        // 后侧面
        yellow.push(new THREE.MeshLambertMaterial({color: "#F8D3A5"}));
             var orange = [];
        orange.push(new THREE.MeshLambertMaterial({color: "#FFC965"}));
        orange.push(new THREE.MeshLambertMaterial({color: "#FFC965"}));
        orange.push(new THREE.MeshBasicMaterial({color: "#FFC965",transparent:true,opacity:0.5}));
        orange.push(new THREE.MeshLambertMaterial({color: "#FFC965"}));
        orange.push(new THREE.MeshLambertMaterial({color: "#FFC965"}));
        orange.push(new THREE.MeshLambertMaterial({color: "#FFC965"}));
        let texture1 = new THREE.TextureLoader().load(this.img);//凹凸
        let texture2 = new THREE.TextureLoader().load(this.img);//打底
        var materials = [ 
        new THREE.MeshBasicMaterial( { map:new THREE.TextureLoader().load(img) } ), // right
        new THREE.MeshBasicMaterial( { map:new THREE.TextureLoader().load(img) } ), // left
        new THREE.MeshBasicMaterial( { map:new THREE.TextureLoader().load(img) } ), // top
        new THREE.MeshBasicMaterial( { map:new THREE.TextureLoader().load(img) } ), // bottom 
        new THREE.MeshBasicMaterial( { map:new THREE.TextureLoader().load(img) } ), // front 
        new THREE.MeshBasicMaterial( { map:new THREE.TextureLoader().load(img) } ), // back
        ];
        // // 底部左侧的地板
        var cubeBottomLeftGeometry = new THREE.BoxGeometry(50,0.2,40);
        // var cubeBottomLeftMaterial =  new THREE.MeshFaceMaterial(orange);
           // // 底部左侧的地板
        // var cubeBottomLeftGeometry = new THREE.BoxGeometry(50,0.1,40);
        // var cubeBottomLeftMaterial = new THREE.MeshPhongMaterial({
        //     map: texture2,
        //     bumpMap: texture1,
        //     bumpScale: 0.3
        // });
        var cubeBottomLeft = new THREE.Mesh(cubeBottomLeftGeometry,orange);
        cubeBottomLeft.position.x = 0;
        cubeBottomLeft.position.y = 0;
        cubeBottomLeft.position.z = 0;
        this.scene.add(cubeBottomLeft);
        for(var i=0;i<data.length-1;i++){
          var layout=this.changeData(data[i].points);
        var face1Material = new THREE.MeshFaceMaterial(materials);
        var cube1Geom = new THREE.BoxGeometry((Number(layout[2].x)-Number(layout[0].x))/10,this.cubeHeight,(Number(layout[2].y)-Number(layout[0].y))/10);
        var cube1 = new THREE.Mesh(cube1Geom, face1Material);
        cube1.position.x =(Number(layout[2].x)+Number(layout[0].x))/2/15-25 ;
        cube1.position.y = 1;
        cube1.position.z = (Number(layout[2].y)+Number(layout[0].y))/2/10-20;
        this.scene.add(cube1);
        var canvas = this.drawCanvas({text:data[i].label, width:256, height:64});
        var spriteMapCube = new THREE.Texture(canvas);
        spriteMapCube.wrapS = THREE.RepeatWrapping;
        spriteMapCube.wrapT = THREE.RepeatWrapping;
        spriteMapCube.needsUpdate = true;
        var spriteCube = new THREE.Sprite(new THREE.SpriteMaterial({map: spriteMapCube, color: 0x0000000}));
        spriteCube.position.set((Number(layout[2].x)+Number(layout[0].x))/2/15-16,10,(Number(layout[2].y)+Number(layout[0].y))/2/10-24); //设置位置
        spriteCube.scale.set(20, 5, 1); //设置scale进行大小设置
        spriteCube.center.set(0.5, 2); //设置位置点处于精灵的最下方中间位置
        this.scene.add(spriteCube);
      }
  }
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
}
//模拟东航
Simulation(){
  var material = new THREE.LineBasicMaterial({color:0xfff});
  var geometry = new THREE.Geometry();
  var daohangs=this.changeData(daohang.data);
  // var i=0;
  for(var i=0;i<daohangs.length;i++){
         geometry.vertices.push(new THREE.Vector3(daohangs[i].x/2,0,daohangs[i].y/2));
  }
  //线
  var line=new THREE.Line(geometry,material);
  // 加入到场景中
  this.scene.add(line);
}
//轨道
Orbitsimulation(){
  var geometryP = new THREE.SphereGeometry(0.5,10,10);
  var meterialP = new THREE.MeshBasicMaterial({
    color:0xff0000,
    side:THREE.DoubleSide,
  })
  var daohangs=this.changeData(daohang.data);
  var circleP = new THREE.Mesh(geometryP,meterialP);
  this.scene.add(circleP);
  //线
  geometryP.rotateY(Math.PI/2);
  circleP.position.set(daohangs[0].x/2,2,daohangs[0].y/2)
  var material = new THREE.LineBasicMaterial({color:0xfffff});
  var geometry = new THREE.Geometry();
  var data2=0;
  var i=1;
     var delay=function(){
       if(i<daohangs.length){
        circleP.position.set(daohangs[i].x/2,2,daohangs[i].y/2)
        geometry.vertices.push(new THREE.Vector3(daohangs[i].x/2,10,daohangs[i].y/2));
       }else{
        clearInterval(test2);
       }
      }
      var test2 = setInterval(function(){
        i++
        delay()
      },1000)
      var line=new THREE.Line(geometry,material);
      console.log(line)
      // 加入到场景中
      this.scene.add(line);
}
}