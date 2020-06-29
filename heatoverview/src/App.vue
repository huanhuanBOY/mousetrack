<template>
  <div id="app">
    <Heatmap/>
  </div>
</template>

<script>
import Heatmap from './components/heatmapview/Heatmap'

export default {
  name: 'App',
  components: {
    Heatmap
    
  },
  mounted(){

  },
  method:{
    
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}

</style>
