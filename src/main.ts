import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import dancematPlugin from "./plugins/dancemat"

import "./assets/main.css";

const app = createApp(App);

app.use(createPinia());
app.use(dancematPlugin);

app.mount("#app");
