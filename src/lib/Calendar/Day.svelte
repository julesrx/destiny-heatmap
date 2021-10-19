<script lang="ts">
  import { getDay } from 'date-fns';
  import type { DestinyHistoricalStatsPeriodGroup } from 'bungie-api-ts/destiny2';

  import { getBackgroundColorFromTimePlayed } from '../../utils';

  export let date: Date;
  export let start: Boolean = false;

  export let activities: DestinyHistoricalStatsPeriodGroup[] = [];

  $: activityCount = activities.length;
  $: totalActivitiesTime = activities
    .map(a => a.values['timePlayedSeconds']?.basic.value ?? 0)
    .reduce((a, b) => a + b, 0);
  $: bgColor = getBackgroundColorFromTimePlayed(totalActivitiesTime);

  // Assumes Monday is the first day of the week. If it's sunday, set getDay(date) + 1
  $: rowStart = start && `row-start-${getDay(date)}`;
</script>

<div
  class={`w-4 h-4 ${rowStart} cursor-pointer `}
  style={`background-color: ${bgColor}`}
  title={date.toString() + activityCount}
/>
