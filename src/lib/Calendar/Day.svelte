<script lang="ts">
  import { getDay } from 'date-fns';
  import type { DestinyHistoricalStatsPeriodGroup } from 'bungie-api-ts/destiny2';

  export let date: Date;
  export let start: Boolean = false;

  export let activities: DestinyHistoricalStatsPeriodGroup[] = [];

  $: activityCount = activities.length;
  $: totalActivitiesTime = activities
    .map(a => a.values['timePlayedSeconds']?.basic.value ?? 0)
    .map(s => s / 60 / 60)
    .reduce((a, b) => a + b, 0);

  const timeToColor = (hours: number) => {
    if (hours <= 0) return 'bg-dark-50';

    // faster this way
    if (hours > 0 && hours < 1) return 'bg-[#01ff00]';
    if (hours >= 1 && hours < 2) return 'bg-[#6af000]';
    if (hours >= 2 && hours < 3) return 'bg-[#91df00]';
    if (hours >= 3 && hours < 4) return 'bg-[#aece00]';
    if (hours >= 4 && hours < 5) return 'bg-[#c4bc00]';
    if (hours >= 5 && hours < 6) return 'bg-[#d6a900]';
    if (hours >= 6 && hours < 7) return 'bg-[#e59400]';
    if (hours >= 7 && hours < 8) return 'bg-[#f17e00]';
    if (hours >= 8 && hours < 9) return 'bg-[#f96500]';
    if (hours >= 9 && hours < 10) return 'bg-[#fe4900]';
    if (hours >= 10) return 'bg-[#ff2000]';
  };

  // Assumes Monday is the first day of the week. If it's sunday, set getDay(date) + 1
  $: rowStart = start && `row-start-${getDay(date)}`;
</script>

<div
  class={`w-4 h-4 ${rowStart} cursor-pointer hover:(bg-dark-100) ${timeToColor(
    totalActivitiesTime
  )}`}
  title={date.toString() + activityCount}
/>
