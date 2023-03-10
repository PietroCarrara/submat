<script setup lang="ts">
import VideoPlayer from "./VideoPlayer.vue";
import SubtitleDisplay from "./SubtitleDisplay.vue";
import Controls from './Controls.vue';
</script>

<template>
  <div class="container-fluid">
    <div id="main" class="row">
      <div class="col-8">
        <VideoPlayer />
        <Controls />
        <TextEdit />
      </div>
      <div class="col-4">
        <SubtitleDisplay />
      </div>
    </div>
  </div>
</template>

<style scoped>
#main {
  height: 100vh;
}
</style>
