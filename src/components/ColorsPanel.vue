<template>
  <div class="container p-5 my-5 border">
    <div class="colorNodes">
      <color-node
          v-for="(node, i) in colorNodes"
          :id="i"
          v-on:delete="deleteColorNode(i)"
      >
      </color-node>
    </div>
    <button id="btn-add" class="btn btn-info" @click="addColorNode">+</button>
  </div>
</template>

<script>
import ColorNode from "../components/ColorNode";

export default {
  name: "ColorsPanel",
  components: {
    ColorNode
  },
  computed: {
    currentID: {
      get() {
        return this.$store.state.currentArduinoID
      },
      set(value) {
        console.log("Colors panel can not change database.CurrentArduinoID to: " + value)
      },
    },

    colorNodes:{
      get(){
        return (this.$store.state.currentArduinoID < 0) ? [] : this.$store.getters.getColors
      },
      set(value){
        console.log("colors cannot be changed to: " + value)
      }
    },

    // colorNodesCount(){
    //   return this.colorNodes.length
    // }
  },
  methods: {
    addColorNode(){
      this.$store.commit('addColor')
      for(let i = 0; i < this.colorNodes.length; i++){
        console.log(`Id: ${i}, color: ${this.colorNodes[i].color}, transitionFrames: ${this.colorNodes[i].transitionFrames}`)
      }
    },
    updateColorsOfColorNodes(){

    },
    deleteColorNode(index){
      console.log("successful emit, index: "+index)
      this.$store.commit('deleteColorNode', {id: index})
    }
  }
}
</script>

<style scoped>
.colorNodes{
  display: flex;
  flex-wrap: wrap;
  /*background-color: gray;*/
}

#btn-add{
  width: 60px;
  line-height: 20px;
}
</style>