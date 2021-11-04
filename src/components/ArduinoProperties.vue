<template>
  <div class="arduinoProperties mt-0">
    <form class="align-self-center center" >
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
          <li><a v-for="id in arduinoIDs" class="dropdown-item" href="#" @click="IDChosen(id); this.idInputVisible=false">{{id}}</a></li>
          <li><h5 class="dropdown-header">Create a new id</h5></li>
          <li class="dropdown-item" @click="ToggleIdInputVisibility" href="#">New id</li>
        </ul>

        <div class="input-group mb-3" v-show="idInputVisible">
          <span class="input-group-text">ID: {{currentID}}</span>
          <input type="number" class="form-control" placeholder="ID" v-model="idInputValue" @keydown.enter="UpdateID">
        </div>

        <h1 id="currentID" v-show="currentID >= 0">{{currentID}}</h1>
      </div>

      <div class="form-check form-switch" >
        <input id="switch" class="form-check-input pull-left" type="checkbox" value="yes" checked>
        <div>Turn on</div>
      </div>

      <div class="input-group mb-3">
        <span class="input-group-text">Location: {{location}}</span>
        <input type="text" class="form-control" placeholder="Location" v-model="localLocation" @keydown.enter="UpdateLocation">
      </div>

      <div class="input-group mb-3">
        <span class="input-group-text">Lights count: {{numLights}}</span>
        <input type="number" class="form-control" placeholder="Lights count" v-model="localNumLights" @keydown.enter="UpdateNumLights">
      </div>

      <div class="input-group mb-3">
        <span class="input-group-text">Speed: {{speed}}</span>
        <input type="number" class="form-control" placeholder="Speed" v-model="localSpeed" @keydown.enter="UpdateSpeed">
      </div>

    </form>
  </div>
</template>

<script>

export default {
  name: "ArduinoProperties",
  data(){
    return{
      localSpeed: 0,
      speed: 0,
      localNumLights: 0,
      numLights: 0,
      idInputValue: 0,
      idInputVisible: false,
      localLocation: "None",
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
        console.log("adruinoList cannot be edited to: "+value)
      },
    },

    currentID: {
      get(){
        return this.$store.state.currentArduinoID
      },
      set(value){
        this.$store.commit('changeCurrentArduinoID', {id: value})
      }
    }
  },
  methods: {
    IDChosen(id){
      this.currentID = id
      console.log("id clicked: "+id)
      console.log(this.$store.getters.getArduinoByID(this.currentID))
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
    },
    UpdateNumLights(){
      this.numLights = this.localNumLights
    },
    UpdateSpeed(){
      this.speed = this.localSpeed
    }
  }
}
</script>

<style scoped>
.arduinoProperties{
  padding: 20px;
}

.form-check{
  padding: 20px;
}

#currentID{
  padding-top: 20px;

}

#switch{
  position: absolute;
  left: 45%;
}

.center{
  margin: 0 auto
}

form{
  max-width: 500px;
}
</style>