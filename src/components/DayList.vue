<template>
  <div class="day-list">
    <div v-if="!state.flatDates || !state.flatDates.length" class="no-data">
      <p>no data</p>
    </div>
    <template v-else>
      <Day v-for="d in state.flatDates" :key="d" :day="d" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Day from "./Day.vue";
import activities from "../activities";

export default defineComponent({
  components: { Day },
  setup() {
    return { state: activities.state };
  },
});
</script>

<style scoped>
.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

p {
  margin: 0;
}

.day-list {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 400px;
  margin-bottom: 0.5em;
}
</style>
