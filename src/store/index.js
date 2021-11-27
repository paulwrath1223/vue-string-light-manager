import { createStore } from 'vuex'
import {getCurrentUserImage, getCurrentUserName} from "@/firebase";


export default createStore({
  state: {
    user : {
      loggedIn: (getCurrentUserName() != null),
      name: getCurrentUserName(),
      image: getCurrentUserImage()
    },
    currentArduinoID: -1,
    arduinoList: []
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
    getWaveModeByArduinoID(state, getters){
      return state.arduinoList[getters.getArduinoIndex].waveMode
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
    getBrightnessByArduinoID(state, getters){
      return state.arduinoList[getters.getArduinoIndex].brightness
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
    //arduino properties
    addArduino(state, id){
      state.arduinoList.push({
        arduinoID: id,
        speed: null,
        location: null,
        lightsCount: null,
        mirrorIndex: 0,
        enabled: false,
        waveMode: true,
        brightness: 100,
        // updated: false,
        colors: [
          {color: "#ffffff", transitionFrames: 1},
        ]
      })
    },
    changeDatabase(state, vArdList)
    {
      state.arduinoList = vArdList;
      console.log("vArdList: ");
      console.log(state.arduinoList);
    },
    changeCurrentArduinoID(state, arduino){
      state.currentArduinoID = arduino.id
    },
    changeSpeedOfCurrentArduinoID(state, arduino){
      let index = state.arduinoList.indexOf(state.arduinoList.find(arduino => arduino.arduinoID === state.currentArduinoID))
      state.arduinoList[index].speed = arduino.speed
    },
    changeWaveModeOfCurrentArduinoID(state, arduino){
      let index = state.arduinoList.indexOf(state.arduinoList.find(arduino => arduino.arduinoID === state.currentArduinoID));
      state.arduinoList[index].waveMode = arduino.waveMode;
    },
    changeBrightnessOfCurrentArduinoID(state, arduino){
      let index = state.arduinoList.indexOf(state.arduinoList.find(arduino => arduino.arduinoID === state.currentArduinoID));
      state.arduinoList[index].brightness = arduino.brightness;
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
            color: "#ffffff",
            transitionFrames: 1
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
