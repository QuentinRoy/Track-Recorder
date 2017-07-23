<template lang="pug">
canvas.canvas(
  ref="canvas"
  @mousedown.prevent="onMouseEvent"
  @mouseup.prevent="onMouseEvent"
  @mouseout.prevent="onMouseEvent"
  @mousemove.prevent="onMouseEvent"
)
</template>

<script>
import rafThrottle from 'raf-throttle';

const devicePixelRatio = window.devicePixelRatio || 1;

// Map mouse event types to record types.
const MOUSE_EVENT_TYPES = {
  mousedown: 'start',
  mouseup: 'end',
  mouseout: 'end',
  mousemove: 'move'
};

// Create a record from a mouse event.
const createMouseEventRecord = (evt, { left = 0, top = 0, height = 0 } = {}) => ({
  type: MOUSE_EVENT_TYPES[evt.type],
  x: evt.clientX - left,
  // Transform y origin to be at the bottom instead of the top.
  y: height - evt.clientY + top,
  timeStamp: evt.timeStamp,
  device: 'mouse'
});

export default {
  props: {
    trace: { type: Array, default: () => [] },
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
    onMouseEvent(evt) {
      if (evt.type === 'mousedown') {
        this.down = true;
      }
      if (this.down) {
        this.$emit('drag', createMouseEventRecord(evt, this.canvasRect));
      }
      if (evt.type === 'mouseup' || evt.type === 'mouseout') {
        this.down = false;
      }
    },
    repaint: rafThrottle(function repaint() {
      const ctx = this.$refs.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.canvasRect.width, this.canvasRect.height);
      ctx.beginPath();
      this.trace.forEach((e, i) => {
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
    trace() {
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
