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
            aria-expanded="false"
        >Choose id</button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          <li><h5 class="dropdown-header">Choose id from database</h5></li>
          <li><a v-for="id in arduinoIDs" class="dropdown-item" href="#" @click="IDChosen($event, id); this.idInputVisible=false">{{id}}</a></li>
          <li><h5 class="dropdown-header">Create a new id</h5></li>
<!--          @click="newArd"-->
          <li class="dropdown-item" @click="ToggleIdInputVisibility" href="#">New id</li>
        </ul>

        <!-- New id input -->
        <div class="input-group my-3" v-show="idInputVisible">
          <span class="input-group-text">ID: </span>
          <input type="number" class="form-control" placeholder="ID" v-model="idInputValue" @change="UpdateID">
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
      </div>

      <!-- Lights count input -->
      <div class="input-group mb-3">
        <span class="input-group-text">Lights count: </span>
        <input type="number" class="form-control" placeholder="Lights count"
               v-model="localNumLights" :disabled="formDisabled" @change="UpdateNumLights">
      </div>

      <!-- Speed input -->
      <div class="input-group mb-3">
        <span class="input-group-text">Speed: </span>
        <input type="number" class="form-control" placeholder="Speed"
               v-model="localSpeed" :disabled="formDisabled" @change="UpdateSpeed">
      </div>

      <div class="form-check form-switch mx-auto" style="width: 150px">
        <input class="form-check-input" type="checkbox" @click="mirrorPointPresentSwitchToggled"
               :disabled="formDisabled" :checked="localMirrorEnabled">
        <label class="form-check-label mx-2" id="mirrorPointPresent" >Mirroring: {{ localMirrorEnabled ? "On" : "Off"}}</label>
      </div>

      <!-- Mirror index input -->
      <div class="input-group mb-3">
        <span class="input-group-text">Mirror index: </span>
        <input type="number" class="form-control" placeholder="Mirror index"
               v-model="localMirrorIndex" :disabled="formDisabled || !this.localMirrorEnabled" @change="UpdateMirrorIndex">
      </div>
    </form>
  </div>
  <colorsPanel ref = "colorPanel" v-show="colorPanelVisible"/>
</template>

<script>


import {deleteArduino, downloadAllArds, getCurrentUserName, uploadArduino} from "@/firebase";
import ColorsPanel from "@/components/ColorsPanel";

export default {
  name: "ArduinoProperties",
  components:
      {
        ColorsPanel
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
      localLastMirror: 0
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
          console.log("new length of idlist:");
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

    currentID: {
      get(){
        return this.$store.state.currentArduinoID
      },
      set(value){
        this.$store.commit('changeCurrentArduinoID', {id: value})
      }
    },
    formDisabled: {
      get(){
        return this.currentID < 0
      }
    },

    speed: {
      get(){
        return (this.$store.state.currentArduinoID < 0) ? 0 : this.$store.getters.getSpeedByArduinoID;;
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
    async localDeleteArduino()
    {
      const IDToDelete = this.currentID;
      console.log("function: localDeleteArduino\nID: " + IDToDelete);
      await deleteArduino(IDToDelete);
      this.currentID = -1;
      alert("Arduino ID " + IDToDelete + " has been deleted");
      await downloadAllArds();

    },
    async uploadArduinoFromAP()
    {
      const IDToUpload = this.currentID;
      const vArdToUpload = this.$store.getters.getArduinoByID(IDToUpload);
      console.log("uploading id " + IDToUpload + ":");
      console.log(vArdToUpload);
      await uploadArduino(vArdToUpload);
    },
    updateLocal()
    {
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
        this.$refs.colorPanel.updatePanels();

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
    IDChosen(event, id){
      this.currentID = id
      this.updateLocal();
    },
    ToggleIdInputVisibility(){
      this.idInputVisible = !this.idInputVisible
      this.currentID = -1
    },
    resetID()
    {
      this.currentID = -1;
    },
    UpdateID(){
      const inputID = this.idInputValue;
      console.log("function: UpdateID\nNew ID: ");
      console.log(this.currentID);
      if(this.$store.getters.getArduinoByID(inputID) == undefined){
        console.log("This id is free");
        this.currentID = inputID;
        this.$store.commit('addArduino', this.currentID);
      }
      else {
        this.currentID = inputID;
        console.log("This id exists");
      }
      this.updateLocal();
    },
    UpdateLocation(){
      this.location = this.localLocation

    },
    UpdateNumLights(){
      this.numLights = this.localNumLights

    },
    UpdateSpeed(){
      this.speed = this.localSpeed

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
.switch{
  width: 60px;
  margin: 0 auto;
  align-self: center;
}
.arduinoProperties{
  padding: 20px;
}

/*.form-check{*/
/*  padding: 20px;*/
/*}*/

#currentID{
  padding-top: 20px;

}
</style>