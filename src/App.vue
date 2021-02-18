<template>
  <form @submit.prevent="onSubmit">
    <input type="text" v-model="gamertag" autofocus />
  </form>

  <p>{{ state.activities.length }}</p>

  <pre>{{ max }}</pre>

  <ul>
    <Day v-for="d in state.flatDates" :key="d" :day="d" />
  </ul>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import Day from "./components/Day.vue";
import activities from "./activities";

export default defineComponent({
  components: { Day },
  setup() {
    const gamertag = ref("Myjulot");
    const onSubmit = () => {
      if (gamertag.value) {
        activities.startSearch(gamertag.value);
      }
    };

    return {
      gamertag,
      onSubmit,

      max: activities.maxTime,
      state: activities.state,
    };
  },
});
</script>
