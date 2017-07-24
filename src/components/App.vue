<template lang="pug">
.main
  track-canvas.canvas(:track="track" @drag="onDrag")
  .controls
    flat-button.button(@click="clearTrack")
      | Clear
    flat-button.button(@click="exportTrack")
      | Export
</template>

<script>
import download from 'downloadjs';
import csvify from '../csvify';
import FlatButton from './FlatButton.vue';
import TrackCanvas from './TrackCanvas.vue';

const normalizeTimeStamps = track => {
  if (track.length === 0) return track;
  const start = track[0].timeStamp;
  return track.map(e => Object.assign({}, e, { timeStamp: e.timeStamp - start }));
};

export default {
  data: () => ({
    track: []
  }),
  components: { FlatButton, TrackCanvas },
  methods: {
    exportTrack() {
      download(csvify(normalizeTimeStamps(this.track)), 'track.csv', 'text/csv');
    },
    clearTrack() {
      this.track = [];
    },
    onDrag(evt) {
      this.track = [...this.track, evt];
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
