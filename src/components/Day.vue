<template>
  <li>{{ date }} : {{ acts }}</li>
</template>

<script lang="ts">
import { computed, defineComponent, defineProps } from "vue";

import { CustomHistoricalStatsPeriodGroup } from "../interfaces";
import activities from "../activities";

export default defineComponent({
  props: {
    day: { type: Date, required: true },
  },
  setup(props) {
    const intl = Intl.DateTimeFormat();
    const date = computed(() => intl.format((props.day as unknown) as Date));

    const acts = computed(() => {
      const day = (props.day as unknown) as Date;
      const r = activities.state.dates[day.getFullYear()]?.[day.getMonth() + 1]?.[day.getDate()];

      const seconds = !r
        ? 0
        : r.reduce(
            (a: number, b: CustomHistoricalStatsPeriodGroup) =>
              a + b.values["timePlayedSeconds"].basic.value,
            0
          );

      const hours = Math.trunc(seconds / 60 / 60);
      const minutes = Math.trunc(seconds / 60);

      return `${hours}h ${minutes - hours * 60}m ${seconds - minutes * 60}s (${seconds}s)`;
    });

    return { date, acts };
  },
});
</script>
