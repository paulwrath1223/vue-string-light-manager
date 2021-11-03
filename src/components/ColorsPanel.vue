<template>
  <div class="container p-5 my-5 border">
    <div class="colorNodes">
      <color-node v-for="(node, i) in colorNodes" :id="i"></color-node>
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
  /*background-color: gray;*/
}

#btn-add{
  width: 60px;
  line-height: 20px;
}
</style>