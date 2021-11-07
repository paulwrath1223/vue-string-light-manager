<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <!--  <HelloWorld msg="Welcome to Your Vue.js App"/>-->
  <arduino-properties></arduino-properties>
  <colors-panel v-show="this.$store.state.currentArduinoID >= 0"></colors-panel>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import ColorsPanel from "./components/ColorsPanel";
import ArduinoProperties from "./components/ArduinoProperties";

export default {
  name: 'App',
  components: {
    HelloWorld,
    ColorsPanel,
    ArduinoProperties,
  },
  computed: {
    colorPanelVisible: {
      get: () => {
        return this.$store.state.currentArduinoID < 0;
      },
      set: val => {
        console.log("formDisabled cannot be changed to: " + val)
      }
    }
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
