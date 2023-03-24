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
      clear();
      subtitle.value.removeEventListener('cuechange', oncuechange);
      subtitle.value.mode = "disabled";
    }
    subtitle.value = s;
    subtitle.value.mode = "showing";

    // Update the active cue
    s.addEventListener('cuechange', oncuechange);
  }

  // Make cue changes responsive to Vue
  function oncuechange() {
    if (subtitle.value != null && subtitle.value.activeCues != null && subtitle.value.activeCues.length > 0) {
      // Modify the cue object so we can detect when it's text changes
      const cue = subtitle.value.activeCues[0] as VTTCue;
      Object.defineProperty(cue, '_text', {
        value: cue.text,
        writable: true,
      });
      Object.defineProperty(cue, 'text', {
        get() {
          return this._text;
        },
        set(v: string) {
          this._text = v;
          rebuildCues();
        },
      });

      activeCue.value = cue;
    } else {
      activeCue.value = null;
    }
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

  function addCues(cues: {start: number, end: number, text: string}[]) {
    if (subtitle.value) {
      for (const cue of cues) {
        const c = new VTTCue(cue.start, cue.end, cue.text);
        subtitle.value.addCue(c);
      }
      rebuildCues();
    }
  }

  function deleteCue(cue: VTTCue) {
    if (subtitle.value) {
      if (activeCue.value == cue) {
        activeCue.value = null;
      }
      subtitle.value.removeCue(cue);
      rebuildCues();
    }
  }

  function clear() {
    if (subtitle.value && subtitle.value.cues) {
      while (subtitle.value.cues.length > 0) {
        subtitle.value.removeCue(subtitle.value.cues[0]);
      }
      activeCue.value = null;
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
    addCues,
    deleteCue,
    clear,
  };
});
