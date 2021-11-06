<template>
  <div class="arduinoProperties mt-0 align-items-center">
    <form class="align-self-center custom-centered">
      <div class="dropdown">
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
          <li class="dropdown-item" @click="ToggleIdInputVisibility" href="#">New id</li>
        </ul>

        <div class="input-group mb-3" v-show="idInputVisible">
          <span class="input-group-text">ID: {{currentID}}</span>
          <input type="number" class="form-control" placeholder="ID" v-model="idInputValue" @keydown.enter="UpdateID">
        </div>

        <h1 id="currentID" v-show="currentID >= 0">{{currentID}}</h1>
      </div>
    </form>

    <div class="form-check form-switch input-group switch" >
      <input class="form-check-input" type="checkbox" :disabled="currentID < 0" :checked="enabled">
      <div class="">Turn on</div>
    </div>

    <form class="align-self-center custom-centered">
      <div class="input-group mb-3">
        <span class="input-group-text">Location: {{location}}</span>
        <input type="text" class="form-control" placeholder="Location" v-model="localLocation" :disabled="currentID < 0" @keydown.enter="UpdateLocation">
      </div>

      <div class="input-group mb-3">
        <span class="input-group-text">Lights count: {{numLights}}</span>
        <input type="number" class="form-control" placeholder="Lights count" v-model="localNumLights" :disabled="currentID < 0" @keydown.enter="UpdateNumLights">
      </div>

      <div class="input-group mb-3">
        <span class="input-group-text">Speed: {{speed}}</span>
        <input type="number" class="form-control" placeholder="Speed" v-model="localSpeed" :disabled="currentID < 0" @keydown.enter="UpdateSpeed">
      </div>

    </form>
  </div>
</template>

<script>

export default {
  name: "ArduinoProperties",
  data(){
    return{
      localSpeed: null,
      localNumLights: null,
      idInputValue: 0,
      idInputVisible: false,
      localLocation: "",
      location: ""
    }
  },
  computed: {
    arduinoIDs: {
      get(){
        let ids = []
        for(let i = 0; i < this.$store.state.arduinoList.length; i++){
          ids.push(this.$store.state.arduinoList[i].arduinoID)
        }
        return ids
      },
      set(value){
        console.log("arduinoList cannot be edited to: "+value)
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
      get: () => {
        return this.$store.state.currentArduinoID < 0;
      },
      set: val => {
        console.log("formDisabled cannot be changed to: " + val)
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
  },
  methods: {
    IDChosen(event, id){
      this.currentID = id
      console.log("Arduino ID: "+ this.$store.getters.getArduinoByID(this.currentID))
      console.log("Arduino index: "+this.$store.getters.getArduinoIndex)

    },
    ToggleIdInputVisibility(){
      this.idInputVisible = !this.idInputVisible
      this.currentID = -1
    },
    UpdateID(){
      this.currentID = this.idInputValue
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
  width: 100px;
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