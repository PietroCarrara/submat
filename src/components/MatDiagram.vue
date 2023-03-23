<template>
  <div>
    <img class="mat-svg img-fluid" src="/svg/mat.svg">
    <div v-if="posX != null && posY != null" class="indicator" :style="{ left: x, top: y }">
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    posX: {
      required: false,
      type: Number,
      validator(x: number) {
        return [1, 2, 3].includes(x);
      },
    },
    posY: {
      required: false,
      type: Number,
      validator(x: number) {
        return [1, 2, 3].includes(x);
      },
    },
  },
  computed: {
    x() {
      if (this.posX) {
        const barThickness = 7/210; // Diagram bar thickness in %
        const pos = (this.posX - 1) / 3;
        return `calc(16.5% - 32px + ${pos * 100}% + ${barThickness/2*100}%)`;
      }
    },
    y() {
      if (this.posY) {
        const barThickness = 7/210; // Diagram bar thickness in %
        const pos = (this.posY - 1) / 3;
        return `calc(16.5% - 32px + ${pos * 100}% + ${barThickness/2*100}%)`;
      }
    },
  },
}
</script>

<style scoped>
.mat-svg {
  max-height: 50vh;
}

.indicator {
  position: absolute;
  border-radius: 50%;
  background-color: #7fc6a4;
  width: 64px;
  height: 64px;

  animation-duration: 2s;
  animation-name: pulse;
  animation-iteration-count: infinite;
  animation-direction: normal;
}

@keyframes pulse {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  30% {
    opacity: 50%;
  }
  60% {
    transform: scale(1.5);
    opacity: 0;
  }
  /* 100% is just for inter-iteraction delay */
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
</style>