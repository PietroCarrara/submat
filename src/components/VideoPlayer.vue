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
import { useVideoStore } from '@/stores/video';

interface InputChangeEvent extends Event {
  target: HTMLInputElement;
}

export default {
  setup() {
    const subStore = useSubtitleStore();
    const vidStore = useVideoStore();

    return {
      subStore,
      vidStore,
    };
  },
  data() {
    return {
      videoURL: "",
    };
  },
  mounted() {
    // TODO: Move them out of here
    this.$onDancematPress('lowerRight', () => {
      this.vidStore.advance(5);
    });
    this.$onDancematPress('lowerLeft', () => {
      this.vidStore.rewind(5);
    });
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
        this.vidStore.setVideo(video);

        const subs = video.addTextTrack("subtitles", "Subtitle");
        this.subStore.setSubtitle(subs);
      } else {
        this.vidStore.setVideo(null);
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
