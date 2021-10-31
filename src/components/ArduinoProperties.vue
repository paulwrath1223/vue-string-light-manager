<template>
  <div>
    <div>
      <span>Arduino ID:</span>
      <input type="text" :list="arduinoIDs">
        <datalist id="arduinoIDs">
          <option v-for="id in arduinoIDs" v-bind:value="id"></option>
        </datalist>
    </div>
  </div>
</template>

<script>

export default {
  name: "ArduinoProperties",
  computed: {
    arduinoIDs: {
      get(){
        return this.$store.getters.arduinoIDs
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