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
    }
  },
  components: {
    Panel
  },
  mounted(){
    // this.dataProcess(this.localdata)
    Object.getPrototypeOf(DataService).get_json_data.call(this, 'dataProcess', "cache/211fu")
  },
  methods:{
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
      
      let localdata = data.map(item => {
        return [item["x"], item["y"], 1, item["time"], item["clientX"], item["clientY"]]
      })
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
      // this.setCanvas()
      this.addrecord(0)
    },

    addrecord(index){
      let that = this
      if(index >= this.localdata.length-1){
        return;
      }
       console.log(index)
      setTimeout(function(){
        that.heatmap.add(that.localdata[index])
        
        // if((window.scrollY + window.outerHeight) < document.getElementById("id_mouse").style.top){
        //   window.scrollTo(0, window.scrollY + that.localdata[index][1] - that.localdata[index-1][1]);
        // }else if(index > 0 && Math.abs(that.localdata[index][4] - that.localdata[index-1][4])<10 && Math.abs(that.localdata[index][5] - that.localdata[index-1][5])<10){
        //   window.scrollTo(0, window.scrollY + that.localdata[index][1] - that.localdata[index-1][1]);
        // }
        window.scrollTo(that.localdata[index][0] - that.localdata[index][3], that.localdata[index][1] - that.localdata[index][4]);
        document.getElementById("id_mouse").style.top = that.localdata[index][1] + "px"
        document.getElementById("id_mouse").style.left = that.localdata[index][0] +  "px"
        that.heatmap.draw();
        that.addrecord(index+1)
      }, (that.localdata[index+1][3] - that.localdata[index][3])/200)
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