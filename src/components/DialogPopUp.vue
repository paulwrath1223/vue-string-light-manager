

<template>
  <h1>{{ title }}</h1>
  <hr />
  <p>{{ body }}</p>
</template>

<script>
export default {
  name: "DialogPopUp",
  props: {
    title: String,
    body: String
  }
}
</script>

<style scoped>

</style>