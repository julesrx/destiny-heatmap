import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";

import "./main.css";

import App from "./App.vue";
import Home from "./views/Home.vue";
import Timeline from "./views/Timeline.vue";

const router = createRouter({
  routes: [
    { name: "Home", path: "/", component: Home },
    { name: "Timeline", path: "/:membershipType/:membershipId", component: Timeline },
    {
      name: "NotFound",
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
  history: createWebHashHistory(),
});

createApp(App).use(router).mount("#app");
