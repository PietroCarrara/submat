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
    <div v-if="newCueStore.start == null" class="control">
      <i class="big pi enabled pi-step-backward-alt" @click="startCue"></i>
    </div>
    <div v-if="newCueStore.start != null && newCueStore.end == null" class="control">
      <i class="big pi enabled pi-step-forward-alt" @click="endCue"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { useVideoStore } from '@/stores/video';
import { useNewCueStore } from '@/stores/new-cue';
import { useSubtitleStore } from '@/stores/subtitle';

export default {
  setup() {
    const vidStore = useVideoStore();
    const subStore = useSubtitleStore();
    const newCueStore = useNewCueStore();

    return {
      vidStore,
      subStore,
      newCueStore,
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
      if (this.vidStore.isVideoLoaded) {
        this.newCueStore.start = this.vidStore.currentTime;
        this.pushCue();
      }
    },
    endCue() {
      if (this.vidStore.isVideoLoaded) {
        this.newCueStore.end = this.vidStore.currentTime;
        this.pushCue();
      }
    },
    pushCue() {
      if (this.newCueStore.start != null && this.newCueStore.end != null) {
        this.subStore.addCue(
          this.newCueStore.start,
          this.newCueStore.end,
          this.newCueStore.content,
        );

        this.newCueStore.$reset();
      }
    },
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