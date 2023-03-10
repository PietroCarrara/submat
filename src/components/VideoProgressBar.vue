<template>
  <div class="root">
    <div v-if="vidStore.isVideoLoaded" class="slider-container">
      <input ref="range" type="range" value="0" min="0" max="1" step="0.005" id="duracao" class="slider" @input="seek">
    </div>
  </div>
</template>

<script lang="ts">
import { useVideoStore } from '@/stores/video';

export default {
  setup() {
    const vidStore = useVideoStore();

    return {
      vidStore,
    };
  },

  computed: {
    value() {
      if (!this.vidStore.isVideoLoaded) {
        return null;
      }
      return this.vidStore.currentTime / this.vidStore.duration;
    }
  },

  methods: {
    seek() {
      const input = this.$refs.range as HTMLInputElement;
      if (input == null || !this.vidStore.isVideoLoaded) {
        return;
      }

      this.vidStore.setCurrentTime(this.vidStore.duration * Number(input.value));
    }
  },

  watch: {
    value() {
      const input = this.$refs.range as HTMLInputElement;
      if (input == null || this.value == null) {
        return;
      }

      input.value = String(this.value);
    }
  },
}
</script>

<style scoped>
.root {
  margin: 4px;
}

.slider-container {
  width: 100%;
}
.slider-container > input {
  width: 100%;
}
</style>