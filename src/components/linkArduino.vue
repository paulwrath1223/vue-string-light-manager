<template>
  <div class="arduinoProperties mt-0 align-items-center">
    <form class="align-self-center custom-centered">
      <div class="input-group mb-3">
        <span class="input-group-text">Enter UID on controller: </span>
        <input type="text" class="form-control" placeholder="UID"
               v-model="arduinoUID" :disabled="false" @change="updateArduinoUID">
      </div>

      <div class="group mb-3">
        <span class="input-group-text">{{currentArdStatus}}</span>
      </div>

      <!-- Speed input -->
      <div class="input-group mb-3">
        <span class="input-group-text">Assign ID: </span>
        <input type="number" class="form-control" placeholder="ID"
               v-model="ID">
        <button class="btn btn-primary" id="changeIdButton" @click="updateID" :disabled="!arduinoOwner">set</button>
      </div>


      <div>
        <button class="btn btn-danger" id="claim" @click="claimButton" :disabled="!claimable">Claim controller</button>
        <button class="btn btn-danger" id="unclaim" @click="unclaimButton" :disabled="!arduinoOwner">Remove claim</button>
      </div>
    </form>
  </div>

</template>

<script>
import {changeID, getArduinoUserID, getOwnerOf, getUID, setArduinoOwner} from "@/firebase.js"
export default {
  name: "linkArduino",
  data(){
    return{
      ID: null,
      arduinoUID: null,
      arduinoOwner: false,
      currentArdStatus: "enter UID",
      claimable: false

    }
  },
  computed: {
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
    }
  },
  methods: {
    async updateArduinoUID(){
      console.log("function: updateArduinoUID");
      const tempOwner = await getOwnerOf(this.arduinoUID);
      console.log("owner of arduino " + this.arduinoUID + ": ");
      console.log(tempOwner);
      if (tempOwner === getUID())
      {
        this.currentArdStatus = "You are the owner of this controller.";
        this.arduinoOwner = true;
        this.ID = await getArduinoUserID(this.arduinoUID)
        this.claimable = false;
      }
      else if (tempOwner === "unclaimed")
      {
        this.currentArdStatus = "This controller is unclaimed.";
        this.arduinoOwner = false;
        this.claimable = true;
      }
      else if (tempOwner != null)
      {
        this.currentArdStatus = "This controller has been claimed by a different user.";
        this.arduinoOwner = false;
        this.claimable = false;
      }
      else
      {
        this.currentArdStatus = "Controller not found. Please configure the wifi on the controller first.";
        this.arduinoOwner = false;
        this.claimable = false;
      }

    },
    async claimButton()
    {
      if(this.arduinoIDs.includes(this.id))
      {
        alert("this ID is already taken")
      }
      else {
        //TODO: make sure ID is not taken, and populate the lighting information
        if (this.ID > 0 && this.ID != null) {
          if (await getOwnerOf(this.arduinoUID) === "unclaimed") {
            await changeID(this.arduinoUID, (Math.round(this.ID)));
            await setArduinoOwner(this.arduinoUID, getUID());
            await this.$store.commit('addArduino', this.ID);
          }
          this.restartReminder();
          await this.updateArduinoUID();
        } else {
          alert("please select an ID before claiming");
        }
      }
    },
    async unclaimButton()
    {
      if(this.arduinoOwner)
      {
        await setArduinoOwner(this.arduinoUID, "unclaimed");
      }
      await this.updateArduinoUID();
    },
    updateID()
    {
      if(this.arduinoIDs.includes(this.id))
      {
        alert("this ID is already taken")
      }
      else{
        if(this.arduinoOwner) {
          if (this.ID > 0) {
            changeID(this.arduinoUID, (Math.round(this.ID)));
          }
        }
        this.restartReminder();
      }
    },

    restartReminder()
    {
      alert("Restart (unplug and replug) controller for the changes to take effect")
    }

  }
}
</script>

<style scoped>
.btn-danger{
  margin: 10px;
  padding: 10px;

  /*align-self: flex-end;*/
}
.custom-centered{
  margin:0 auto;
  max-width: 750px;
}
</style>