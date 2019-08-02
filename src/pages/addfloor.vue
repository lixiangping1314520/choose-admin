<template>
  <div class="addfloor">
    <div class="addfloor_add">
      <el-button type="primary" @click="newfloor">新增</el-button>
    </div>
    <div class="addfloor_list">
      <el-table :data="tableData" style="width:100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name" label="建筑物名称" width="180"></el-table-column>
         <el-table-column prop="floor" label="楼层" width="180"></el-table-column>
         <el-table-column prop="address" label="地址" width="180"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" disabled="disabled" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button size="mini" type="danger" @click="handleSee2D(scope.$index, scope.row)">2D查看</el-button>
            <el-button size="mini" type="danger" @click="handleSee3D(scope.$index, scope.row)">3D查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog  title="查看2D地图" :modal-append-to-body="false" :visible.sync="dialogVisible2D" width="50%" @open="dialogOpen">
      <canvas ref="hello" width="500" height="400" style="margin:0px auto;"></canvas>
    </el-dialog>
    <el-dialog  title="查看3D地图" :modal-append-to-body="false" :visible.sync="dialogVisible3D" width="50%" @open="dialogOpen3D">
      <canvas ref="crc3d" width="500" height="400" style="margin:0px auto;"></canvas>
    </el-dialog>
    <div class="addgrouping_paging">
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5,10,15,20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total=total
      >
    </el-pagination>
  </div>
    <el-dialog
      title="新增楼层"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="楼层名称" prop="floor">
          <el-input type="text" v-model="form.floor"></el-input>
        </el-form-item>
        <el-form-item label="建筑物" prop="type" label-width="90px">
          <el-select v-model="form.building" placeholder="请选择建筑名称">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传CAD图片" label-width="120px" prop="uploadfile">
           <div class="adatar">
          <img :src="form.uploadfile?form.uploadfile:require('../assets/img/ur.png')" alt="" >
          <input type="file" name="" accept="image/gif,image/jpeg,image/jpg,image/png" @change="fileChange">
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import CanvasZoom from "../../static/js/canvas_zoom";
import { realconsole } from "@/assets/js/canvas3d";
import * as THREE from "three";
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 7,
      total: 0,
      page: 1,
      show:false,
      tableData: [],
      camera: null,
      scene: null,
      renderer: null,
      ctx:null,
      mesh: null,
      INTERSECTED: null,
      raycaster: null,
      mouse: null,
      room:{},
      room3d:{},
      lineHeight:1.75,
      canvas3d:'',
      ctx:'',
    // 块的高度
     cubeHeight:1.5,
      img:require("../assets/img/time.png"),
      imgg:require("../assets/img/timg2.jpeg"),
      dialogVisible: false,
      dialogVisible2D:false,
      dialogVisible3D:false,
      options:[],
       form: {
        floor: "",
        building: "",
        uploadfile:'',
      },
      id:'',
       rules: {
          floor: [
            { required: true, message: '请输入类型名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          outline_coordinate: [
            {required: true, message: '请输入四个点坐标', trigger: 'change' }
          ],
           center_coordinate: [
            { required: true, message: '请选择中心点坐标', trigger: 'change' }
          ],
          building: [
            { required: true, message: '请选择楼层类型', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请填写地址', trigger: 'blur' }
          ]
        }
    };
  },
  mounted(){
  this.select_building();
  this.get_floor();
  },
  methods: {
  changeDatas:function (a) {
    String.prototype.Trim = function () {
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
  //颜色随机
    changeColor: function () {
    var colors = [
      "rgba(220, 169, 105, 0.2)",
      "rgba(76, 181, 216, 0.2)",
      "rgba(225, 215, 155, 0.1)",
      "rgba(230, 110, 250, 0.2)",
      "rgba(76, 181, 216, 0.2)",
    ];
    var random = this.getRandom(0, colors.length - 1);
    return colors[random];
  },
   getRandom: function (n, m) {
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
    //点击获取页面
    dialogOpen(){
       this.$nextTick(()=>{
          let _this=this;
          let canvas = _this.$refs.hello;
          let ctx = canvas.getContext("2d");
          canvas.width=500;
          canvas.height=400;
          var layout = this.room.shapes.pop();
            let tangram = {};
            tangram.room = {};
            tangram.room.p = _this.changeDatas(layout.points);
            tangram.room.color = _this.changeColor();
            tangram.room.bordercolor = _this.changeColor();
            tangram.room.title = "";
            tangram.module = [];
            tangram.module = this.room.shapes.map(v => {
              return {
                p: _this.changeDatas(v.points),
                title:v.label,
                color: _this.changeColor(),
                bordercolor: _this.changeColor()
              };
            });
            this.canvasZoom = new CanvasZoom({
              canvas: canvas,
              mapInfo: tangram,
              isFullPage: false,
              ratio: {
                x: this.room.imageWidth,
                y: this.room.imageHeight
              }
            })
       })
      },  
    //删除建筑楼层
    handleDelete(index,row){
      let _this = this;
      _this.$httpRequest({
        path: "/room/delete_floor/",
        type: "post",
        args:{
                id:row.id
              },
        success: resp => {
           this.get_floor();
           this.$message({
                type: "success",
                message: resp.data
              });
        },
        fail: error => {
          console.log(error.content);
        }
      });
    },
    handleSee2D(index, row){
      let _this=this;
        _this.$httpRequest({
              path: "/room/get_map/",
              type: "post",
              args:{
                id:row.id
              },
              success: resp => {
                 if(resp.data==undefined){
                   this.room=resp
                   _this.dialogVisible2D=true;
                 }else{
                   _this.dialogVisible2D=false;
                   this.$message({
                      type: 'error',
                      message:resp.data,
                    }); 

                 }
              },
               fail: error => {
                console.log(error.content);
              }
            });
             
    },
    //所有的楼层
    get_floor(){
       let _this=this;
        _this.$httpRequest({
              path: "/room/get_floor/",
              type: "post",
              args:{
                page:this.page
              },
              success: resp => {
                this.tableData=resp.data
                this.total=resp.total
              },
              fail: error => {
                console.log(error.content);
              }
            });  
    },
     handleSizeChange(val) {},
    handleCurrentChange(val) {
      this.page = val;
      this.get_floor();
    },
    //建筑物的下拉框
     select_building(){
        let _this=this;
        _this.$httpRequest({
              path: "/room/select_building/",
              type: "post",
              success: resp => {
                this.options=resp.data
              },
              fail: error => {
                console.log(error.content);
              }
            });     
      },
      //3d地图查看
      handleSee3D(index,row){
         let _this=this;
        _this.$httpRequest({
              path: "/room/get_map/",
              type: "post",
              args:{
                id:row.id
              },
              success: resp => {
                 if(resp.data==undefined){
                   this.room3d=resp;
                   _this.dialogVisible3D=true;
                 }else{
                   _this.dialogVisible3D=false;
                   this.$message({
                      type: 'error',
                      message:resp.data,
                    }); 

                 }
              },
               fail: error => {
                console.log(error.content);
              }
            });

      },
      //查看地图
      dialogOpen3D(){
        let _this=this;
          this.$nextTick(()=>{
          var TrackballControls = require('three-trackballcontrols');
          let canvas3d = this.$refs.crc3d;
          canvas3d.width=500;
          canvas3d.height=400;
          var layout = this.room3d.shapes.pop();
          var subrooms = this.room3d;
          this.scene = new THREE.Scene();
           this.renderer = new THREE.WebGLRenderer({
            antialias: true,
        });
          this.renderer.setClearColor(0xF1F2F7);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0xF1F2F7 );
        this.renderer.setClearColor(new THREE.Color(0xFFFFFF))
        this.camera = new THREE.PerspectiveCamera(45,500/400,0.1,1000);
          this.camera.lookAt(new THREE.Vector3(20, 0, 20));
        this.camera.position.set(0, 50, 50);
        // 光线的照射
        var ambiColor = "#f2f2f2";
        var spotLight = new THREE.SpotLight(ambiColor);
        spotLight.position.set( -100, 100, -100);
        this.scene.add(spotLight);
        var spotLight2 = new THREE.SpotLight(ambiColor);
        spotLight2.position.set( 100, 100, 150);
         this.scene.add(spotLight2);
        this.controls =new TrackballControls( this.camera );
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;
        this.controls.noZoom = false;
        this.controls.noPan = false;
        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.renderer = new THREE.WebGLRenderer({
              // 将canvas交给renderer 一个渲染的容器
              canvas: this.$refs.crc3d,
              antialias: true,
              // 平滑， 抗锯齿 输出的画面会进行优化，不会带毛边
          });
        // var sprite =this.createSpriteText()//创建出我们的精灵。精灵拥有万向锁。永远朝向屏幕。这就是他的优势。
			  // this.scene.add(sprite)    
      canvas3d.addEventListener('click', this.onDocumentMouseClick, false);
      this.render();
      this.creatCube(subrooms);
        })
      },
        createSpriteText(){
          // this.$nextTick(()=>{
          // let canvas = document.createElement("canvas");
          // console.log(canvas)
          // let ctx = canvas.getContext("2d");
			    //  ctx.fillStyle = "#ffff00";
			    //    ctx.font = "Bold 100px Arial";
			    //     ctx.lineWidth = 4;
			    //   ctx.fillText("100",4,100);
          //     let texture = new THREE.Texture(canvas);
			    //     texture.needsUpdate = true;
          //     //使用Sprite显示文字
          //     let material = new THREE.SpriteMaterial({map:texture,transparent:true});
          //     let textObj = new THREE.Sprite(material);
          //     textObj.scale.set(0.5 * 100, 0.25 * 100, 0.75 * 100);
          //     textObj.position.set(0,0,98);
          //     return textObj;
          // })
			},
    onDocumentMouseClick(event) {
       let image = new Image()
        event.preventDefault();
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    },
       creatCube(tangram) {
         // 材质定义
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

        var white = [];
        white.push(new THREE.MeshLambertMaterial({color: "#fff"}));
        white.push(new THREE.MeshLambertMaterial({color: "#fff"}));
        white.push(new THREE.MeshBasicMaterial({color: "#fff"}));
        white.push(new THREE.MeshLambertMaterial({color: "#fff"}));
        white.push(new THREE.MeshLambertMaterial({color: "#fff"}));
        white.push(new THREE.MeshLambertMaterial({color: "#fff"}));

        var purple = [];
        purple.push(new THREE.MeshLambertMaterial({color: "#E3B7F7"}));
        purple.push(new THREE.MeshLambertMaterial({color: "#E3B7F7"}));
        purple.push(new THREE.MeshBasicMaterial({color: "#E3B7F7",transparent:true,opacity:0.8}));
        purple.push(new THREE.MeshLambertMaterial({color: "#E3B7F7"}));
        purple.push(new THREE.MeshLambertMaterial({color: "#E3B7F7"}));
        purple.push(new THREE.MeshLambertMaterial({color: "#E3B7F7"}));
        var orange = [];
        orange.push(new THREE.MeshLambertMaterial({color: "#FFC965"}));
        orange.push(new THREE.MeshLambertMaterial({color: "#FFC965"}));
        orange.push(new THREE.MeshBasicMaterial({color: "#FFC965",transparent:true,opacity:0.5}));
        orange.push(new THREE.MeshLambertMaterial({color: "#FFC965"}));
        orange.push(new THREE.MeshLambertMaterial({color: "#FFC965"}));
        orange.push(new THREE.MeshLambertMaterial({color: "#FFC965"}));
        let texture1 = new THREE.TextureLoader().load(this.img);//凹凸
        let texture2 = new THREE.TextureLoader().load(this.img);//打底
          // // 底部左侧的地板
        var cubeBottomLeftGeometry = new THREE.BoxGeometry(50,0.1,40);
        var cubeBottomLeftMaterial = new THREE.MeshPhongMaterial({
            map: texture2,
            bumpMap: texture1,
            bumpScale: 0.3
        });
        var cubeBottomLeft = new THREE.Mesh(cubeBottomLeftGeometry,cubeBottomLeftMaterial);
        cubeBottomLeft.position.x = 0;
        cubeBottomLeft.position.y = 0;
        cubeBottomLeft.position.z = 0;
        this.scene.add(cubeBottomLeft);
        let index=tangram.shapes;
        var materials = [ 
        new THREE.MeshBasicMaterial( { map:new THREE.TextureLoader().load(this.imgg) } ), // right
        new THREE.MeshBasicMaterial( { map:new THREE.TextureLoader().load(this.imgg) } ), // left
        new THREE.MeshBasicMaterial( { map:new THREE.TextureLoader().load(this.imgg) } ), // top
        new THREE.MeshBasicMaterial( { map:new THREE.TextureLoader().load(this.imgg) } ), // bottom 
        new THREE.MeshBasicMaterial( { map:new THREE.TextureLoader().load(this.imgg) } ), // front 
        new THREE.MeshBasicMaterial( { map:new THREE.TextureLoader().load(this.imgg) } ), // back
        ];
         for(var i = 0; i < index.length; i++){
           var layout=this.changeDatas(index[i].points);
           layout.color=this.changeColor();
        var face1Material = new THREE.MeshFaceMaterial(materials);
        var cube1Geom = new THREE.BoxGeometry((Number(layout[2].x)-Number(layout[0].x))/10,this.cubeHeight,(Number(layout[2].y)-Number(layout[0].y))/10);
        var cube1 = new THREE.Mesh(cube1Geom, face1Material);
        cube1.position.x =(Number(layout[2].x)+Number(layout[0].x))/2/10-15;
        cube1.position.y = 1;
        cube1.position.z = (Number(layout[2].y)+Number(layout[0].y))/2/10-15;
        this.scene.add(cube1);
          }
    },
    render() {
        this.controls.update();
        requestAnimationFrame(this.render);
        this.renderer.render(this.scene, this.camera);
         this.raycaster.setFromCamera(this.mouse, this.camera);
        var intersects = this.raycaster.intersectObjects(this.scene.children)
        if (intersects.length > 0) {
            if (this.INTERSECTED !== intersects[0].object) {
                // 判断对象是否是mesh 并且是有六个面材质的
                if (this.INTERSECTED && this.INTERSECTED instanceof THREE.Mesh && this.INTERSECTED.material.length === 6) {
                    for(var i = 0; i < 6; i++){
                        this.INTERSECTED.material[i].color.setHex(this.INTERSECTED.currentHex);
                    }
                }
                this.INTERSECTED = intersects[0].object;
                if(this.INTERSECTED instanceof THREE.Mesh && this.INTERSECTED.material.length === 6){
                    for(var i = 0; i < 6; i++){
                        this.INTERSECTED.currentHex = this.INTERSECTED.material[i].color.getHex();
                        // console.log(this.INTERSECTED.currentHex)
                        // 如果是底面 因为底面的颜色获取后打印结果为：16777215
                        if(this.INTERSECTED.currentHex !== 16777215)
                        // console.log(this.INTERSECTED.currentHex)
                            this.INTERSECTED.material[i].color.set( "#FFC965" );
                    }
                }
            }
        } else {
            if (this.INTERSECTED && this.INTERSECTED instanceof THREE.Mesh && this.INTERSECTED.material.length === 6) {
                for(var i = 0; i < 6; i++){
                    this.INTERSECTED.material[i].color.set(this.INTERSECTED.currentHex);
                }
            }
            this.INTERSECTED = null;
        }
    },
      //添加楼层
     onSubmit() {
       let _this=this;
        _this.$httpRequest({
              path: "/room/add_floor/",
              type: "post",
              args:this.form,
              success: resp => {
                this.get_floor();
                this.dialogVisible = false;
                this.$message({
                  type: 'success',
                  message:resp.data,
                }); 
              },
              fail: error => {
              }
            }); 
    },
    //添加图片
     fileChange(e) { 
            var that = this;
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function(e){
                that.form.uploadfile  = e.target.result;
            }
            reader.readAsDataURL(file);
        },
        //点击新增弹出框
    newfloor() {
      this.dialogVisible = true;
    }
  }
};
</script>
<style scoped lang="scss">
.addfloor {
  width: 100%;
  margin-top: 20px;
  .addfloor_add {
    width: 100%;
  }
  .addfloor_list {
    width: 100%;
    margin-top: 20px;
  }
  .addfloor_paging {
    width: 100%;
    margin-top: 20px;
  }
   .adatar {
        position: relative;
        width:168px;
        height:168px;
        img {
            object-fit: cover;
            object-position: center;
            width: 100%;
            height: 100%;
            border-radius: 1%;
        }
        input {
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            border-radius:1%;
            outline: none;
            opacity: 0;
            cursor: pointer;
            &:focus {
                box-shadow: none;
            }
        }
   }
}
</style>
