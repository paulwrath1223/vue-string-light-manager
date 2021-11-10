<template>
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
            <a class="nav-link" :class="{disabled: !user.loggedIn}" href="#">Upload</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{disabled: !user.loggedIn}" href="#">Download</a>
          </li>
          <li class="nav-item">
            <a class="nav-link"  @click="sign" href="#">{{logInPromote}}</a>
          </li>
        </ul>
        <div class="container-fluid me-0" style="width: 150px" v-show="user.loggedIn">
          <img :src="user.image"
               class="rounded-circle"
               height="40"
               width="40"
               alt = "profile picture"
          >
          {{ user.name }}
        </div>
      </div>
    </div>
  </nav>

</template>

<script>

import {signIn} from "@/main";
import {getCurrentUserImage, getCurrentUserName} from "@/firebase";


export default {
  name: "NavigationBar",
  data(){
    return {
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
    userLoggedIn(){
      console.log("getCurrentUserName() != null: " + (getCurrentUserName() != null));
      return (getCurrentUserName() != null)
    },
    logInPromote(){
      return (this.user.loggedIn) ? "Change account" : "Log in"
    }
  },
  methods: {
    async sign() {
      console.log("sign in button");
      await signIn();

      this.user.name = getCurrentUserName();
      this.user.image = getCurrentUserImage();
      this.user.loggedIn = (getCurrentUserName() != null)
      console.log("new user name: " + (this.user.name));
      console.log("this.userLoggedIn: " + (this.user.loggedIn));
    }
  }
}
</script>

<style scoped>

</style>