<script lang="ts">
  import { getDay } from 'date-fns';

  export let date: Date;
  export let start: Boolean = false;

  export let activityCount: number = 0;
  const getDayColor = (activityCount: number) => {
    if (activityCount > 0) return 'bg-[#01ff00]';

    return 'bg-dark-50';
  };

  // Assumes Monday is the first day of the week. If it's sunday, set getDay(date) + 1
  $: rowStart = start && `row-start-${getDay(date)}`;
</script>

<div
  class={`w-4 h-4 ${rowStart} cursor-pointer hover:(bg-dark-100) ${getDayColor(activityCount)}`}
  title={date.toString() + activityCount}
/>
