<!-- https://vuejs.org/api/sfc-spec.html#sfc-syntax-specification -->

<template>
  <div style="position: relative; top: 20px">
    <!--
      If the videoURL is not set, we'll hide the video (display: none).
      https://vuejs.org/guide/essentials/class-and-style.html#binding-html-classes
    -->
    <video
      ref="video"
      :style="{ display: videoURL ? 'block' : 'none' }"
      :src="videoURL"
      controls
      autoplay
    />
    <!-- if the videoURL is not set, display a filepicker to the user -->
    <div v-if="!videoURL">
      <input type="file" @change="loadVideo($event as InputChangeEvent)" />
    </div>
    <div v-if="videoURL" class="progress" role="progressbar" aria-label="Progresso do video"  aria-valuemin="0" aria-valuemax="100" style="position: relative; top: 10px; height: 10px">
      <div class="progress-bar bg-success" ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { useSubtitleStore } from "@/stores/subtitle";
import { useVideoStore } from '@/stores/video';
import { isReactive } from 'vue';
// Declares
interface InputChangeEvent extends Event {
  target: HTMLInputElement;
}

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

  // When this component is mounted, it registers to listen
  // to the dancemat events.
  // https://vuejs.org/api/composition-api-lifecycle.html#onmounted
  mounted() {
    // TODO: Remove these and move them to another component
    this.$onDancematPress('lowerRight', () => {
      this.vidStore.advance(5);
    });
    this.$onDancematPress('lowerLeft', () => {
      this.vidStore.rewind(5);
    });
  },

  // Methods this object has
  // https://vuejs.org/api/options-state.html#methods
  methods: {
    // This should be called when the user loads a video.
    loadVideo(event: InputChangeEvent) {
      if (event.target.files && event.target.files.length == 1) {
        // Read the file chosen by the user
        const file = event.target.files[0];
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
      } else {
        this.vidStore.setVideo(null);
        this.videoURL = "";1
      }
    },
  },
  computed:{
    barra(){
      return this.vidStore.currentTime*100/this.vidStore.duration;
    },
  },
  watch:{
    barra(){
      var barra = document.querySelector(".progress-bar");
      barra.style.width=this.vidStore.currentTime*100/this.vidStore.duration+"%";
    },
  },
};
</script>

<style scoped>
/* https://vuejs.org/api/sfc-css-features.html#sfc-css-features */
video {
  width: 100%;
  height: 100%;
}
</style>
