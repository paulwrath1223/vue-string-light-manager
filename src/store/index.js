import { createStore } from 'vuex'

export default createStore({
  state: {
    colors: [
      {color: "#FF0000", transitionFrames: 0},
      {color: "#00FF00", transitionFrames: 1},
      {color: "#0000FF", transitionFrames: 2},
      {color: "#000000", transitionFrames: 3}
    ],
    arduinoList: [
      {arduinoID: "1358", speed: 0.7, on: false, updated: false},
      {arduinoID: "2498", speed: 0.7, on: false, updated: false},
      {arduinoID: "3225", speed: 0.7, on: false, updated: false},
    ]
  },
  getters: {
    arduinoIds(state){
      let ids = []
      for(let i = 0; i < state.arduinoList.length; i++){
        ids.push(state.arduinoList[i].arduinoID)
      }
      return ids
    }
  },
  mutations: {
    addColor(state){
      state.colors.push({id: state.colors.length, color: "#000000", transitionFrames: 0})
    },
    changeColorOfColorNode(state, colorNode){
      state.colors[colorNode.id].color = colorNode.color
    },
    changeTransitionFramesOfColorNode(state, colorNode){
      state.colors[colorNode.id].transitionFrames = colorNode.transitionFrames
    },
    deleteColorNode(){

    }

  },
  actions: {
  },
  modules: {
  }
})
