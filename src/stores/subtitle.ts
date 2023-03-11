import { ref, computed, type Ref } from "vue";
import { defineStore } from "pinia";

// https://pinia.vuejs.org/core-concepts/#setup-stores
export const useSubtitleStore = defineStore("subtitle", () => {

  const subtitle = ref<TextTrack|null>(null);
  /**
   * List of cues contained in the subtitle
   */
  const cues = ref<VTTCue[]>([]);

  /**
   * Returns all the cues in the subtitle
   */
  function rebuildCues() {
    const res = [];

    if (subtitle.value != null && subtitle.value.cues != null) {
      for (const cue of subtitle.value.cues) {
        res.push(cue as VTTCue);
      }
    }

    cues.value = res;
  }

  /**
   * Returns the cue being displayed now
   */
  function getActiveCue() {
    return subtitle.value?.activeCues ? subtitle.value.activeCues[0] : null;
  }
  const activeCue = computed(getActiveCue);

  /**
   * Defines the texttrack to be used by the store.
   * @param s The text track to use
   */
  function setSubtitle(s: TextTrack) {
    if (subtitle.value != null) {
      subtitle.value.mode = "disabled";
    }
    subtitle.value = s;
    subtitle.value.mode = "showing";
  }

  /**
   * Adds a cue to the subtitle
   * @param start The time the cue should start in seconds
   * @param end The time the cue should end in seconds
   * @param text The contents of cue
   */
  function addCue(start: number, end: number, text: string) {
    if (subtitle.value) {
      const cue = new VTTCue(start, end, text);
      subtitle.value.addCue(cue);
      rebuildCues();
    }
  }

  // The returned objects are the ones that will be exposed to be accessed via the store
  return {
    subtitle,
    cues,
    activeCue,
    setSubtitle,
    addCue,
  };
});
