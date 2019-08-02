<template>
    <div id="all">
    <div>
      <el-input type="text" id="suggestId" name="address_detail" placeholder="地址" v-model="address_detail" class="input_style" clearable></el-input>
    </div>
    	<div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>
    <div id="allmap"></div>
    <div><P>经纬度:{{userlocation.lng}},{{userlocation.lat}}地址:{{address}} </P></div>
    </div>
</template>
<script>
 //import {MP} from '../../map'
   export default {
       data(){
           return {
               address_detail: null, //详细地址
               userlocation: {lng: "", lat: ""},
               address:"",
           }
       },
       mounted(){
           this.userlocation.lng="",
           this.userlocation.lat="",
           this.$nextTick(function () {
                   var th = this
                   // 创建Map实例
                   	function G(id) {
                      return document.getElementById(id);
                    }
                   var map = new BMap.Map("allmap");
                   // 初始化地图,设置中心点坐标，
                  //  var point = new BMap.Point(121.160724,31.173277); // 创建点坐标，汉得公司的经纬度坐标
                  //  map.centerAndZoom(point, 15);
                  //  map.enableScrollWheelZoom();
                    map.centerAndZoom("北京",12);
                   var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
                       {
                           "input": "suggestId"
                           , "location": map
                       })
                       console.log(ac);
                   	ac.addEventListener("onhighlight", function(e) {
                         //鼠标放在下拉列表上的事件
                         console.log(e, 1)
                      var str = "";
                        var _value = e.fromitem.value;
                        var value = "";
                        if (e.fromitem.index > -1) {
                          value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                        }    
                        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
                        
                        value = "";
                        if (e.toitem.index > -1) {
                          _value = e.toitem.value;
                          value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                        }    
                        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
                        G("searchResultPanel").innerHTML = str;
                      });

                      var myValue;
                      ac.addEventListener("onconfirm", function(e) { 
                        console.log(e, 444)
                           //鼠标点击下拉列表后的事件
                      var _value = e.item.value;
                        myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                        G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
                      th.address=myValue;
                       th.$cookie.set('address',th.address);
                        setPlace();
                    });   
                  //  var myValue
                  //  ac.addEventListener("onconfirm", function (e) {
                  //      console.log(e); 
                  //     //  this.address = e//鼠标点击下拉列表后的事件
                  //      var _value = e.item.value;
                  //      myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                  //      console.log(_value);
                  //      console.log(myValue)
                  //      this.address_detail = myValue;
                  //      th.address=myValue;
                  //      th.$cookie.set('address',th.address);
                  //      setPlace();
                  //  });
                   function setPlace() {
                     console.log(331)
                       map.clearOverlays();    //清除地图上所有覆盖物
                       function myFun() {
                           th.userlocation = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                           th.$cookie.set('userlocation',JSON.stringify(th.userlocation));
                           map.centerAndZoom(th.userlocation, 18);
                           map.addOverlay(new BMap.Marker(th.userlocation));    //添加标注
                       }
                       var local = new BMap.LocalSearch(map, { //智能搜索
                           onSearchComplete: myFun
                       });
                       local.search(myValue);
                   }
           });
       },
       methods:{
         bmapbutton(){
            
         }
       }
   }
</script>
<style scoped lang="scss">
   #all{
     width: -30px;
   }
   .el-input{
     width: 200px !important;
     margin-bottom: 10px !important;
   }
   #allmap{
        width:100%;
        height: 320px;
        font-family: "微软雅黑";
    }
</style>

