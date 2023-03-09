<script setup lang="ts">
import VideoPlayer from "./VideoPlayer.vue";
import SubtitleDisplay from "./SubtitleDisplay.vue";
</script>

<template>
  <div class="container-fluid">
    <div id="top" class="row">
      <div class="col-8">
        <VideoPlayer />
      </div>
      <div class="col-4">
        <SubtitleDisplay />
      </div>
    </div>
    <div id="middle" class="row">
      <div class="col-8">

      </div>
      <div class="col-4">
        <VideoControls />
      </div>
    </div>
    <div id="bottom" class="row">
      <div class="col-12">
        <TextEdit />
      </div>
    </div>
  </div>
</template>

<style scoped>
#top {
  height: 70vh;
}

#middle {
  height: 5vh;
}

#bottom {
  height: 25vh;
}
</style>
