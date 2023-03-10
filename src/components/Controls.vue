<template>
  <div v-if="vidStore.isVideoLoaded">
    <!-- https://primevue.org/icons -->
    <div class="control">
      <i class="big pi enabled" :class="{'pi-pause': vidStore.isPlaying, 'pi-play': !vidStore.isPlaying}" @click="toggle"></i>
    </div>
    <div class="control">
      <i class="big pi enabled pi-backward" @click="rewind"></i>
    </div>
    <div class="control">
      <i class="big pi enabled pi-forward" @click="advance"></i>
    </div>
    <div class="control">
      <i class="big pi enabled pi-plus" @click="startCue"></i>
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
    }
  },

  methods: {
    toggle() {
      this.vidStore.togglePausePlay();
    },
    advance() {
      this.vidStore.advance(5);
    },
    rewind() {
      this.vidStore.rewind(5);
    },
    startCue() {
      // TODO: Set the current time as the start of a new cue
    }
  },

  // When this component is mounted, it registers to listen
  // to the dancemat events.
  mounted() {
    // TODO: Deregister on unmount
    this.$onDancematPress("lowerRight", this.advance);
    this.$onDancematPress("lowerLeft", this.rewind);
  },
}
</script>

<style scoped>
.control {
  display: inline-block;
  padding: 0 0.5rem;
}

.big {
  font-size: 1.25rem;
}

.enabled {
  cursor: pointer;
}
</style>