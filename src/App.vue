<template>
  <img alt="logo" src="./assets/logo.png" style="width: 40%; max-width: 150px">
  <navigation-bar></navigation-bar>
</template>
<script>
require("./main");
import HelloWorld from './components/HelloWorld.vue'
import ColorsPanel from "./components/ColorsPanel";
import ArduinoProperties from "./components/ArduinoProperties";
import NavigationBar from "./components/NavigationBar";
import accountManagement from "./components/accountManagement";

export default {
  name: 'App',
  components: {
    HelloWorld,
    ColorsPanel,
    ArduinoProperties,
    NavigationBar,
    accountManagement
  },
  // methods: {
  //   test() {
  //     testing()
  //   }
  // },


  computed: {
    colorPanelVisible() {
      return this.$store.state.currentArduinoID >= 0;
    },
  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
