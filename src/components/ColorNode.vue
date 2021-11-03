<template>
  <div class="card m-3" :style="{backgroundColor: color, color: inverse()}">
    <div class="card-header" >
      color{{id}}: {{color}}
      <button class="btn btn-danger" id="btn-delete" @click=deleteColorNode>x</button>
    </div>
    <div class="card-body">
      <form>
        <div class="mb-1 mt-1">
          <label for="transitionFrames" class="form-label small">Transition Frames:</label>
          <input class="form-control small" id="transitionFrames" type=number v-model=transitionFrames v-on:keyup.enter=inputUpdate>
        </div>
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
</style>