<template>
  <div v-if="vidStore.isVideoLoaded">
    <!-- https://primevue.org/icons -->
    <div class="control">
      <i class="big pi enabled" :class="{'pi-pause': vidStore.isPlaying, 'pi-play': !vidStore.isPlaying}" @click="toggle"></i>
    </div>
    <div class="control">
      <i class="big pi enabled pi-backward" @click="rewind"></i>
    </div>
    <div class="control">
      <i class="big pi enabled pi-forward" @click="advance"></i>
    </div>
    <div v-if="newCueStore.start == null" class="control">
      <i class="big pi enabled pi-step-backward-alt" @click="startCue"></i>
    </div>
    <div v-if="newCueStore.start != null && newCueStore.end == null" class="control">
      <i class="big pi enabled pi-step-forward-alt" @click="endCue"></i>
    </div>
    <div class="control">
      <i class="big pi enabled pi-delete-left" @click="deleteCue"></i>
    </div>

    <div class="control float-end">
      <i class="big pi enabled pi-save" @click="saveSubtitle"></i>
    </div>
    <div class="control float-end">
      <input style="display: none;" type="file" ref="fpicker" accept=".srt" @change="pickSubtitle" />
      <i class="big pi enabled pi-folder-open" @click="($refs.fpicker as any).click()"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { useVideoStore } from '@/stores/video';
import { useNewCueStore } from '@/stores/new-cue';
import { useSubtitleStore } from '@/stores/subtitle';
import { parse, write } from '../lib/srt';

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
  methods: {
    toggle() {
      this.vidStore.togglePausePlay();
    },
    advance() {
      this.vidStore.advance(5);
    },
    rewind() {
      this.vidStore.rewind(5);
    },
    deleteCue() {
      if (this.subStore.activeCue) {
        this.subStore.deleteCue(this.subStore.activeCue);
      }
    },
    toggleCue() {
      if (this.newCueStore.start == null) {
        this.startCue();
      } else {
        this.endCue();
      }
    },
    startCue() {
      if (this.vidStore.isVideoLoaded) {
        if (this.vidStore.isPlaying) {
          this.newCueStore.start = Math.max(this.vidStore.currentTime - 0.150, 0);
        } else {
          this.newCueStore.start = this.vidStore.currentTime;
        }

        // Stop cues from overlapping
        // This is not sufficient to stop all attemps to do so (e.g. start on a cue that ends
        // where another one begins), but most cases won't be like this
        if (this.subStore.activeCue) {
          this.newCueStore.start = this.subStore.activeCue.endTime;
        }

        this.pushCue();
        this.vidStore.play();
      }
    },
    endCue() {
      if (this.vidStore.isVideoLoaded) {
        this.newCueStore.end = this.vidStore.currentTime;

        // Stop cues from overlapping
        // This is not sufficient to stop all attemps to do so (e.g. end two cues down the line),
        // but most cases won't be like this
        if (this.subStore.activeCue) {
          this.newCueStore.end = this.subStore.activeCue.startTime;
        }

        this.vidStore.pause();
        this.vidStore.setCurrentTime(Math.max(0, this.newCueStore.end - 0.0001));
        this.pushCue();
      }
    },
    pushCue() {
      if (this.newCueStore.start != null && this.newCueStore.end != null) {
        this.subStore.addCue(
          this.newCueStore.start,
          this.newCueStore.end,
          this.newCueStore.content,
        );

        this.newCueStore.$reset();
      }
    },
    saveSubtitle() {
      const srt = write(this.subStore.cues.map(x => ({
        start: x.startTime,
        end: x.endTime,
        text: x.text,
      })));
      this.download('subtitles.srt', srt);
    },
    async openSubtitle(file: File) {
      const srt = parse(await file.text());
      this.subStore.clear();
      this.subStore.addCues(srt);
    },
    async pickSubtitle() {
      const fpicker = this.$refs.fpicker as HTMLInputElement;
      if (fpicker && fpicker.files && fpicker.files.length > 0) {
        this.openSubtitle(fpicker.files[0]);
      }
    },
    download(fname: string, contents: string) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contents));
      element.setAttribute('download', fname);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
  },

  // When this component is mounted, it registers to listen
  // to the dancemat events.
  mounted() {
    // TODO: Deregister on unmount
    this.$onDancematPress("midRight", this.deleteCue);
    this.$onDancematPress("midLeft", this.toggle);
    this.$onDancematPress("lowerRight", this.advance);
    this.$onDancematPress("lowerLeft", this.rewind);
    this.$onDancematPress("down", this.toggleCue);
  },
}
</script>

<style scoped>
.control {
  display: inline-block;
  padding: 0 0.5rem;
}

.big {
  font-size: 1.25rem;
}

.enabled {
  cursor: pointer;
}
</style>