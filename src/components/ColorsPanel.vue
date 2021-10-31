<template>
  <div>
    <div class="colorNodes">
      <color-node v-for="(node, i) in colorNodes" :id="i"></color-node>
    </div>
    <button @click="addColorNode">Add</button>
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
    colorNodes(){
      return this.$store.state.colors
    }
  },
  methods: {
    addColorNode(){
      this.$store.commit('addColor')
      for(let i = 0; i < this.colorNodes.length; i++){
        console.log(`Id: ${i}, color: ${this.colorNodes[i].color}, transitionFrames: ${this.colorNodes[i].transitionFrames}`)
      }
    }
  }
}
</script>

<style scoped>
.colorNodes{
  display: flex;
  flex-wrap: wrap;
  background-color: gray;
}
</style>