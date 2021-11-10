<template>
  <img alt="Vue logo" src="./assets/logo.png">

  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarToggler01">
        <a class="navbar-brand" href="#">String Light Manager</a>
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Arduino</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Turn On/Off</a>
          </li>
          <li class="nav-item">
            <a class="nav-link disabled" href="#" tabindex="-1" v-bind:aria-disabled="userLoggedIn">Upload</a>
          </li>
          <li class="nav-item">
            <a class="nav-link disabled" href="#" tabindex="-1" v-bind:aria-disabled="userLoggedIn">Download</a>
          </li>
          <li class="nav-item">
            <a class="nav-link disabled" href="#" tabindex="-1">{{logInPromote}}</a>
          </li>
        </ul>
        <div class="container-fluid me-0" style="width: 150px" v-show="userLoggedIn">
          <img :src="userImage"
               class="rounded-circle"
               height="40"
               width="40">
          Bean Time
        </div>
      </div>
    </div>
  </nav>

  <button name="test" @click="test">test</button>
  <!--  <HelloWorld msg="Welcome to Your Vue.js App"/>-->
  <arduino-properties></arduino-properties>
  <colors-panel v-show="colorPanelVisible"></colors-panel>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import ColorsPanel from "./components/ColorsPanel";
import ArduinoProperties from "./components/ArduinoProperties";
import {testing} from "./main.js";

export default {
  name: 'App',
  components: {
    HelloWorld,
    ColorsPanel,
    ArduinoProperties,
  },
  methods: {
    test() {
      testing()
    }
  },
  computed: {
    colorPanelVisible() {
      return this.$store.state.currentArduinoID >= 0;
    },
    userImage() {
      return "https://lh3.googleusercontent.com/a/AATXAJyUh3h7YPBWTC9nqNgqzkp2o4h6mQWg27w2gF86=s96-c"
    },
    userLoggedIn(){
      return false
    },
    logInPromote(){
      return (this.userLoggedIn) ? "Sign out" : "Log in"
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
