<template>
  <div id="all">
    <div id="allmap"></div>
  </div>
</template>
<script>
 //import {MP} from '../../map'
   export default {
       data(){
           return {
           }
       },
       mounted(){
           this.$nextTick(function () {
                 var th=this;
                 var map = new BMap.Map("allmap");
                 var userloc=JSON.parse(th.$cookie.get('userlocation')||'{}');
                 var point = new BMap.Point(userloc.lng,userloc.lat);//当前坐标经纬可改
                // var point = new BMap.Point(104.070824,30.549555);
                // 104.070824,30.549555
                map.centerAndZoom(point,18);//显示级数越大越细
                map.addOverlay(new BMap.Marker(point));//定点坐标红点覆盖
                map.enableScrollWheelZoom(true);
                var geoc = new BMap.Geocoder();    
                var list=[];
                map.addEventListener("click", function(e){   
                    //通过点击百度地图，可以获取到对应的point, 由point的lng、lat属性就可以获取对应的经度纬度     
                    var pt = e.point;
                    point = new BMap.Point(pt.lng,pt.lat);
                    map.addOverlay(new BMap.Marker(point));//定点坐标红点覆盖
                    list.push(pt);
                    th.$cookie.set('list',JSON.stringify(list));
                    geoc.getLocation(pt, function(rs){
                        //addressComponents对象可以获取到详细的地址信息
                        var addComp = rs.addressComponents;
                        var site = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
                        //将对应的HTML元素设置值
                        }); 
            });        
        });
       },
       methods:{
         bmapbutton(){
            
         }
       }
   }
</script>
<style scoped lang="scss">
#all {
  width: -30px;
}
.el-input {
  width: 200px !important;
  margin-bottom: 10px !important;
}
#allmap {
  width: 100%;
  height: 320px;
  font-family: "微软雅黑";
}
</style>


