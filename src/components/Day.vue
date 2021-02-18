<template>
  <li>{{ day }} : {{ acts }}</li>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from "vue";

import { CustomHistoricalStatsPeriodGroup } from "../interfaces";
import activities from "../activities";

export default defineComponent({
  props: {
    day: { type: Date, required: true },
  },
  setup(props) {
    const acts = computed(() => {
      const day = (props.day as unknown) as Date;
      const r = activities.state.dates[day.getFullYear()]?.[day.getMonth() + 1]?.[day.getDate()];
      if (!r) return 0;

      const seconds = r.reduce(
        (a: number, b: CustomHistoricalStatsPeriodGroup) =>
          a + b.values["timePlayedSeconds"].basic.value,
        0
      );

      const hours = Math.trunc(seconds / 60 / 60);
      const minutes = Math.trunc(seconds / 60);

      return `${hours}h ${minutes - hours * 60}m ${seconds - minutes * 60}s (${seconds}s)`;
    });

    return { acts };
  },
});
</script>
