<template>
  <div class="card m-3 " :style="{backgroundColor: color}">

    <div class="card-header" >
      <span class="input-group-text" style="max-width: 150px">Color{{id}}: {{color}} </span>
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
            <input type="color" class="form-control-color small" v-model="color" @change=colorChanged>
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
      //localColor: "#000000",
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
  // watch: {
  //   color(newColor, oldColor){
  //     try{
  //       this.localColor = this.color
  //     }catch{
  //       console.log("local color not updated")
  //     }
  //
  //   }
  // },
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
        return this.$store.getters.getColors[this.id].color
      },
      // set(value) {
      //   this.$store.commit('changeColorOfColorNode', {id: this.id, color: value})
      // }
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
    // inverse2(figure){
    //   return  ((figure & 0x000000) | (~figure & 0xFFFFFF))
    // },
    // inverse(){
    //   return "#" + this.inverse2(parseInt(this.color.substr(1), 16))
    //       .toString(16)
    //       .padStart(6, "0")
    //       .toUpperCase();
    // },

    transitionFramesChanged(){
      this.transitionFrames = this.localTransitionFrames
      this.localTransitionFrames = null
    },

    colorChanged(event){
      // this.color = this.localColor
      this.$store.commit('changeColorOfColorNode', {id: this.id, color: event.target.value})
    },

    deleteColorNode(){
      console.log("delted colorNode id: "+ this.id)
      this.$emit('delete')
      //this.$store.commit('deleteColorNode', {id: this.id})
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