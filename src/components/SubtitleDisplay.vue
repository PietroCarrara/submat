<template>
  <div ref="main" v-if="vidStore.isVideoLoaded" id="main">
    <div class="cue-container" v-for="cue in subStore.cues" :style="calcPos(cue)">
      {{ cue.text }}
    </div>
    <div v-if="newCueStore.start != null && newCueStore.end == null" class="cue-container" :style="posAdding()">
      {{ newCueStore.content }}
    </div>
    <div id="end" class="cue-container" :style="{top: `${vidStore.duration*scale}px`}"></div>
  </div>
  <div ref="bar" id="bar"></div>
</template>

<script lang="ts">
import { useNewCueStore } from '@/stores/new-cue';
import { useSubtitleStore } from '@/stores/subtitle';
import { useVideoStore } from '@/stores/video';

export default {
  setup() {
    const vidStore = useVideoStore();
    const subStore = useSubtitleStore();
    const newCueStore = useNewCueStore();

    return {
      vidStore,
      subStore,
      newCueStore,
      scale: 100,
    }
  },

  methods: {
    calcPos(cue: VTTCue) {
      const top = cue.startTime;
      const height = cue.endTime - cue.startTime;

      return `top: ${top*this.scale}px; height: ${height*this.scale}px`;
    },
    posAdding() {
      const start = this.newCueStore.start ?? 0;
      const top = start;
      const height = this.vidStore.currentTime - start;

      return `top: ${top*this.scale}px; height: ${height*this.scale}px`;
    },
  },

  watch: {
    'vidStore.currentTime'() {
      const main = this.$refs.main as HTMLDivElement;
      const bar = this.$refs.bar as HTMLDivElement;
      const root = main.parentElement;
      if (root == null) {
        return;
      }

      const mid = root.scrollHeight / 2;
      const position = this.vidStore.currentTime * this.scale;

      bar.style.top = `${Math.min(position, mid)}px`;

      main.scroll({
        top: position - mid,
        behavior: 'smooth',
      });
    }
  }
}
</script>

<style scoped>
#main {
  height: 100%;
  overflow: scroll;
}

#end {
  height: 100vh;
}

#bar {
  position: absolute;
  width: 100%;
  left: 0;
  height: 2px;
  background-color: red;
}

.cue-container {
  position: absolute;
  box-sizing: border-box;
  left: 0;
  width: 100%;
  background-color: var(--vt-c-indigo);
  border-bottom: 4px solid var(--color-border);
}
</style>