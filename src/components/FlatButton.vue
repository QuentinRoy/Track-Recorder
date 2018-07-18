<template lang="pug">
button.big-flat-button(@click="evt => $emit('click', evt)")
  slot
</template>

<style lang="scss" scoped>
$color: #222222;
$bg-color: #f4f1f1;
$border-color: #b1b1b1;

$hover-color: lighten($color, 10%);
$hover-bg-color: lighten($bg-color, 2%);
$hover-border-color: $border-color;

$active-color: darken($color, 10%);
$active-bg-color: darken($bg-color, 2%);
$active-border-color: darken($border-color, 2%);

$disabled-color: lighten($color, 60%);
$disabled-bg-color: darken($bg-color, 3%);
$disabled-border-color: lighten($border-color, 2%);

.big-flat-button {
  outline: none;
  border-width: 1px;
  border-style: solid;
  border-radius: 5px;
  border-color: $border-color;
  background-color: $bg-color;
  cursor: pointer;
  padding: .25em .5em;
  color: $color;
  font-size: 1em;

  &:hover {
    background-color: $hover-bg-color;
  }

  &:active {
    border-color: $active-border-color;
    background-color: $active-bg-color;
    color: $active-color;
  }


  &[disabled]{
    border-color: $disabled-border-color;
    background-color: $disabled-bg-color;
    color: $disabled-color;
    cursor: not-allowed;
  }
}
</style>
