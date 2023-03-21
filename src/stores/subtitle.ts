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
   * Cue currently being displayed
   */
  const activeCue = ref<VTTCue|null>(null);

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
   * Defines the texttrack to be used by the store.
   * @param s The text track to use
   */
  function setSubtitle(s: TextTrack) {
    if (subtitle.value != null) {
      subtitle.value.mode = "disabled";
      // TODO: Remove event listeners
    }
    subtitle.value = s;
    subtitle.value.mode = "showing";

    // Update the active cue
    s.addEventListener('cuechange', function() {
      if (subtitle.value != null && subtitle.value.activeCues != null && subtitle.value.activeCues.length > 0) {
        // Modify the cue object so we can detect when it's text changes
        const cue = subtitle.value.activeCues[0] as VTTCue;
        const cueMod = {
          ...cue,
          get text() {
            return cue.text;
          },
          set text(s: string) {
            cue.text = s;
            // Update cues
            rebuildCues();
          },
        }
        activeCue.value = cueMod;
      } else {
        activeCue.value = null;
      }
    });
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

  function clear() {
    if (subtitle.value) {
      for (const cue of cues.value) {
        subtitle.value.removeCue(cue);
      }
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
    clear,
  };
});
