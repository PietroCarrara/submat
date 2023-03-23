<script lang="ts" setup>
  import MatDiagram from './MatDiagram.vue';
</script>

<template>
  <div>
    <div class="modal modal-lg" ref="modal-el" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Tutorial</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="container-fluid">

              <div v-if="stage == 1" class="row">
                <div class="col-md-5">
                  <MatDiagram :pos-x="3" :pos-y="3" />
                </div>
                <div class="col-md-7">
                  <h2>Bem vindo ao Subtitle Mat!</h2>
                  <p>Vamos começar o nosso tutorial de como usar o sistema?</p>
                  <p>
                    À esquerda você pode ver o diagrama representando o seu tapete.
                    Ele será usado ao longo do tutorial para indicar as funcionalidades
                    de cada botão.
                  </p>
                  <p>
                    Vamos lá: Para avançar, use o botão inferior direito. Ela lhe permite avançar
                    tanto o vídeo quanto este tutorial.
                  </p>
                  <p>
                    Caso não tenha um tapete ou não queira fazer o tutorial, você pode clicar em "Pular".
                  </p>
                </div>
              </div>

              <div v-else-if="stage == 2">
                Estágio 2
              </div>

            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Pular</button>
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
      next() {
          this.stage++;
          if (this.stage >= 3) {
              this.modal?.hide();
          }
      },
  },
}
</script>
