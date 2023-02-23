<template>
  <div>
    <video
      ref="video"
      :style="{ display: videoURL ? 'block' : 'none' }"
      :src="videoURL"
      controls
      autoplay
    />
    <div v-if="!videoURL">
      <input type="file" @change="loadVideo($event as any)" />
    </div>
  </div>
</template>

<script lang="ts">
import { useSubtitleStore } from "@/stores/subtitle";

interface InputChangeEvent extends Event {
  target: HTMLInputElement;
}

export default {
  setup() {
    const store = useSubtitleStore();

    return {
      store,
    };
  },
  data() {
    return {
      videoURL: "",
    };
  },
  methods: {
    loadVideo(event: InputChangeEvent) {
      if (event.target.files && event.target.files.length == 1) {
        const file = event.target.files[0];

        if (this.videoURL) {
          URL.revokeObjectURL(this.videoURL);
        }
        this.videoURL = URL.createObjectURL(file);

        const video = this.$refs.video as HTMLVideoElement;

        const subs = video.addTextTrack("subtitles", "Subtitle");
        this.store.setSubtitle(subs);
      } else {
        this.videoURL = "";
      }
    },
  },
};
</script>

<style scoped>
video {
  width: 100%;
  height: 100%;
}
</style>
