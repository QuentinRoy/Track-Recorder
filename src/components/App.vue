<template lang="pug">
.main
  trace-canvas.canvas(:trace="trace" @drag="onDrag")
  .controls
    flat-button.button(@click="clearTrace")
      | Clear
    flat-button.button(@click="exportTrace")
      | Export
</template>

<script>
import download from 'downloadjs';
import csvify from '../csvify';
import FlatButton from './FlatButton.vue';
import TraceCanvas from './TraceCanvas.vue';

const normalizeTimeStamps = trace => {
  if (trace.length === 0) return trace;
  const start = trace[0].timeStamp;
  return trace.map(e => Object.assign({}, e, { timeStamp: e.timeStamp - start }));
};

export default {
  data: () => ({
    trace: []
  }),
  components: { FlatButton, TraceCanvas },
  methods: {
    exportTrace() {
      download(csvify(normalizeTimeStamps(this.trace)), 'trace.csv', 'text/csv');
    },
    clearTrace() {
      this.trace = [];
    },
    onDrag(evt) {
      this.trace = [...this.trace, evt];
    }
  }
};
</script>

<style lang="scss" scoped>
$controls-bg: #C7C5C5;
$shadow-color: rgba(0, 0, 0, .3);

.main {
  font-weight: bolder;
  height: 100%;
  display: flex;
  flex-direction: column;

  .canvas {
    flex-grow: 1;
    width: 100%;
    height: 100%;
  }

  .controls {
    background-color: $controls-bg;
    box-shadow: 0 0 8px -2px $shadow-color;
    box-sizing: border-box;
    bottom: 0;
    padding: 5px;
    text-align: right;
    width: 100%;

    .button {
      margin: 0 .2em;
    }
  }
}
</style>
