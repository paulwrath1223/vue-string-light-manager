<template>
  <div>
    <label for="timepicker-buttons">Time picker with optional footer buttons</label>
    <b-form-timepicker
        id="timepicker-buttons"
        now-button
        reset-button
        locale="en"
    ></b-form-timepicker>
  </div>
</template>
<script>

import { FormTimepickerPlugin } from 'bootstrap-vue'
use(FormTimepickerPlugin)

export default {
  name: "timePicker",
  data() {
    return {
      value: ''
    }
  }
}

</script>

<style scoped>

</style>