<template>
  <div class = "colorNode" :style="{backgroundColor: color, color: inverse()}" > <!-- color: inverse()-->
    <div class="up">
      <div>
        <span>Transition Frames: </span>
        <input type=number v-model=transitionFrames v-on:keyup.enter=inputUpdate>
      </div>
      <button @click=deleteColorNode>-</button>
    </div>
    <div class="down">
      <span>Change color: </span>
      <input id="colorPicker" type=color v-model="color" @change=colorChanged>
    </div>
  </div>
<!--  <div>Id: {{id}}</div>-->
</template>

<script>
export default {
  name: "ColorNode",
  data(){
    return{
      // color: "#000000",
      // transitionFrames: 0,
    }
  },
  props:{
    id: Intl
  },
  computed:{
    color: {
      get() {
        console.log("id: "+this.id)
        return this.$store.state.colors[this.id].color
      },
      set(value) {
        this.$store.commit('changeColorOfColorNode', {id: this.id, color: value})
      }

    },
    transitionFrames: {
      get(){
        return this.$store.state.colors[this.id].transitionFrames
      },
      set(value){
        this.$store.commit('changeTransitionFramesOfColorNode', {id: this.id, transitionFrames: value})
      }
    }
  },
  methods:
  {
    inverse2(figure){
      return  ((figure & 0x000000) | (~figure & 0xFFFFFF))
    },
    inverse(){
      let inversedColor = "#" + this.inverse2(parseInt(this.color.substr(1), 16))
          .toString(16)
          .padStart(6, "0")
          .toUpperCase();
      return inversedColor
    },

    inputUpdate(){
      console.log("input updated to: ")
    },

    colorChanged(){
      console.log("color changed to: "+this.color)
      // this.$store.commit('changeColorOfColorNode', this.id, this.color)
    },

    deleteColorNode(){
      console.log("color node was deleted")
    }

  },

}
</script>

<style scoped>
.colorNode{
  border-color: green;
  border-width: 2px;
  border-radius: 10%;
  /*background-color: var(color);*/
  width: 300px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 20px;
}
.up{
  margin: 5px;
  display: flex;
  justify-content: space-between;
  background-color: inherit;
  color: inherit;
}
.down{
  margin: 5px;
  display: flex;
  justify-content: center;
  background-color: inherit;
  color: inherit;
}
span{
  margin: 10px;
  mix-blend-mode: difference;

}
button{
  height: 20px;
  width: 25px;
  border-radius: 15%;
  background-color: inherit;
  color: inherit;
  text-align: center;
  border: 4px white;
  margin: 5px;
}
button:hover{
  border: 5px white;
  color: yellow;
  cursor: pointer;
}
input{
  border-radius: 5px;
}
</style>