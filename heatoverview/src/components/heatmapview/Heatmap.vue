<template>
  <div class="viewcontainer">
    <canvas id="id_heatmap"></canvas>
    <!-- <Panel v-on:configchange="update"></Panel> -->
  </div>
</template>

<script>
import DataService from "../../services/dataserve.js"
import * as empty from '../../assets/lib/simpleheat'
import Panel from './Panel';
export default {
  name: 'Heatmap',
  data () {
    return {
      blur:1,
      radius:1,
      maxv: 5,
      image: "test.jpg",
      maxHei: 0,
      maxWid:0,
      xspeed: 10, // <=10
      userid: "011me",
      vdata: {}
    }
  },
  components: {
    Panel
  },
  mounted(){
    let that = this;
    Object.getPrototypeOf(DataService).get_json_data.call(this, 'loadVideodata', "duration")
    setTimeout(function(){
      Object.getPrototypeOf(DataService).get_json_data.call(that, 'dataProcess', "cache/"+that.userid)
    }, 1000)
  },
  methods:{
    loadVideodata(vdata){
      this.vdata = vdata["ipt_"+this.userid]
    },
    dataProcess(data){
      function compare(a, b) {
          if (a.time < b.time) {
              return -1;
          }
          if (a.time > b.time) {
              return 1;
          }
          return 0;
      }
      data.sort(compare);
      let t = data[data.length-1]["time"]
      let start = t - this.vdata["time"]
      // console.log(start)
      let tmp = data.filter(item => {
        // console.log(parseInt(item["time"]) > parseInt(start))
        return parseInt(item["time"]) > parseInt(start) && item["x"] < 200 && item["y"] < 150
      })
      start = tmp[0]["time"]
      data = data.filter(item => {
        return parseInt(item["time"]) > parseInt(start)
      })
      let localdata = data.map(item => {
        return [item["x"], item["y"], 0, item["time"], item["clientX"], item["clientY"]]
      })
      localdata[0][2] = 1
      for(let i=0;i<localdata.length-2;){
        let t=i+1;
        for(;t<localdata.length;t++){
          if((localdata[t][3] - localdata[i][3]) > 100){
            localdata[i][2] = 1
            i = t
            break
          }
        }
        if(t == localdata.length){
          break
        }
      }
      let maxdata = data.map(item => {
        return item["x"] + "_" +item["y"]
      })
      this.maxWid = document.getElementById("id_iframe").contentDocument.getElementsByTagName("html")[0].scrollWidth
      this.maxHei = document.getElementById("id_iframe").contentDocument.getElementsByTagName("html")[0].scrollHeight
      this.localdata = localdata;
      this.drawHeatmap()
    },
    setCanvas(){
      let canvas = document.getElementById("id_heatmap")
      var background = new Image();
      background.src = '../static/img/' + this.image;
      background.onload = function () {
        var context = canvas.getContext('2d')
        context.globalAlpha = 0.5;
        context.drawImage(this, 0, 0, canvas.width, canvas.height)
      }
    },
    valueChange(){
      let canvas = document.getElementById("id_heatmap")
      canvas.getContext('2d')
      let context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.globalAlpha = 1;
      this.drawHeatmap()
    },
    drawHeatmap () {
      let localdata = this.localdata;
      let canvas = document.getElementById('id_heatmap')
      canvas.width = this.maxWid;
      canvas.height = this.maxHei;
      this.heatmap = Simpleheat(canvas)
      this.heatmap.data([localdata[0]])
      // this.heatmap._max = this.maxv
      // this.heatmap.radius(this.radius, this.blur)
      this.heatmap._max = 20
      this.heatmap.radius(20, 15)
      this.heatmap.draw();
      // console.log((new Date()).getTime())
      this.addrecord(0)
    },

    addrecord(index){
      // if(index > 50){
      //   return 
      // }
      let that = this
      if(index >= this.localdata.length-1){
        console.log((new Date()).getTime())
        return;
      }
      let initIndex = index;
      this.heatmap.add(this.localdata[index++])
      while(index < this.localdata.length-1 && !this.localdata[index][2]){
        this.heatmap.add(this.localdata[index++])
      }
      setTimeout(function(){
          window.scrollTo(that.localdata[index][0] - that.localdata[index][3], that.localdata[index][1] - that.localdata[index][4]);
          document.getElementById("id_mouse").style.top = that.localdata[index][1] + "px"
          document.getElementById("id_mouse").style.left = that.localdata[index][0] +  "px"
          that.heatmap.draw();
          that.addrecord(index)
      }, (that.localdata[index][3] - that.localdata[initIndex][3])/that.xspeed)
    },
    update(data){
      let conf = data[data["mode"]]
      this.maxv = conf.maxv
      this.radius = conf.radius
      this.blur = conf.blur
      this.drawHeatmap()
    }
  }
}
// --数据--， ---算法---， 目的， 研究技术
</script>

<style scoped>
.viewcontainer{
  position: absolute;
  left: 0;
  top: 0;
}
.slider {
  width: 200px;
}
.panel{
  display: grid;
  width: 200px;
  float: right;
  margin-right: 200px;
}
</style>