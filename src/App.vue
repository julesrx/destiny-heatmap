<template>
  <DayList />

  <form @submit.prevent="onSubmit">
    <input type="text" v-model="gamertag" autofocus />
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import DayList from "./components/DayList.vue";
import activities from "./activities";

export default defineComponent({
  components: { DayList },
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
    };
  },
});
</script>
