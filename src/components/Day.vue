<template>
  <li>
    <div :style="{ width: `${pourcent}%` }"></div>
    {{ date }} : {{ spent }} => ({{ pourcent }}%)
  </li>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import { CustomHistoricalStatsPeriodGroup } from "../interfaces";
import activities from "../activities";

export default defineComponent({
  props: {
    day: { type: Date, required: true },
  },
  setup(props) {
    const intl = Intl.DateTimeFormat();
    const date = computed(() => intl.format((props.day as unknown) as Date));

    const spent = computed(() => {
      const day = (props.day as unknown) as Date;
      const r = activities.state.dates[day.getFullYear()]?.[day.getMonth() + 1]?.[day.getDate()];

      return !r
        ? 0
        : r.reduce(
            (a: number, b: CustomHistoricalStatsPeriodGroup) =>
              a + b.values["timePlayedSeconds"].basic.value,
            0
          );

      // const hours = Math.trunc(seconds / 60 / 60);
      // const minutes = Math.trunc(seconds / 60);

      // return `${hours}h ${minutes - hours * 60}m ${seconds - minutes * 60}s (${seconds}s)`;
    });

    const pourcent = computed(() =>
      spent.value ? (spent.value / activities.maxTime.value) * 100 : 0
    );

    return { date, spent, pourcent };
  },
});
</script>

<style scoped>
div {
  background-color: red;
  height: 10px;
}
</style>
