<template>
  <div class="arduinoProperties mt-0 align-items-center">
    <form class="align-self-center custom-centered">
<!--      <button name="deleteArdButton" @click="localDeleteArduino(currentID)">delete ID</button>-->
      <!-- Dropdown -->
      <div class="dropdown">

        <button
            class="btn btn-primary dropdown-toggle"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false">
            Choose id</button>
<!--            :disabled="serverUserLoggedIn"-->
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          <li><h5 class="dropdown-header">Choose id from database</h5></li>
          <li><a v-for="id in arduinoNameIDs" class="dropdown-item" href="#" @click="IDChosen($event, id);
            this.idInputVisible=false">{{id}}</a></li>
          <li><h5 class="dropdown-header">Create a new id</h5></li>
<!--          @click="newArd"-->
          <li class="dropdown-item" @click="ToggleIdInputVisibility" href="#">New id</li>
        </ul>

        <!-- New id input -->
        <div class="input-group my-3" v-show="idInputVisible">
          <span class="input-group-text">ID: </span>
          <input type="number" class="form-control" placeholder="ID" v-model="idInputValue">
          <button class="btn btn-danger" id="btn-delete" @click=UpdateID :disabled="idInputValue<0">go</button>
        </div>

        <h1 id="currentID" v-show="currentID >= 0">ID: {{currentID}}</h1>
      </div>
    </form>

    <!-- Enabled toggle switch -->
    <div class="form-check form-switch mx-auto" style="width: 70px">
      <input class="form-check-input" type="checkbox" @click="switchToggled" :disabled="formDisabled" :checked="enabled">
      <label class="form-check-label mx-2" id="enabledSwitchLabel" >{{ enabled ? "On" : "Off"}}</label>
    </div>

    <form class="align-self-center custom-centered">
      <!-- Location switch -->
      <div class="input-group mb-3">
        <span class="input-group-text">Arduino name: </span>
        <input type="text" class="form-control" placeholder="Location"
               v-model="localLocation" :disabled="formDisabled" @change="UpdateLocation">
        <img class="checkmarkImg" alt="updated" src="../assets/checkMark.png"
             v-show="localLocation === location && currentID >= 0">
<!--        ; max-width: 40px-->
      </div>

      <!-- Lights count input -->
      <div class="input-group mb-3">
        <span class="input-group-text">Lights count: </span>
        <input type="number" class="form-control" placeholder="Lights count"
               v-model="localNumLights" :disabled="formDisabled" @change="UpdateNumLights">
        <img class="checkmarkImg" alt="updated" src="../assets/checkMark.png"
             v-show="localNumLights === numLights && currentID >= 0">
      </div>

      <!-- Speed input -->
      <div class="input-group mb-3">
        <span class="input-group-text">Speed: </span>
        <input type="number" class="form-control" placeholder="Speed"
               v-model="localSpeed" :disabled="formDisabled" @change="UpdateSpeed">
        <img class="checkmarkImg" alt="updated" src="../assets/checkMark.png"
             v-show="localSpeed === speed && currentID >= 0">
      </div>

      <!--brightness slider-->
      <div class="input-group mb-3" >
        <span class="input-group-text">Brightness:&nbsp{{((brightness > 99) ? "" : "&nbsp&nbsp") + ((brightness>9) ? "" : "&nbsp&nbsp")}}
          {{brightness}}</span>
        <div id="brightnessSlider">
        <vue3-slider v-model="localBrightness"
                     :height= 30 color="#AEAEAE" track-color="#3f3f3f" :max=255 :min=1
                     @drag-end="updateBrightness" v-show="!formDisabled"/>
        </div>
      </div>


      <!--wave enable switch-->
      <div class="form-check form-switch mx-auto" style="width: 200px">
        <input class="form-check-input" type="checkbox" @click="waveModeSwitchToggled"
               :disabled="formDisabled" :checked="waveMode">
        <label class="form-check-label mx-2" id="waveModeSwitch" >
          Wave mode: {{ waveMode ? "On" : "Off"}}</label>
      </div>

      <hr>

      <!-- mirror enable switch-->
      <div class="form-check form-switch mx-auto" style="width: 150px">
        <input class="form-check-input" type="checkbox" @click="mirrorPointPresentSwitchToggled"
               :disabled="formDisabled || !this.waveMode" :checked="localMirrorEnabled">
        <label class="form-check-label mx-2" id="mirrorPointPresent" >
          Mirroring: {{ localMirrorEnabled ? "On" : "Off"}}</label>
      </div>

      <!-- Mirror index input -->
      <div class="input-group mb-3">
        <span class="input-group-text">Mirror index: </span>
        <input type="number" class="form-control" placeholder="Mirror index" v-model="localMirrorIndex"
               :disabled="formDisabled || !this.localMirrorEnabled || !this.waveMode"
               @change="UpdateMirrorIndex">
        <img class="checkmarkImg" alt="updated" src="../assets/checkMark.png"
             v-show="localMirrorIndex === mirrorIndex && currentID >= 0">
      </div>
    </form>

  <colorsPanel v-show="colorPanelVisible" ref = "colorPanel"/>
  </div>
