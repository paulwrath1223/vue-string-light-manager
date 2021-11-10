<template>
  <div class="arduinoProperties mt-0 align-items-center">
    <form class="align-self-center custom-centered">
      <!-- Dropdown -->
      <div class="dropdown">
        <button name="deleteArdButton" @click="localDeleteArduino(currentID)">delete ID</button>
        <button
            class="btn btn-primary dropdown-toggle"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
        >Choose id</button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          <li><h5 class="dropdown-header">Choose id from database</h5></li>
          <li><a v-for="id in arduinoIDs" class="dropdown-item" href="#" @click="IDChosen($event, id); this.idInputVisible=false">{{id}}</a></li>
          <li><h5 class="dropdown-header">Create a new id</h5></li>
<!--          @click="newArd"-->
          <li class="dropdown-item" @click="ToggleIdInputVisibility" href="#">New id</li>
        </ul>

        <!-- New id input -->
        <div class="input-group my-3" v-show="idInputVisible">
          <span class="input-group-text">ID: {{currentID}}</span>
          <input type="number" class="form-control" placeholder="ID" v-model="idInputValue" @keydown.enter="UpdateID">
        </div>

        <h1 id="currentID" v-show="currentID >= 0">{{currentID}}</h1>
      </div>
    </form>

    <!-- Enabled toggle switch -->
    <div class="form-check form-switch mx-auto" style="width: 70px">
      <input class="form-check-input" type="checkbox" :disabled="formDisabled" :checked="enabled">
      <label class="form-check-label mx-2" id="enabledSwitchLabel" >Enabled</label>
    </div>

    <form class="align-self-center custom-centered">
      <!-- Location switch -->
      <div class="input-group mb-3">
        <span class="input-group-text">Location: {{location}}</span>
        <input type="text" class="form-control" placeholder="Location" v-model="localLocation" :disabled="formDisabled" @keydown.enter="UpdateLocation">
      </div>

      <!-- Lights count input -->
      <div class="input-group mb-3">
        <span class="input-group-text">Lights count: {{numLights}}</span>
        <input type="number" class="form-control" placeholder="Lights count" v-model="localNumLights" :disabled="formDisabled" @keydown.enter="UpdateNumLights">
      </div>

      <!-- Speed input -->
      <div class="input-group mb-3">
        <span class="input-group-text">Speed: {{speed}}</span>
        <input type="number" class="form-control" placeholder="Speed" v-model="localSpeed" :disabled="formDisabled" @keydown.enter="UpdateSpeed">
      </div>

      <!-- Mirror index input -->
      <div class="input-group mb-3">
        <span class="input-group-text">Mirror index: {{mirrorIndex}}</span>
        <input type="number" class="form-control" placeholder="Mirror index" v-model="localMirrorIndex" :disabled="formDisabled" @keydown.enter="UpdateMirrorIndex">
      </div>
    </form>
  </div>
</template>

<script>

import {deleteArduino, getExistingIds} from "@/firebase";

export default {
  name: "ArduinoProperties",
  data(){
    return{
      localSpeed: null,
      localNumLights: null,
      idInputValue: 0,
      idInputVisible: false,
      localLocation: "",
      localMirrorIndex: null
      //location: ""
    }
  },
  computed: {
    arduinoIDs: {
      get() {
        let ids = [];
        for(let i = 0; i < this.$store.state.arduinoList.length; i++){
          ids.push(this.$store.state.arduinoList[i].arduinoID);
        }
        console.log("ids list");
        console.log(ids);

        // return await getExistingIds();
        return ids;
      },
      set(value){
        console.log("arduinoIdsList cannot be edited to: "+value)
      },
    },

    currentID: {
      get(){
        return this.$store.state.currentArduinoID
      },
      set(value){
        this.$store.commit('changeCurrentArduinoID', {id: value})
      }
    },
    formDisabled: {
      get(){
        return this.currentID < 0
      }
    },

    speed: {
      get(){
        return (this.$store.state.currentArduinoID < 0) ? 0 : this.$store.getters.getSpeedByArduinoID
      },
      set(val) {
        this.$store.commit('changeSpeedOfCurrentArduinoID', {speed: val})
      }
    },

    numLights: {
      get(){
        return (this.$store.state.currentArduinoID < 0) ? 0 : this.$store.getters.getLightsCountByArduinoID
      },
      set(val) {
        this.$store.commit('changeLightsCountOfCurrentArduinoID', {lightsCount: val})
      }
    },

    location: {
      get(){
        return (this.$store.state.currentArduinoID < 0) ? 0 : this.$store.getters.getLocationByArduinoID
      },
      set(val) {
        this.$store.commit('changeLocationOfCurrentArduinoID', {location: val})
      }
    },

    enabled: {
      get(){
        return (this.$store.state.currentArduinoID < 0) ? 0 : this.$store.getters.getEnabledByArduinoID
      },
      set(val) {
        this.$store.commit('changeEnabledOfCurrentArduinoID', {enabled: val})
      }
    },

    mirrorIndex: {
      get(){
        return (this.formDisabled) ? null : this.$store.getters.getMirrorIndex
      },
      set(val) {
        this.$store.commit('changeMirrorIndexOfCurrentArduinoID', {mirrorIndex: val})
      }
    }
  },
  methods: {
    newArd()
    {

    },
    async localDeleteArduino(id)
    {
      console.log("function: localDeleteArduino\nID: " + id);
      await deleteArduino(id);
      this.currentID = null;
    },
    IDChosen(event, id){
      this.currentID = id
    },
    ToggleIdInputVisibility(){
      this.idInputVisible = !this.idInputVisible
      this.currentID = -1
    },
    UpdateID(){
      this.currentID = this.idInputValue
      console.log("function: UpdateID\nNew ID: ");
      console.log(this.currentID);
      if(this.$store.getters.getArduinoByID(this.currentID) == undefined){
        console.log("This id is free");
        this.$store.commit('addArduino');
      }
      console.log("This id exists");
    },
    UpdateLocation(){
      this.location = this.localLocation
      this.localLocation = null
    },
    UpdateNumLights(){
      this.numLights = this.localNumLights
      this.localNumLights = null
    },
    UpdateSpeed(){
      this.speed = this.localSpeed
      this.localSpeed = null
    },
    UpdateMirrorIndex(){
      this.mirrorIndex = this.localMirrorIndex
      this.localMirrorIndex = null
    }
  }
}
</script>

<style scoped>
.custom-centered{
  margin:0 auto;
  max-width: 500px;
}
.switch{
  width: 60px;
  margin: 0 auto;
  align-self: center;
}
.arduinoProperties{
  padding: 20px;
}

/*.form-check{*/
/*  padding: 20px;*/
/*}*/

#currentID{
  padding-top: 20px;

}
</style>