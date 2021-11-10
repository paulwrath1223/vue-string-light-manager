import { createStore } from 'vuex'

export default createStore({
  state: {
    user : {
      loggedIn: true,
      name: "Bean Time",
      image: "https://lh3.googleusercontent.com/a/AATXAJyUh3h7YPBWTC9nqNgqzkp2o4h6mQWg27w2gF86=s96-c"
    },
    currentArduinoID: -1,
    arduinoList: [
      {
        arduinoID: "1358",
        speed: 0.7,
        location: "Door Arch",
        lightsCount: 100,
        mirrorIndex: null,
        enabled: true,
        // updated: false,
        colors: [
            {color: "#FF0000", transitionFrames: 0},
            {color: "#00FF00", transitionFrames: 1},
            {color: "#0000FF", transitionFrames: 2},
            {color: "#000000", transitionFrames: 3}
        ]
      },
      {
        arduinoID: "6532",
        speed: 2,
        location: "Hand Rail",
        lightsCount: 50,
        mirrorIndex: 34,
        enabled: false,
        // updated: false,
        colors: [
          {color: "#AF2345", transitionFrames: 8},
          {color: "#234A46", transitionFrames: 7},
          {color: "#11123F", transitionFrames: 6},
          {color: "#23AB3E", transitionFrames: 5}
        ]
      },
    ],
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
    getMirrorIndex: (state, getters) => {
      return state.arduinoList[getters.getArduinoIndex].mirrorIndex
    },
    getColors: (state, getters) => {
      return state.arduinoList[getters.getArduinoIndex].colors
    },
  },

  mutations: {
    //navbar properties
    userSignOut(state){
      state.user = {
        loggedIn: false,
        name: null,
        image: null
      }
    },
    //arduino properties
    addArduino(state){
      state.arduinoList.push({
        arduinoID: this.currentArduinoID,
        speed: null,
        location: null,
        lightsCount: null,
        mirrorIndex: 0,
        enabled: false,
        // updated: false,
        colors: [
          {color: "#000000", transitionFrames: 0},
        ]
      })
    },
    changeCurrentArduinoID(state, arduino){
      state.currentArduinoID = arduino.id
    },
    changeSpeedOfCurrentArduinoID(state, arduino){
      let index = state.arduinoList.indexOf(state.arduinoList.find(arduino => arduino.arduinoID === state.currentArduinoID))
      state.arduinoList[index].speed = arduino.speed
    },
    changeLocationOfCurrentArduinoID(state, arduino){
      let index = state.arduinoList.indexOf(state.arduinoList.find(arduino => arduino.arduinoID === state.currentArduinoID))
      state.arduinoList[index].location = arduino.location
    },
    changeLightsCountOfCurrentArduinoID(state, arduino){
      let index = state.arduinoList.indexOf(state.arduinoList.find(arduino => arduino.arduinoID === state.currentArduinoID))
      state.arduinoList[index].lightsCount = arduino.lightsCount
    },
    changeEnabledOfCurrentArduinoID(state, arduino){
      let index = state.arduinoList.indexOf(state.arduinoList.find(arduino => arduino.arduinoID === state.currentArduinoID))
      state.arduinoList[index].enabled = arduino.enabled
    },
    changeMirrorIndexOfCurrentArduinoID(state, arduino){
      let index = state.arduinoList.indexOf(state.arduinoList.find(arduino => arduino.arduinoID === state.currentArduinoID))
      state.arduinoList[index].mirrorIndex = arduino.mirrorIndex
    },

    //color node variables
    addColor(state){
      let index = state.arduinoList.indexOf(state.arduinoList.find(arduino => arduino.arduinoID === state.currentArduinoID))
      state.arduinoList[index].colors.push(
          {
            color: "#000000",
            transitionFrames: 0
          })
    },
    changeColorOfColorNode(state, colorNode){
      let index = state.arduinoList.indexOf(state.arduinoList.find(arduino => arduino.arduinoID === state.currentArduinoID))
      state.arduinoList[index].colors[colorNode.id].color = colorNode.color
    },
    changeTransitionFramesOfColorNode(state, colorNode){
      let index = state.arduinoList.indexOf(state.arduinoList.find(arduino => arduino.arduinoID === state.currentArduinoID))
      state.arduinoList[index].colors[colorNode.id].transitionFrames = colorNode.transitionFrames
    },
    // deleteColorNode(state, colorNode){
    //   let index = state.arduinoList.indexOf(state.arduinoList.find(arduino => arduino.arduinoID === state.currentArduinoID))
    //   state.arduinoList[index].colors.splice(colorNode.id, 1)
    // }
    deleteColorNode: (state, colorNode) => {
      let index = state.arduinoList.indexOf(state.arduinoList.find(arduino => arduino.arduinoID === state.currentArduinoID))
      state.arduinoList[index].colors.splice(colorNode.id, 1);
    }
  },
  actions: {

  },
  modules: {
  }
})
