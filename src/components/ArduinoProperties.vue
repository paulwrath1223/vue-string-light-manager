<template>
  <div class="arduinoProperties">
    <div class="dropdown">
      <button
          class="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
      >Choose id</button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        <li><a v-for="id in arduinoIDs" class="dropdown-item" href="#" @click="IDChosen(id)">{{id}}</a></li>
      </ul>
      <div id="currentID" v-if="currentID >= 0" class="badge bg-primary">{{currentID}}</div>
    </div>

    <div class="form-check form-check-inline">
      <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1">
      <label class="form-check-label" for="inlineCheckbox1">Turned on</label>
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
</style>