</template>

<script>


import {deleteArduino, downloadAllArds, uploadArduino} from "@/firebase";
import ColorsPanel from "@/components/ColorsPanel";
import timePicker from "@/components/timePicker";
import slider from "vue3-slider"

export default {
  name: "ArduinoProperties",
  components:
      {
        ColorsPanel,
        "vue3-slider": slider
        timePicker
      },
  data(){
    return{
      localSpeed: null,
      localNumLights: null,
      idInputValue: 0,
      idInputVisible: false,
      localLocation: "",
      localMirrorIndex: null,
      localMirrorEnabled: false,
      localLastMirror: 0,
      localWaveMode: true,
      localBrightness: 50
      //location: ""
    }
  },
  computed: {
    colorPanelVisible() {
      return this.$store.state.currentArduinoID >= 0;
    },
    arduinoIDs: {
      get() {
        let ids = [];
        for (let i = 0; i < this.$store.state.arduinoList.length; i++) {
          console.log("new length of id list:");
          console.log(ids.push(this.$store.state.arduinoList[i].arduinoID));
        }

        // const intIds = await getExistingIds();
        // for(let id of intIds)
        // {
        //   ids.push(id.toString());
        // }
        console.log("ids list");
        console.log(ids);
        console.log("arduino list: ");
        console.log(this.$store.state.arduinoList);

        return ids;
      },
      set(value){
        console.log("arduinoIdsList cannot be edited to: "+value)
      },
    },
    arduinoNameIDs: {
      get() {
        let ids = [];
        for (let i = 0; i < this.$store.state.arduinoList.length; i++) {

          const IDName = this.$store.state.arduinoList[i].arduinoID + ": " + this.$store.state.arduinoList[i].location
          console.log(ids.push(IDName));
        }
        console.log(this.$store.state.arduinoList);
        return ids;
      },
      set(value){
        console.log("arduinoIdsList cannot be edited to: "+value)
      },
    },

    currentID: {
      get(){
        return this.$store.state.currentArduinoID
      },
      set(value){
        this.$store.commit('changeCurrentArduinoID', {id: value})
      }
    },
    brightness: {
      get(){
        return (this.$store.state.currentArduinoID < 0) ? 0 : this.$store.getters.getBrightnessByArduinoID;
      },
      set(val){
        this.$store.commit('changeBrightnessOfCurrentArduinoID', {brightness: val});
      }
    },
    formDisabled: {
      get(){
        return this.currentID < 0
      }
    },

    waveMode: {
      get(){
        return (this.$store.state.currentArduinoID < 0) ? 0 : this.$store.getters.getWaveModeByArduinoID;
      },
      set(val){
        this.$store.commit('changeWaveModeOfCurrentArduinoID', {waveMode: val})
      }
    },

    speed: {
      get(){
        return (this.$store.state.currentArduinoID < 0) ? 0 : this.$store.getters.getSpeedByArduinoID;
      },
      set(val) {
        this.$store.commit('changeSpeedOfCurrentArduinoID', {speed: val})
      }
    },

    numLights: {
      get(){
        return (this.$store.state.currentArduinoID < 0) ? 0 : this.$store.getters.getLightsCountByArduinoID
      },
      set(val) {
        this.$store.commit('changeLightsCountOfCurrentArduinoID', {lightsCount: val})
      }
    },

    location: {
      get(){
        return (this.$store.state.currentArduinoID < 0) ? 0 : this.$store.getters.getLocationByArduinoID
      },
      set(val) {
        this.$store.commit('changeLocationOfCurrentArduinoID', {location: val})
      }
    },

    enabled: {
      get(){
        return (this.$store.state.currentArduinoID < 0) ? 0 : this.$store.getters.getEnabledByArduinoID
      },
      set(val) {
        this.$store.commit('changeEnabledOfCurrentArduinoID', {enabled: val})
      }
    },

    mirrorIndex: {
      get(){
        return (this.formDisabled) ? null : this.$store.getters.getMirrorIndex
      },
      set(val) {
        this.$store.commit('changeMirrorIndexOfCurrentArduinoID', {mirrorIndex: val})
      }
    }
  },
  methods: {
    switchToggled()
    {
      this.enabled = !this.enabled;
      console.log("switch toggled to " + this.enabled)
    },
    mirrorPointPresentSwitchToggled()
    {
      this.localMirrorEnabled = !this.localMirrorEnabled;
      console.log("mirror switch toggled to " + this.localMirrorEnabled)
      if(this.localMirrorEnabled)
      {
        this.mirrorIndex =  this.localLastMirror;
        this.localMirrorIndex = this.mirrorIndex;
      }
      else
      {
        this.localLastMirror = this.mirrorIndex;
        this.mirrorIndex = 0;
        this.localMirrorIndex = null;
      }
    },

    waveModeSwitchToggled()
    {
      // this.localWaveMode = ! this.localWaveMode;
      this.waveMode = ! this.waveMode;
    },
    async localDeleteArduino()
    {
      const IDToDelete = this.currentID;
      if(IDToDelete === -1)
      {
        alert("please select an arduino before deleting");
      }
      else {
        console.log("function: localDeleteArduino\nID: " + IDToDelete);
        await deleteArduino(IDToDelete);
        this.currentID = -1;
        alert("Arduino ID " + IDToDelete + " has been deleted");
        await downloadAllArds();
      }
    },
    async uploadArduinoFromAP()
    {
      const IDToUpload = this.currentID;
      const vArdToUpload = this.$store.getters.getArduinoByID(IDToUpload);
      console.log("uploading id " + IDToUpload + ":");
      console.log(vArdToUpload);
      await uploadArduino(vArdToUpload);
    },
    updateBrightness(){
      console.log("function: updateBrightness()\nchanging to " + this.localBrightness);
      const temp = (255-this.localBrightness)
      if(temp < 0)
      this.brightness = this.localBrightness;
    },
    async IDChosen(event, idName){
      console.log("ID chosen");
      let id = "";
      let index = 1;
      while(!id.includes(":"))
      {
        console.log("id: " + id)
        id = idName.substring(0, index);
        index++;
      }
      id = idName.substring(0, index-2);
      console.log("final id: " + id)
      this.currentID = Number(id);
      this.updateLocalVars();
    },
    updateLocalVars()
    {
      console.log("updateLocalVars()");
      if(this.mirrorIndex != null)
      {
        this.localSpeed = this.speed;
        this.localLocation = this.location;
        this.localNumLights = this.numLights;
        this.localMirrorEnabled = this.mirrorIndex > 0;
        if(this.localMirrorEnabled)
        {
          this.localMirrorIndex = this.mirrorIndex;
        }
        else {
          this.localMirrorIndex = null;
        }
        // this.$refs.colorPanel.updatePanels();

        //ColorsPanel: {components: {ColorNode: {data(): {localTransitionFrames: null}, computed: {color: {get(): any}, transitionFrames: {set(any=): void, get(): ... | ... | ... | ... | ...}}, methods: {transitionFramesChanged(): void, deleteColorNode(): void, updateTransFrames(): void, colorChanged(any): void}, name: string, mounted(): void, props: {id: Intl}}}, computed: {colorNodes: {set(any): void, get(): [] | any}, currentID: {set(any): void, get(): any}}, methods: {addColorNode(): void, deleteColorNode(any=): void}, name: string}

      }
      else
      {

        console.log("reload local values, but server has null:");
        this.localSpeed = null;
        this.localLocation = null;
        this.localNumLights = null;
        this.localMirrorEnabled = false;
        this.localMirrorIndex = null;
        console.log("this.localMirrorIndex: " + this.localMirrorIndex);

      }
    },
    ToggleIdInputVisibility(){
      this.idInputVisible = !this.idInputVisible
      this.currentID = -1
    },
    resetID()
    {
      this.currentID = -1;
    },
    async UpdateID(){
      const inputID = this.idInputValue;
      console.log("function: UpdateID\nNew ID: ");
      console.log(inputID);
      if(inputID >= 0)
      {

        if(this.$store.getters.getArduinoByID(inputID) == undefined){
          console.log("This id is free");
          this.currentID = inputID;
          await this.$store.commit('addArduino', inputID);
        }
        else {
          this.currentID = inputID;
          console.log("This id exists");
        }
        this.updateLocalVars();
      }
    },
    UpdateLocation()
    {
      this.location = this.localLocation;

    },
    UpdateNumLights(){
      this.numLights = this.localNumLights;
    },
    UpdateSpeed(){
      this.speed = this.localSpeed;

    },
    UpdateMirrorIndex(){
      const indexInForm = this.localMirrorIndex;
      if(indexInForm > this.numLights)
      {
        alert("Mirror index must be less that the number of lights in the string!")
        this.localMirrorIndex = this.numLights - 1;
        this.mirrorIndex = this.localMirrorIndex;
      }
      else{
        this.mirrorIndex = indexInForm;
      }


    }
  }
}
</script>

<style scoped>
.custom-centered{
  margin:0 auto;
  max-width: 500px;
}
/*.switch{*/
/*  width: 60px;*/
/*  margin: 0 auto;*/
/*  align-self: center;*/
/*}*/
.arduinoProperties{
  padding: 20px;
}

/*.form-check{*/
/*  padding: 20px;*/
/*}*/
#currentID{
  padding-top: 20px;

}
.checkmarkImg{
  padding: 2%;
  width: 8%;

}

#brightnessSlider{
  padding-left: 5%;
  padding-right: 1%;
  width: 70%;
}

</style>