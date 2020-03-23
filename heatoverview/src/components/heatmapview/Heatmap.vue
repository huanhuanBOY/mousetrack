<template>
  <div class="viewcontainer">
    <canvas id="id_heatmap"></canvas>
    <Panel v-on:configchange="update"></Panel>
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
      image: "ex5.jpg",
      maxHei: 0,
      maxWid:0,
    }
  },
  components: {
    Panel
  },
  mounted(){
    Object.getPrototypeOf(DataService).get_json_data.call(this, 'dataProcess', "discourse")
  },
  methods:{
    dataProcess(data){
      let localdata = data.map(item => {
        return [item["offsetX"], item["offsetY"], 1]
      })
      let maxdata = data.map(item => {
        return item["offsetX"] + "_" +item["offsetY"]
      })
      this.maxWid = Math.max(...data.map(item => item["d_clientWidth"]))
      this.maxHei = Math.max(...data.map(item => item["d_clientHeight"]))
      this.localdata = localdata;
      this.drawHeatmap()
    },
    setCanvas(){
      let canvas = document.getElementById("id_heatmap")
      var background = new Image();
      background.src = '../static/img/' + this.image;
      background.onload = function () {
        var context = canvas.getContext('2d')
        context.globalAlpha = 0.7;
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
      this.heatmap.data(localdata)
      this.heatmap._max = this.maxv
      this.heatmap.radius(this.radius, this.blur)
      this.heatmap.draw(0.8);
      this.setCanvas()
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