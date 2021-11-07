<template>
  <div class="card m-3" :style="{backgroundColor: localColor, color: inverse()}">

    <div class="card-header" >
      color{{id}}: {{color}}
      <button class="btn btn-danger" id="btn-delete" @click=deleteColorNode>x</button>
    </div>

    <div class="card-body">
      <form>
        <!-- Transition frames -->
        <div class="input-group mb-1 input-group-sm" id="my-input">
          <span class="input-group-text">Transition Frames: {{transitionFrames}}</span>
          <input class="form-control" placeholder="Transition frames" type=number v-model=localTransitionFrames v-on:keyup.enter=transitionFramesChanged>
        </div>
        <!-- Color picker -->
        <div class="mt-2">
            <input type="color" class="form-control-color small" v-model="localColor" @change=colorChanged>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "ColorNode",
  data(){
    return{
      localColor: "#000000",
      //color: "#000000",
      localTransitionFrames: null,
    }
  },
  mounted() {
    this.localColor = this.color
    //this.localTransitionFrames = this.transitionFrames
  },
  props:{
    id: Intl,
  },
  computed:{
    // currentID: {
    //   get() {
    //     return this.$store.state.currentArduinoID
    //   },
    //   set(value) {
    //     console.log("Color node can not change currentArduinoID to: " + value)
    //   },
    // }

    color: {
      get() {
        console.log("colorNode id: "+this.id)
        return this.$store.getters.getColors[this.id].color
      },
      set(value) {
        this.$store.commit('changeColorOfColorNode', {id: this.id, color: value})
      }
    },

    transitionFrames: {
      get(){
        return this.$store.getters.getColors[this.id].transitionFrames
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
      return "#" + this.inverse2(parseInt(this.localColor.substr(1), 16))
          .toString(16)
          .padStart(6, "0")
          .toUpperCase();
    },

    transitionFramesChanged(){
      console.log("transitionFrames local: " + this.localTransitionFrames)
      this.transitionFrames = this.localTransitionFrames
      console.log("transitionFrames database: " + this.transitionFrames)
    },

    colorChanged(){
      console.log("color changed to: "+this.localColor)
      this.color = this.localColor
      console.log("color database to: "+this.color)
      // this.$store.commit('changeColorOfColorNode', this.id, this.color)
    },

    deleteColorNode(){
      console.log("color node was deleted")
      // this.$store.commit('deleteColorNode', {id: this.id})
      // console.log(this.$store.arduinoList[this.currentID])
    }

  }
}
</script>

<style scoped>
#btn-delete{
  margin: 0;
  padding: 0;
  line-height: 20px;
  width: 30px;
  position: absolute;
  top: 3px;
  right: 3px;
  /*align-self: flex-end;*/
}

#my-input{
  max-width: 220px;
}
</style>