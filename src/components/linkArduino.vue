<template>
  <div class="input-group mb-3">
    <span class="input-group-text">Enter UID on controller: </span>
    <input type="number" class="form-control" placeholder="UID"
           v-model="arduinoUID" :disabled="false" @change="updateArduinoUID">
    <img class="checkmarkImg" alt="updated" src="../assets/checkMark.png"
         v-show="true">
  </div>

  <!-- Speed input -->
  <div class="input-group mb-3">
    <span class="input-group-text">Speed: </span>
    <input type="number" class="form-control" placeholder="Speed"
           v-model="localSpeed" :disabled="formDisabled" @change="UpdateSpeed">
    <img class="checkmarkImg" alt="updated" src="../assets/checkMark.png"
         v-show="localSpeed === speed && currentID >= 0">
  </div>
</template>

<script>
import {getOwnerOf} from "@/firebase.js"
export default {
  name: "linkArduino",
  data(){
    return{
      ID: -1,
      arduinoUID: null,
      arduinoOwner: null
    }
  },
  methods: {
    async updateArduinoUID(){
      this.arduinoOwner = await getOwnerOf(this.arduinoUID)
    }
  }
}
</script>

<style scoped>

</style>