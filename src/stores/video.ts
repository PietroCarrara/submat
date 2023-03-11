import { computed, ref, type Ref } from "vue";
import { defineStore } from "pinia";

// https://pinia.vuejs.org/core-concepts/#setup-stores
export const useVideoStore = defineStore("video", () => {
  const video = ref<HTMLMediaElement|null>(null);

  const currentTime = ref(0);
  const duration = ref(0);
  const isPlaying = ref(false);

  /**
   * Sets the video to be used by the store
   */
  function setVideo(v: HTMLMediaElement|null) {
    if (video.value !== null) {
      // TODO: Unregister events
    }

    video.value = v;
    if (v === null) {
      return;
    }

    v.addEventListener('timeupdate', updateCurrentTime);
    currentTime.value = v.currentTime;

    v.addEventListener('durationchange', updateDuration);
    duration.value = v.duration;

    v.addEventListener('pause', updatePaused);
    v.addEventListener('play', updatePlaying);
  }

  function updateCurrentTime() {
    if (video.value !== null) {
      currentTime.value = video.value.currentTime;
    }
  }

  /**
   * Sets the current video time (seeking)
   * @param time The desired video position in seconds
   */
  function setCurrentTime(time: number) {
    if (video.value !== null) {
      video.value.currentTime = time;
    } else {
      console.warn("setting video time but no video present!");
    }
  }
  /**
   * Goes back a number of seconds
   * @param seconds The number of seconds to rewind
   */
  function rewind(seconds: number) {
    if (video.value !== null) {
      video.value.currentTime = Math.max(0, video.value.currentTime - seconds);
    } else {
      console.warn("rewinding video but no video present!");
    }
  }
  /**
   * Goes forward a number of seconds
   * @param seconds The number of seconds to advance
   */
  function advance(seconds: number) {
    if (video.value !== null) {
      video.value.currentTime = Math.min(video.value.duration, video.value.currentTime + seconds);
    } else {
      console.warn("advancing video but no video present!");
    }
  }

  function updateDuration() {
    if (video.value !== null) {
      duration.value = video.value.duration;
    }
  }

  function updatePlaying() {
    if (video.value !== null) {
      isPlaying.value = true;
    }
  }
  function updatePaused() {
    if (video.value !== null) {
      isPlaying.value = false;
    }
  }

  function getVideoLoaded() {
    return video.value !== null;
  }
  const isVideoLoaded = computed(getVideoLoaded);

  /**
   * Pauses the video
   */
  function pause() {
    if (video.value !== null) {
      video.value.pause();
    }
  }
  /**
   * Resumes the video
   */
  function play() {
    if (video.value !== null) {
      video.value.play();
    }
  }
  /**
   * Toggles between pause and play
   */
  function togglePausePlay() {
    if (video.value !== null) {
      if (video.value.paused) {
        video.value.play();
      } else {
        video.value.pause();
      }
    }
  }

  const fps = 24;
  setInterval(() => {
    if (video.value != null && isPlaying.value && !video.value.seeking) {
      currentTime.value += 1/fps;
    }
  }, 1000 / fps)

  // The returned objects are the ones that will be exposed to be accessed via the store
  return {
    currentTime,
    duration,
    isPlaying,
    isVideoLoaded,
    pause,
    play,
    togglePausePlay,
    setCurrentTime,
    advance,
    rewind,
    setVideo,
  };
});
