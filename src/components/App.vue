<template lang="pug">
.main
  track-canvas.canvas(:track="track" @drag="onDrag")
  .footer
    .info
      h1.title
        | Track Recorder{{ version ? ` v${version}` : '' }}
      a.github-link(
        href="https://github.com/QuentinRoy/Track-Recorder"
        title="Github repository of the project"
      )
        img.github-logo(src="./github.svg" alt="github")
    .controls
      flat-button.button(@click="clearTrack")
        | Clear
      flat-button.button(@click="exportTrack")
        | Export
</template>

<script>
/* global APP_VERSION */

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
    track: [],
    version: APP_VERSION
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
$controls-title-color: darken($controls-bg, 30%);

$logo-height: 1.4em;
$info-title-opacity: .7;
$info-github-opacity: .5;
$info-hovered-github-opacity: $info-title-opacity;

.main {
  height: 100%;
  display: flex;
  flex-direction: column;

  .canvas {
    flex-grow: 1;
  }

  .footer {
    align-items: center;
    background-color: $controls-bg;
    bottom: 0;
    box-shadow: 0 0 8px -2px $shadow-color;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    padding: 5px;
    width: 100%;
  }

  .info {
    display: flex;
    align-items: center;

    .title {
      font: small-caps bolder 1em 'Open Sans', sans-serif;
      font-variant: small-caps;
      margin: 0 .5em;
      opacity: $info-title-opacity;
    }

    .github-link {
      display: block;
      padding: 0;
      margin: 0 .2em;
      text-decoration: none;
      height: $logo-height;
      opacity: $info-github-opacity;

      .github-logo {
        margin: 0;
        height: 100%;
      }

      &:hover {
        opacity: $info-hovered-github-opacity;
      }
    }
  }

  .controls {
    .button {
      margin: 0 .2em;
    }
  }
}
</style>
