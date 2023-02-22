<template>
  <div v-if="videoURL">
    <video :src="videoURL" controls autoplay />
  </div>
  <div v-else>
    <input type="file" @change="loadVideo($event as any)" />
  </div>
</template>

<script lang="ts">
interface InputChangeEvent extends Event {
  target: HTMLInputElement;
}

export default {
  data() {
    return {
      videoURL: "",
    }
  },
  methods: {
    loadVideo(event: InputChangeEvent) {
      if (event.target.files && event.target.files.length == 1) {
        const file = event.target.files[0];

        if (this.videoURL) {
          URL.revokeObjectURL(this.videoURL);
        }
        this.videoURL = URL.createObjectURL(file);
      } else {
        this.videoURL = "";
      }
    }
  }
}
</script>

<style scoped>
video {
  width: 100%;
  height: 100%;
}
</style>