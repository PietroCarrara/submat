import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNewCueStore = defineStore("new-cue", () => {
  const start = ref<number|null>(null);
  const end = ref<number|null>(null);
  const content = ref('');

  function $reset() {
    start.value = null;
    end.value = null;
    content.value = '';
  }

  return {
    start,
    end,
    content,
    $reset,
  }
});