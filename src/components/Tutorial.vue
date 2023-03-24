<script lang="ts" setup>
  import MatDiagram from './MatDiagram.vue';
</script>

<template>
  <div>
    <div class="modal modal-lg" id="modal-el" ref="modal-el" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
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
                  <MatDiagram :pos-x="1" :pos-y="2" />
                </div>
                <div class="col-md-7">
                  <p>
                    Use a seta esquerda para pausar e reproduzir o vídeo.
                  </p>
                  <video ref="video3" src="/video/tutorial.mp4" loop autoplay>
                  </video>
                </div>
              </div>

              <div v-else-if="stage == 4" class="row">
                <div class="col-md-5">
                  <MatDiagram :pos-x="2" :pos-y="3" />
                </div>
                <div class="col-md-7">
                  <p>
                    Para marcar o início de uma fala, use a seta inferior. Aperte-a novamente
                    para marcar o fim da fala. As zonas em azul marcam onde estão suas falas.
                  </p>
                  <video ref="video4" src="/video/tutorial.mp4" loop autoplay>
                  </video>
                  <div class="sub-box">
                    <div v-for="cue of stages[4].cues" class="sub-item" :style="{left: cue.start*100+'%', width: (cue.end-cue.start)*100+'%'}">
                    </div>
                    <div v-if="stages[4].start != -1" class="sub-item" :style="{left: stages[4].start*100+'%', width: (stages[4].progress-stages[4].start)*100+'%'}">
                    </div>
                    <div class="progress-tick" :style="{left: stages[4].progress*100+'%'}">
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="stage == 5" class="row">
                <div class="col-md-5">
                  <MatDiagram :pos-x="1" :pos-y="2" />
                </div>
                <div class="col-md-7">
                  <p>
                    O conteúdo das legendas é editável através de um controle de texto:
                  </p>
                  <div>
                    <video ref="video5" src="/video/tutorial.mp4" loop autoplay>
                    </video>
                    <span class="subtitle">{{ stages[5].text }}</span>
                  </div>
                  <textarea autofocus v-model="stages[5].text"></textarea>
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
        4: {
          progress: 0,
          cues: [] as {start: number, end: number}[],
          start: -1,
        },
        5: {
          text: "Encontrado apenas nos desertos da América do Norte, este predador está adapdato à vida no solo.",
        }
      }
    };
  },
  mounted() {
    this.modal = new Modal(this.$refs["modal-el"] as HTMLElement);
    this.modal.show();

    this.$onDancematPress("down", () => this.onKeyPress("down"));
    this.$onDancematPress("midLeft", () => this.onKeyPress("midLeft"));
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
      if (this.stage >= 6) {
        this.exit();
      }
    },
    onKeyPress(key: string) {
      if (this.stage === 3) {
        const video = this.$refs.video3 as HTMLVideoElement;
        if (key === "midLeft") {
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
        }
      }

      if (this.stage === 4) {
        const video = this.$refs.video4 as HTMLVideoElement;
        if (key === "down") {
          if (this.stages[4].start === -1) {
            this.stages[4].start = video.currentTime / video.duration;
          } else {
            const end = video.currentTime / video.duration;
            this.stages[4].cues.push({
              start: this.stages[4].start,
              end,
            });
            this.stages[4].start = -1;
          }
        }
      }
    },
    onEnterStage(stage: number) {
      switch (stage) {
        case 4:
          const video = this.$refs.video4 as HTMLVideoElement;
          video.addEventListener("timeupdate", () => {
            this.stages[4].progress = video.currentTime / video.duration;
          });
          break;
      }
    },
    onExitStage(stage: number) {

    },
    exit() {
      this.stage = 0;
      this.modal?.hide();
    },
  },
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
.subtitle {
  box-sizing: border-box;
  position: absolute;
  left: 0;
  bottom: 0;
  margin-bottom: 6px;
  width: 100%;
  height: 3.5em;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.75);
}
textarea {
  width: 100%;
  min-height: 5em;
}
</style>