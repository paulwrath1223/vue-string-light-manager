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
            <a class="nav-link" :class="{disabled: !userLoggedIn}" href="#">Upload</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{disabled: !userLoggedIn}" href="#">Download</a>
          </li>
          <li class="nav-item">
            <a class="nav-link"  @click="signInOut" href="#">{{logInPromote}}</a>
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

</template>

<script>

import {userImageUrl} from "@/main";


export default {
  name: "NavigationBar",
  data(){
    return {
      user : {
        loggedIn: true,
        name: "Bean Time",
        image: "https://lh3.googleusercontent.com/a/AATXAJyUh3h7YPBWTC9nqNgqzkp2o4h6mQWg27w2gF86=s96-c"
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
    userImage() {
      return (this.userLoggedIn) ? userImageUrl : null
    },
    userLoggedIn(){
      return this.user.loggedIn
    },
    logInPromote(){
      return (this.userLoggedIn) ? "Sign out" : "Log in"
    },
  },
  methods: {
    signInOut(){
      if(this.userLoggedIn) {
        this.$store.commit("userSignOut")
      }
      else{
        console.log("Logged in")
      }
    }
  }

}
</script>

<style scoped>

</style>