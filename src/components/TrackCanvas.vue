<template lang="pug">
canvas.canvas(
  ref="canvas"
  @mousedown.prevent="onMouseStartEvent"
  @mouseup.prevent="onMouseEndEvent"
  @mouseout.prevent="onMouseEndEvent"
  @mousemove.prevent="onMouseMoveEvent"
)
</template>

<script>
import rafThrottle from 'raf-throttle';

const devicePixelRatio = window.devicePixelRatio || 1;


// Create a record from a mouse event.
const createMouseEventRecord = (evt, type, { left = 0, top = 0, height = 0 } = {}) => ({
  type,
  x: evt.clientX - left,
  // Transform y origin to be at the bottom instead of the top.
  y: height - evt.clientY + top,
  timeStamp: evt.timeStamp,
  device: 'mouse'
});

export default {
  props: {
    track: { type: Array, default: () => [] },
    startTime: { type: Number }
  },
  data: () => ({
    down: false,
    canvasRect: undefined
  }),
  mounted() {
    this.canvasRect = this.$refs.canvas.getBoundingClientRect();
    // Set up canvas with and height accordingly to its display size.
    this.$refs.canvas.width = this.canvasRect.width * devicePixelRatio;
    this.$refs.canvas.height = this.canvasRect.height * devicePixelRatio;
    const ctx = this.$refs.canvas.getContext('2d');
    // Adjust back the canvas width and height if it has changed.
    if (devicePixelRatio !== 1) {
      this.$refs.canvas.style.width = `${this.canvasRect.width}px`;
      this.$refs.canvas.style.height = `${this.canvasRect.height}px`;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    // Set up context parameters.
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 2;
    // Init the paint.
    this.repaint();
  },
  methods: {
    onMouseMoveEvent(evt) {
      if (this.down) {
        this.$emit('drag', createMouseEventRecord(evt, 'move', this.canvasRect));
      }
    },
    onMouseStartEvent(evt) {
      this.down = true;
      this.$emit('drag', createMouseEventRecord(evt, 'start', this.canvasRect));
    },
    onMouseEndEvent(evt) {
      // This is also called on mouse out so we need to check if we were down in the first place.
      if (this.down) {
        this.$emit('drag', createMouseEventRecord(evt, 'end', this.canvasRect));
        this.down = false;
      }
    },
    repaint: rafThrottle(function repaint() {
      const ctx = this.$refs.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.canvasRect.width, this.canvasRect.height);
      ctx.beginPath();
      this.track.forEach((e, i) => {
        const pos = [e.x, this.canvasRect.height - e.y];
        if (e.type === 'start' || i === 0) {
          ctx.moveTo(...pos);
        } else {
          ctx.lineTo(...pos);
        }
      });
      ctx.stroke();
    })
  },
  watch: {
    track() {
      this.repaint();
    }
  }
};
</script>

<style lang="scss" scoped>
.canvas {
  cursor: crosshair;
}
</style>
