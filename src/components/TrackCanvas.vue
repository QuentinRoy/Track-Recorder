<template lang="pug">
canvas.canvas(
  ref="canvas"
  @mousedown.prevent="onMouseStartEvent"
  @mouseup.prevent="onMouseEndEvent"
  @mouseout.prevent="onMouseEndEvent"
  @mousemove.prevent="onMouseMoveEvent"
  @touchstart.prevent="onTouchStartEvent"
  @touchmove.prevent="onTouchMoveEvent"
  @touchend.prevent="onTouchEndEvent"
  @touchcancel.prevent="onTouchCancelEvent"
)
</template>

<script>
import rafThrottle from 'raf-throttle';

const devicePixelRatio = window.devicePixelRatio || 1;


// Create a record from a mouse event.
const createMouseEventRecord = (evt, type, { left = 0, top = 0, height = 0 } = {}) => ({
  type,
  x: type === 'end' ? null : evt.clientX - left,
  // Transform y origin to be at the bottom instead of the top.
  y: type === 'end' ? null : height - evt.clientY + top,
  timeStamp: evt.timeStamp,
  device: 'mouse',
  pointerCount: 1
});

const getTouchesMean = (touches, coordName) =>
  Array.prototype.reduce.call(
    touches,
    (sum, touch) => sum + touch[`client${coordName.toUpperCase()}`], 0
  ) / touches.length;

const createTouchEventRecord = (evt, type, { left = 0, top = 0, height = 0 } = {}) => ({
  type,
  x: evt.touches.length > 0 ? getTouchesMean(evt.touches, 'x') - left : null,
  // Transform y origin to be at the bottom instead of the top.
  y: evt.touches.length > 0 ? height - getTouchesMean(evt.touches, 'y') + top : null,
  timeStamp: evt.timeStamp,
  device: 'touch',
  pointerCount: evt.touches.length
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
    // Set up resize.
    window.addEventListener('resize', this.setUpCanvasSize);
    // Set up the size and repaint.
    this.setUpCanvasSize();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setUpCanvasSize);
  },
  methods: {
    setUpCanvasSize: rafThrottle(function setUpCanvasSize() {
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
      // Init the paint.
      this.repaintNow();
    }),
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
    onTouchMoveEvent(evt) {
      this.$emit('drag', createTouchEventRecord(evt, 'move', this.canvasRect));
    },
    onTouchStartEvent(evt) {
      const hadAlreadyStarted = this.down;
      this.down = true;
      this.$emit('drag', createTouchEventRecord(
        evt,
        hadAlreadyStarted ? 'new-pointer' : 'start',
        this.canvasRect
      ));
    },
    onTouchEndEvent(evt) {
      const down = evt.touches.length > 0;
      this.$emit('drag', createMouseEventRecord(
        evt,
        down ? 'pointer-left' : 'end',
        this.canvasRect
      ));
      this.down = down;
    },
    repaint: rafThrottle(function repaint() {
      this.repaintNow();
    }),
    repaintNow() {
      const ctx = this.$refs.canvas.getContext('2d');

      // Set up context parameters.
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = 2;

      // Clear the canvas.
      ctx.clearRect(0, 0, this.canvasRect.width, this.canvasRect.height);

      // Draw the strokes.
      ctx.beginPath();
      this.track.forEach((e, i) => {
        const pos = [e.x, this.canvasRect.height - e.y];
        if (e.type === 'start' || i === 0) {
          ctx.moveTo(...pos);
        } else if (e.type !== 'end') {
          ctx.lineTo(...pos);
        }
      });
      ctx.stroke();
    }
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
