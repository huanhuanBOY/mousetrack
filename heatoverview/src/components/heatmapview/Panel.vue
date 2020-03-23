<template>
  <div class="panelcontainer">
    <toggle-switch
      @change="ChangeMode($event.value)"
      :options="switchOptions"
      :disabled="false"
    /> 
    <div class="panel">
      <range-slider
      class="slider"
      min="5"
      max="100"
      step="5"
      @change="valueChange"
      v-model="moveConfig.maxv">
      </range-slider>
      <span>Max</span>
      <range-slider
      class="slider"
      min="1"
      max="50"
      step="1"
      @change="valueChange"
      v-model="moveConfig.radius">
      </range-slider>
      <span>Radius</span>
      <range-slider
      class="slider"
      min="1"
      max="100"
      step="1"
      @change="valueChange"
      v-model="moveConfig.blur">
      </range-slider>
      <span>Blur</span>
    </div>
  </div>
</template>

<script>
import RangeSlider from 'vue-range-slider'
import 'vue-range-slider/dist/vue-range-slider.css'
import DataService from "../../services/dataserve.js"
import * as empty from '../../assets/lib/simpleheat'
import ToggleSwitch from 'vuejs-toggle-switch'

export default {
  name: 'Panel',
  data () {
    return {
      switchOptions: {
        layout: {
          color: 'black',
          backgroundColor: 'lightgray',
          selectedColor: 'white',
          selectedBackgroundColor: 'green',
          borderColor: 'black',
          fontFamily: 'Arial',
          fontWeight: 'normal',
          fontWeightSelected: 'bold',
          squareCorners: false,
          noBorder: false
        },
        size: {
          fontSize: 1.5,
          height: 2.5,
          padding: 0.5,
          width: 20
        },
        items: {
          delay: .2,
          preSelected: 'unknown',
          disabled: false,
          labels: [
            {name: 'move', color: 'white', backgroundColor: 'red'}, 
            {name: 'click', color: 'white', backgroundColor: 'green'},
            {name: 'wheel', color: 'white', backgroundColor: 'blue'}, 
          ]
        }
      },
      modename: 'move',
      moveConfig:{
        blur:1,
        radius:1,
        maxv: 5,
      },
      clickConfig:{

      },
      wheelConfig:{

      }
    }
  },
  components: {
    RangeSlider,
    ToggleSwitch
  },
  mounted(){

    // Object.getPrototypeOf(DataService).get_json_data.call(this, 'dataProcess', "discourse")
  },
  methods:{
    valueChange(name){
      this.$emit("configchange", {mode: this.modename, move: this.moveConfig, click: this.clickConfig, wheel: this.wheelConfig})
    },
    ChangeMode(data){
      this.modename = data
    }
  }
}
// --数据--， ---算法---， 目的， 研究技术
</script>

<style scoped>
.slider {
  width: 300px;
  margin-left: 20px;
}
.panel{
  display: grid;
  width: 350px;
}
.panelcontainer{
border-left: 2px solid #e1e4e8;
}
</style>
