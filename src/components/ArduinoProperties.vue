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

        <div v-show="idInputVisible" class="mt-3">
          <input class="form-control" type="number" placeholder="Input new id" v-model="idInputValue" @keydown.enter="UpdateCurrentID">
        </div>

        <h1 id="currentID" v-show="currentID >= 0">{{currentID}}</h1>
      </div>

      <div class="form-check form-switch">
        Enable
        <input class="form-check-input" type="checkbox" value="yes" checked>
      </div>




      <div class="mb-3">
        <div>Location: {{location}}</div>
        <input type="text" v-model="location" class="form-control">
      </div>

      <div class="mb-3">
        <div>Number of lights: {{numLights}}</div>
        <input type="number" v-model="numLights" class="form-control">
      </div>

      <div class="mb-3">
        <div>Speed: {{speed}}</div>
        <input type="range" v-model="speed" class="form-control" :min="min" :max="max" :disabled="numLights <= 0">
      </div>
    </form>
  </div>
</template>

<script>

export default {
  name: "ArduinoProperties",
  data(){
    return{
      speed: 0,
      numLights: 0,
      currentID: -1,
      idInputValue: 0,
      idInputVisible: false,
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
    min(){
      return -this.numLights
    },
    max(){
      return this.numLights
    }
  },
  methods: {
    IDChosen(id){
      this.currentID = id
      console.log("id clicked: "+id)
    },
    ToggleIdInputVisibility(){
      this.idInputVisible = !this.idInputVisible
      this.currentID = -1
    },
    UpdateCurrentID(){
      this.currentID = this.idInputValue
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

.center{
  margin: 0 auto
}

form{
  max-width: 500px;
}
</style>