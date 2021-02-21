<template>
  <div class="day" :style="style"></div>
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

    const secondsSpent = computed(() => {
      const day = (props.day as unknown) as Date;
      const r = activities.state.dates[day.getFullYear()]?.[day.getMonth() + 1]?.[day.getDate()];

      return !r
        ? 0
        : r.reduce(
            (a: number, b: CustomHistoricalStatsPeriodGroup) =>
              a + b.values["timePlayedSeconds"].basic.value,
            0
          );
    });

    const pourcent = computed(() =>
      secondsSpent.value ? (secondsSpent.value / activities.maxTime.value) * 100 : 0
    );

    const style = computed(() => ({ height: `${pourcent.value}%` }));
    const title = computed(() => {
      const hours = Math.trunc(secondsSpent.value / 60 / 60);
      const minutes = Math.trunc(secondsSpent.value / 60);

      const time = `${hours}h ${minutes - hours * 60}m ${secondsSpent.value - minutes * 60}s (${
        secondsSpent.value
      }s)`;

      `${intl.format((props.day as unknown) as Date)}: ${time}`;
    });

    return { style, title };
  },
});
</script>

<style scoped>
.day {
  background-color: red;
  width: 1px;
}
</style>
