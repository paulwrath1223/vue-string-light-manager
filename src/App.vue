<template>

  <img alt="Vue logo" src="./assets/logo.png">


  <button name="testing" @click="test">test</button>
  <account-management></account-management>
  <!--  <HelloWorld msg="Welcome to Your Vue.js App"/>-->
  <arduino-properties></arduino-properties>
  <colors-panel v-show="this.$store.state.currentArduinoID >= 0"></colors-panel>
</template>

<script>
require("./main");
import HelloWorld from './components/HelloWorld.vue'
import ColorsPanel from "./components/ColorsPanel";
import ArduinoProperties from "./components/ArduinoProperties";
import accountManagement from "./components/accountManagement";
import {testing, userName} from "./main.js";



export default {
  name: 'App',
  components: {
    HelloWorld,
    ColorsPanel,
    ArduinoProperties,
    accountManagement
  },
  methods: {
    test() {
      testing()
    }
  },
  msg: function() {
    return{userName};
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
