<script lang="ts" setup>
  import MatDiagram from './MatDiagram.vue';
</script>

<template>
  <div>
    <div class="modal modal-lg" id="modal-el" ref="modal-el" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Tutorial</h5>
          </div>
          <div class="modal-body">
            <div class="container-fluid">

              <div v-if="stage == 1" class="row">
                <div class="col-md-5">
                  <MatDiagram :pos-x="3" :pos-y="3" />
                </div>
                <div class="col-md-7">
                  <h2>Bem vindo ao Subtitle Mat!</h2>
                  <p>
                    Caso não tenha um tapete ou não queira fazer este tutorial, você pode clicar em
                    "Pular".
                  </p>
                  <p>
                    Vamos lá: Para avançar, use o botão inferior direito. Teste-o neste vídeo:
                  </p>
                  <video ref="video1" src="/video/tutorial.mp4" loop autoplay>
                  </video>
                  <p>
                  </p>
                </div>
              </div>

              <div v-else-if="stage == 2" class="row">
                <div class="col-md-5">
                  <MatDiagram :pos-x="1" :pos-y="3" />
                </div>
                <div class="col-md-7">
                  <p>
                    Para retroceder no vídeo, use o botão do outro lado. Vá em frente,
                    teste-o!
                  </p>
                  <video ref="video2" src="/video/tutorial.mp4" loop autoplay>
                  </video>
                </div>
              </div>

              <div v-else-if="stage == 3" class="row">
                <div class="col-md-5">
                  <MatDiagram :pos-x="2" :pos-y="3" />
                </div>
                <div class="col-md-7">
                  <p>
                    Para marcar o início de uma fala, use a seta inferior. Aperte-a novamente
                    para marcar o fim da fala. As zonas em azul marcam onde estão suas falas.
                  </p>
                  <video ref="video3" src="/video/tutorial.mp4" loop autoplay>
                  </video>
                  <div class="sub-box" ref="state3subbox">
                    <div v-for="cue of stages[3].cues" class="sub-item" :style="{left: cue.start*100+'%', width: (cue.end-cue.start)*100+'%'}">
                    </div>
                    <div v-if="stages[3].start != -1" class="sub-item" :style="{left: stages[3].start*100+'%', width: (stages[3].progress-stages[3].start)*100+'%'}">
                    </div>
                    <div class="progress-tick" :style="{left: stages[3].progress*100+'%'}">
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="prev">Voltar</button>
            <button class="btn btn-primary" @click="next">Avançar</button>
          </div>
        </div>
      </div>
    </div>
</div>
</template>

<script lang="ts">
import { Modal } from "bootstrap";

export default {
  data() {
    return {
      modal: null as Modal | null,
      stage: 1,
      stages: {
        3: {
          progress: 0,
          cues: [] as {start: number, end: number}[],
          start: -1,
        }
      }
    };
  },
  mounted() {
    this.modal = new Modal(this.$refs["modal-el"] as HTMLElement);
    this.modal.show();

    this.$onDancematPress("down", () => this.onKeyPress("down"));
    this.$onDancematPress("lowerLeft", () => this.onKeyPress("lowerLeft"));
    this.$onDancematPress("lowerRight", () => this.onKeyPress("lowerRight"));
  },
  unmounted() {
    // TODO: Deregister dancemat events
  },
  methods: {
    async prev() {
      if (this.stage > 1) {
        let time = 0;
        if (this.$refs['video' + this.stage]) {
          // Preserve time between screens
          time = (this.$refs['video' + this.stage] as HTMLVideoElement).currentTime;
        }

        this.onExitStage(this.stage);
        this.stage--;
        await this.$nextTick();

        if (this.$refs['video' + this.stage]) {
          // Preserve time between screens
          (this.$refs['video' + this.stage] as HTMLVideoElement).currentTime = time;
        }
        this.onEnterStage(this.stage);
      }
    },
    async next() {
      let time = 0;
      if (this.$refs['video' + this.stage]) {
        // Preserve time between screens
        time = (this.$refs['video' + this.stage] as HTMLVideoElement).currentTime;
      }

      this.onExitStage(this.stage);
      this.stage++;
      await this.$nextTick();

      if (this.$refs['video' + this.stage]) {
        // Preserve time between screens
        (this.$refs['video' + this.stage] as HTMLVideoElement).currentTime = time;
      }

      this.onEnterStage(this.stage);
      if (this.stage >= 4) {
          this.modal?.hide();
      }
    },
    onKeyPress(key: string) {
      switch (this.stage) {
        case 3:
          const video = this.$refs.video3 as HTMLVideoElement;
          console.log(video);
          if (key === "down") {
            if (this.stages[3].start === -1) {
              this.stages[3].start = video.currentTime / video.duration;
            } else {
              const end = video.currentTime / video.duration;
              this.stages[3].cues.push({
                start: this.stages[3].start,
                end,
              });
              this.stages[3].start = -1;
            }
          }
          break;
      }
    },
    onEnterStage(stage: number) {
      switch (stage) {
        case 3:
          const video = this.$refs.video3 as HTMLVideoElement;
          video.addEventListener("timeupdate", () => {
            this.stages[3].progress = video.currentTime / video.duration;
          });
          break;
      }
    },
    onExitStage(stage: number) {

    },
  },
  watch: {
    'this.$refs.video3.currentTime'(time: number) {
      console.log(time);
    }
  }
}
</script>

<style scoped>
video {
  max-width: 100%;
}

.sub-box {
  height: 64px;
  background-color: black;
  overflow-x: hidden;
}
.sub-item {
  height: 100%;
  background-color: #2c3e50;
  position: absolute;
}
.progress-tick {
  position: absolute;
  height: 100%;
  width: 4px;
  background-color: rgba(255, 255, 255, 0.75);
}
</style>