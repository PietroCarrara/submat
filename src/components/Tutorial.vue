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
      };
  },
  mounted() {
      this.modal = new Modal(this.$refs["modal-el"] as HTMLElement);
      this.modal.show();
  },
  methods: {
      async prev() {
        if (this.stage > 1) {
          // Preserve time between screens
          let time = 0;
          if (this.$refs['video' + this.stage]) {
            time = (this.$refs['video' + this.stage] as HTMLVideoElement).currentTime;
          }

          this.stage--;
          await this.$nextTick();

          if (this.$refs['video' + this.stage]) {
            (this.$refs['video' + this.stage] as HTMLVideoElement).currentTime = time;
          }
        }
      },
      async next() {
        // Preserve time between screens
        let time = 0;
        if (this.$refs['video' + this.stage]) {
          time = (this.$refs['video' + this.stage] as HTMLVideoElement).currentTime;
        }

        this.stage++;
        await this.$nextTick();

        if (this.$refs['video' + this.stage]) {
          (this.$refs['video' + this.stage] as HTMLVideoElement).currentTime = time;
        }

        if (this.stage >= 3) {
            this.modal?.hide();
        }
      },
  },
}
</script>

<style scoped>
  video {
    max-width: 100%;
  }
</style>