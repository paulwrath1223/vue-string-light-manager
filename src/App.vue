<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <!--  <HelloWorld msg="Welcome to Your Vue.js App"/>-->
  <arduino-properties></arduino-properties>
  <colors-panel></colors-panel>
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
