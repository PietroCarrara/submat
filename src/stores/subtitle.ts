import { ref, computed, type Ref } from "vue";
import { defineStore } from "pinia";

export const useSubtitleStore = defineStore("subtitle", () => {
  const subtitle: Ref<TextTrack> | Ref<null> = ref(null);

  // const cues = computed(() => subtitle.value?.cues ?? []);
  // const activeCue = computed(()
  //   subtitle.value?.activeCues ? subtitle.value.activeCues[0] : null
  // );

  function getCues() {
    return subtitle.value?.cues;
  }
  const cues = computed(getCues);

  function getActiveCue() {
    return subtitle.value?.activeCues ? subtitle.value.activeCues[0] : null;
  }
  const activeCue = computed(getActiveCue);

  function setSubtitle(s: TextTrack) {
    if (subtitle.value != null) {
      subtitle.value.mode = "disabled";
    }
    subtitle.value = s;
    subtitle.value.mode = "showing";
  }

  function addCue(start: number, end: number, text: string) {
    if (subtitle.value) {
      const cue = new VTTCue(start, end, text);
      subtitle.value.addCue(cue);
    }
  }

  return {
    subtitle,
    cues,
    activeCue,
    setSubtitle,
    addCue,
  };
});
