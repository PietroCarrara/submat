<!-- https://vuejs.org/api/sfc-spec.html#sfc-syntax-specification -->

<template>
  <div>
    <!--
      If the videoURL is not set, we'll hide the video (display: none).
      https://vuejs.org/guide/essentials/class-and-style.html#binding-html-classes
    -->
    <video
      ref="video"
      @click="vidStore.togglePausePlay()"
      :style="{ display: videoURL ? 'block' : 'none' }"
      :src="videoURL"
      autoplay
    />
    <VideoProgressBar />
  </div>
</template>

<script lang="ts">
import { useSubtitleStore } from "@/stores/subtitle";
import { useVideoStore } from '@/stores/video';
import VideoProgressBar from './VideoProgressBar.vue';

export default {
  // Setup the stores. The return of this function makes causes the
  // stores to be available later via this.subStore and this.vidStore.
  // https://vuejs.org/api/composition-api-setup.html#basic-usage
  setup() {
    const subStore = useSubtitleStore();
    const vidStore = useVideoStore();
    return {
      subStore,
      vidStore,
    };
  },
  // "Declares" the videoURL variable. It's available later via
  // this.videoURL.
  // https://vuejs.org/api/options-state.html#data
  data() {
    return {
      videoURL: "",
    };
  },
  // Methods this object has
  // https://vuejs.org/api/options-state.html#methods
  methods: {
    // This should be called when the user loads a video.
    loadVideo(file: File) {
      if (file != null) {
        // Read the file chosen by the user
        if (this.videoURL) {
          URL.revokeObjectURL(this.videoURL);
        }
        this.videoURL = URL.createObjectURL(file);
        // Save the video element on the store
        const video = this.$refs.video as HTMLVideoElement;
        this.vidStore.setVideo(video);
        // Create a subtitle track and save it on the subtitle store
        const subs = video.addTextTrack("subtitles", "Subtitle");
        this.subStore.setSubtitle(subs);
      }
      else {
        this.subStore.clear();
        this.vidStore.setVideo(null);
        this.videoURL = "";
      }
    },
  },
  components: { VideoProgressBar }
};
</script>

<style scoped>
/* https://vuejs.org/api/sfc-css-features.html#sfc-css-features */
video {
  width: 100%;
  height: 100%;
  max-height: 60vh;
}
</style>
