<template>
  <div>
    <div class="dropdown">
      <button
          class="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
      >Choose id</button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        <li><a v-for="id in arduinoIDs" class="dropdown-item" href="#">{{id}}</a></li>
      </ul>
    </div>
    <div>
      <b-form-input v-model="text" placeholder="Enter your name"></b-form-input>
      <div class="mt-2">Value: {{ text }}</div>
    </div>
  </div>
</template>

<script>

export default {
  name: "ArduinoProperties",
  data(){
    return{
      text: "ahoj",
      currentID: 0,
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
      }
    }
  }
}
</script>

<style scoped>

</style>