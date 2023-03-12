<template>
  <div class="root">
    <textarea ref="textarea" v-if="vidStore.isVideoLoaded" autofocus :disabled="!enabled" @input="update"></textarea>
  </div>
</template>

<script lang="ts">
import { useNewCueStore } from '@/stores/new-cue';
import { useSubtitleStore } from '@/stores/subtitle';
import { useVideoStore } from '@/stores/video';

export default {
  setup() {
    const vidStore = useVideoStore();
    const subStore = useSubtitleStore();
    const newCueStore = useNewCueStore();

    return {
      vidStore,
      subStore,
      newCueStore,
    }
  },

  data() {
    return {
      text: '',
      enabled: false,
    }
  },

  methods: {
    disable() {
      this.text = '';
      this.enabled = false;

      const textarea = this.$refs.textarea as HTMLTextAreaElement;
      if (textarea != null) {
        textarea.value = '';
      }
    },

    enable(text: string) {
      this.enabled = true;
      this.text = text;

      const textarea = this.$refs.textarea as HTMLTextAreaElement;
      if (textarea != null) {
        textarea.value = text;
        textarea.focus();
      }
    },

    update() {
      const textarea = this.$refs.textarea as HTMLTextAreaElement;
      if (textarea == null) {
        return;
      }

      this.text = textarea.value;
      if (this.subStore.activeCue != null) {
        this.subStore.activeCue.text = this.text;
      }
    },
  },

  watch: {
    'subStore.activeCue'() {
      console.log(this.subStore.activeCue);
      if (this.subStore.activeCue == null) {
        this.disable();
      } else {
        this.enable(this.subStore.activeCue.text);
      }
    },
  },
}
</script>

<style scoped>
textarea {
  height: 30%;
  width: 100%;
  resize: none;
  font-size: 1.5rem;
}

.root {
  height: 100%;
  max-height: 100%;
}
</style>