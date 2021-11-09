<template>
  <div id="app">
    <span>
      User name: {{ localUserName }}
    </span>
    <p v-if="localUserImageUrl"><img style="width:5%" :src="localUserImageUrl" alt=""></p>
    <button name="SignInButton" @click="sign">Sign in</button>
  </div>
</template>

<script>
import {signIn} from "@/main";
import {getCurrentUserImage, getCurrentUserName} from "@/firebase";

export default {
  name: "account-management",
  data(){
    return{
      localUserName: getCurrentUserName(),
      localUserImageUrl: getCurrentUserImage()
    }
  },
  // computed: {
  //   localUserName: {
  //     get(){
  //       return getCurrentUserName();
  //     }
  //   },
  //
  //   localUserImageUrl: {
  //     get(){
  //       return getCurrentUserImage();
  //     }
  //   }
  // },
  methods: {
    async sign() {
      await signIn();
      this.localUserName = getCurrentUserName();
      this.localUserImageUrl = getCurrentUserImage();
    },
    updateLocalUserName()
    {
      this.localUserName = getCurrentUserName();
    },
    updateLocalUserImageUrl()
    {
      this.localUserImageUrl = getCurrentUserImage();
    }
  }
}
</script>

<style scoped>

</style>