<template lang="pug">
.main {{message}}
</template>

<script>
export default {
  data: () => ({
    message: 'hello'
  })
};
</script>

<style lang="scss" scoped>
.main {
  font-weight: bolder;
}
</style>
