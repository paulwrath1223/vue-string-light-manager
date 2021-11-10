<template>
  <img alt="Vue logo" src="./assets/logo.png">

  <NavigationBar></NavigationBar>
<!--  <button name="testing" @click="test">test</button>-->
  <account-management></account-management>


  <button name="test" @click="test">test</button>
  <!--  <HelloWorld msg="Welcome to Your Vue.js App"/>-->
  <arduino-properties></arduino-properties>
  <colors-panel v-show="colorPanelVisible"></colors-panel>
</template>

<script>
require("./main");
import HelloWorld from './components/HelloWorld.vue'
import ColorsPanel from "./components/ColorsPanel";
import ArduinoProperties from "./components/ArduinoProperties";
import NavigationBar from "./components/NavigationBar";
import accountManagement from "./components/accountManagement";
import {signIn, testing, userName} from "./main.js";
import {getCurrentUserName} from "./firebase.js"

export let userNameLocal = getCurrentUserName();

export default {
  name: 'App',
  components: {
    HelloWorld,
    ColorsPanel,
    ArduinoProperties,
    NavigationBar,
    accountManagement
  },
  methods: {
    signI() {
      signIn()
    },
    test() {
      testing()
    }
  },
  msg: function() {
    return{userName};
  },

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
