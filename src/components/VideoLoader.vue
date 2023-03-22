<template>
  <div id="main">
    <div v-if="isDragging" class="drop-warning">
      <div class="warning-big">
        Largue um arquivo aqui para abrí-lo!
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      isDragging: true,
      timeoudID: -1,
    }
  },
  mounted() {
    window.addEventListener("drop", this.drop);
    window.addEventListener("dragover", this.dragover);
  },
  unmounted() {
    window.removeEventListener("drop", this.drop);
    window.removeEventListener("dragover", this.dragover);
  },
  methods: {
    drop(ev: DragEvent) {
      ev.preventDefault();
      this.isDragging = false;
      if (ev.dataTransfer?.items.length) {
        const file = ev.dataTransfer.items[0].getAsFile();
        if (file) {
          if (file.name.endsWith('mp4')) {
            this.$emit('loadvideo', file);
          } else if (file.name.endsWith('.srt')) {
            this.$emit('loadsubtitle', file);
          }
        }
      }
    },
    dragover(ev: DragEvent) {
      ev.preventDefault();
      this.isDragging = true;

      if (this.timeoudID !== -1) {
        clearTimeout(this.timeoudID);
      }
      this.timeoudID = setTimeout(() => {
        this.isDragging = false;
      }, 1000);
    },
  },
}
</script>

<style scoped>
#main {
  z-index: 1;

  display: inline;
  position: absolute;
  left: 0;
  top: 0;
}
.drop-warning {
  width: 100vw;
  height: 100vh;

  background-color: rgba(0, 0, 0, 0.5);
}

.warning-big {
  height: 100vh;
  width: 100vw;
  text-align: center;
  line-height: 100vh;

  font-size: xx-large;
  font-weight: bold;
}
</style>