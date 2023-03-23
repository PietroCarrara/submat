<script setup lang="ts">
import VideoPlayer from "./VideoPlayer.vue";
import SubtitleDisplay from "./SubtitleDisplay.vue";
import Controls from './Controls.vue';
import CueEdit from './CueEdit.vue';
import VideoLoader from './VideoLoader.vue';
import Tutorial from './Tutorial.vue';
</script>

<template>
  <div data-bs-theme="dark">
    <Tutorial />
    <VideoLoader @loadvideo="loadVideo" @loadsubtitle="loadSubtitle" />
    <div class="container-fluid">
      <div id="main" class="row">
        <div class="col-8">
          <VideoPlayer ref="videoPlayer" />
          <Controls ref="controls" />
          <CueEdit />
        </div>
        <div class="col-4">
          <SubtitleDisplay />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  methods: {
    loadVideo(f: File) {
      const videoPlayer = this.$refs.videoPlayer as InstanceType<typeof VideoPlayer>;
      videoPlayer.loadVideo(f);
    },
    loadSubtitle(f: File) {
      const controls = this.$refs.controls as InstanceType<typeof Controls>;
      controls.openSubtitle(f);
    },
  },
}
</script>

<style scoped>
#main {
  height: 100vh;
  overflow: hidden;
}
</style>
