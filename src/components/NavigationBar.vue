<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarToggler01">
          <a class="navbar-brand" href="#">String Light Manager</a>
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
  <!--          <li class="nav-item" v-show="user.loggedIn">-->
  <!--            <a class="nav-link active" aria-current="page" href="#">Arduino</a>-->
  <!--          </li>-->
  <!--          <li class="nav-item" v-show="user.loggedIn">-->
  <!--            <a class="nav-link" href="#">Turn On/Off</a>-->
  <!--          </li>-->
            <li class="nav-item" v-show="user.loggedIn">
              <a class="nav-link"  @click="showUID" :class="{disabled: !user.loggedIn}" href="#">Get UID</a>
            </li>
            <li class="nav-item" v-show="user.loggedIn">
              <a class="nav-link"  @click="uploadArduino" :class="{disabled: !user.loggedIn}" href="#">Upload</a>
            </li>
            <li class="nav-item" v-show="user.loggedIn">
              <a class="nav-link"  @click="reloadArds" :class="{disabled: !user.loggedIn}" href="#">Download</a>
            </li>
            <li class="nav-item" v-show="user.loggedIn">
              <a class="nav-link"  @click="deleteArduino" :class="{disabled: !user.loggedIn}" href="#">Delete</a>
            </li>
            <li class="nav-item" v-show="user.loggedIn">
              <a class="nav-link"  @click="claimUID" :class="{disabled: !user.loggedIn}" href="#">{{linkMode ? "Configure" : "Add controller"}}</a>
            </li>
            <li class="nav-item" v-show="!user.loggedIn">
              <a class="nav-link"  @click="sign" href="#">sign in</a>
            </li>
          </ul>
          <div class="container-fluid me-0" style="width: 200px" v-show="user.loggedIn">
            {{ user.name }}
            <img :src="user.image"
                 class="rounded-circle"
                 height="40"
                 width="40"
                 alt = "profile picture"
            >

          </div>
        </div>
      </div>
    </nav>
    <ArduinoProperties v-show="showArduinoProperties" ref = "arduinoProperties"/>
  </div>
</template>

<script>

import {signIn} from "@/main";
import {downloadAllArds, getCurrentUserImage, getCurrentUserName, getUID} from "@/firebase";
import ArduinoProperties from "@/components/ArduinoProperties";


export default {
  name: "NavigationBar",
  components: {
    ArduinoProperties,
  },
  data(){
    return {
      linkMode : false,
      user : {
        loggedIn: (getCurrentUserName() != null),
        name: getCurrentUserName(),
        image: getCurrentUserImage()
      },
    }
  },
  computed: {
    // user: {
    //   get(){
    //     console.log(this.$store.state.user)
    //     return this.$store.state.user
    //   },
    //   set(){
    //     console.log("User changed") //todo
    //   }
    // },
    showArduinoProperties() {
      return !this.linkMode
    }

    // logInPromote(){
    //   return (this.user.loggedIn) ? "Change account" : "Log in"
    // }
  },
  methods: {
    async deleteArduino()
    {
      await this.$refs.arduinoProperties.localDeleteArduino();
      await this.reloadArds();
    },
    async reloadArds()
    {
      console.log("reloading arduinos");
      this.$store.commit('changeDatabase', await downloadAllArds());
      this.$refs.arduinoProperties.resetID();
      alert("arduinos reloaded");
    },
    async sign() {
      console.log("sign in button");
      await signIn();

      this.user.name = getCurrentUserName();
      this.user.image = getCurrentUserImage();
      this.user.loggedIn = (getCurrentUserName() != null);
      console.log("new user name: " + (this.user.name));
      console.log("this.userLoggedIn: " + (this.user.loggedIn));
      this.$store.commit('changeDatabase', await downloadAllArds());
    },
    claimUID()
    {
      this.linkMode = !this.linkMode;
    },
    async uploadArduino()
    {
      await this.$refs.arduinoProperties.uploadArduinoFromAP();
    },
    showUID()
    {
      alert("this is used in the code for the esp8266:\n\n" + getUID())
    }

  }
}
</script>

<style scoped>

</style>