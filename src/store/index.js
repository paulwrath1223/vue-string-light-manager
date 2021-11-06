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
        location: "Door Arch",
        lightsCount: 100,
        enabled: true,
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
    },
    getArduinoIndex: (state, getters) => {
      return state.arduinoList.indexOf(getters.getArduinoByID(state.currentArduinoID))
      //return state.arduinoList.find(arduino => arduino.arduinoID === state.currentArduinoID).speed
      //return getters.getArduinoByID.speed
    },
    getSpeedByArduinoID(state, getters){
      return state.arduinoList[getters.getArduinoIndex].speed
    },
    getLightsCountByArduinoID(state, getters){
      return state.arduinoList[getters.getArduinoIndex].lightsCount
    },
    getLocationByArduinoID(state, getters){
      return state.arduinoList[getters.getArduinoIndex].location
    },
    getEnabledByArduinoID(state, getters){
      return state.arduinoList[getters.getArduinoIndex].enabled
    },
  },

  mutations: {

    //arduino properties
    changeCurrentArduinoID(state, getters, arduino){
      state.currentArduinoID = arduino.id
    },
    changeSpeedOfCurrentArduinoID(state, arduino){
      state.arduinoList[state.currentArduinoID].speed = arduino.speed
    },
    changeLocationOfCurrentArduinoID(state, arduino){
      state.arduinoList[state.currentArduinoID].location = arduino.location
    },
    changeLightsCountOfCurrentArduinoID(state, arduino){
      state.arduinoList[state.currentArduinoID].lightsCount = arduino.lightsCount
    },
    changeEnabledOfCurrentArduinoID(state, arduino){
      state.arduinoList[state.currentArduinoID].enabled = arduino.enabled
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
