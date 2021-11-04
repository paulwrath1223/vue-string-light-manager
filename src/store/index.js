import { createStore } from 'vuex'

export default createStore({
  state: {
    // colors: [
    //   {color: "#FF0000", transitionFrames: 0},
    //   {color: "#00FF00", transitionFrames: 1},
    //   {color: "#0000FF", transitionFrames: 2},
    //   {color: "#000000", transitionFrames: 3}
    // ],
    arduinoList: [
      {
        arduinoID: "1358",
        speed: 0.7,
        enabled: false,
        updated: false,
        colors: [
            {color: "#FF0000", transitionFrames: 0},
            {color: "#00FF00", transitionFrames: 1},
            {color: "#0000FF", transitionFrames: 2},
            {color: "#000000", transitionFrames: 3}
        ]
      },
    ],
    currentArduinoID: -1
  },
  getters: {
    getArduinoByID: (state) => (id) =>{
      return state.arduinoList.find(arduino => arduino.arduinoID === id)
    }
  },
  mutations: {
    changeCurrentArduinoID(state, arduino){
      state.currentArduinoID = arduino.id
    },

    //color node variables
    addColor(state){
      state.arduinoList[state.currentArduinoID].colors.push(
          {
            id: state.colors.length,
            color: "#000000",
            transitionFrames: 0
          })
    },
    changeColorOfColorNode(state, colorNode){
      state.arduinoList[state.currentArduinoID].colors[colorNode.id].color = colorNode.color
    },
    changeTransitionFramesOfColorNode(state, colorNode){
      state.arduinoList[state.currentArduinoID].colors[colorNode.id].transitionFrames = colorNode.transitionFrames
    },
    deleteColorNode(state, colorNode){
      state.arduinoList[state.currentArduinoID].colors.slice(colorNode.id, 1)
    }

  },
  actions: {
  },
  modules: {
  }
})
