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
    async enable(text: string) {
      this.enabled = true;
      this.text = text;

      const textarea = this.$refs.textarea as HTMLTextAreaElement;
      if (textarea != null) {
        textarea.value = text;
        await this.$nextTick();
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
      } else if (this.newCueStore.start != null && this.newCueStore.end == null) {
        this.newCueStore.content = this.text;
      }
    },
    newCueUpdate() {
      if (this.newCueStore.start != null && this.newCueStore.end == null) {
        this.enable(this.newCueStore.content);
      }
    }
  },
  watch: {
    'subStore.activeCue'() {
      if (this.subStore.activeCue == null) {
        this.disable();
      } else {
        this.enable(this.subStore.activeCue.text);
      }
    },

    'newCueStore.start'() {
      this.newCueUpdate();
    },
    'newCueStore.end'() {
      this.newCueUpdate();
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