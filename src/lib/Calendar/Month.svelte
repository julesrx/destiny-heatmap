<script lang="ts">
  import type { DestinyHistoricalStatsPeriodGroup } from 'bungie-api-ts/destiny2';

  import Day from './Day.svelte';

  export let key: string;
  export let month: any;

  export let activities: DestinyHistoricalStatsPeriodGroup[] = [];
</script>

<div class="mr-6">
  <span>{key}</span>

  <div class="grid grid-rows-7 grid-flow-col">
    {#each Object.keys(month) as day}
      <Day
        date={month[day]}
        start={Number(day) === 1}
        activityCount={activities.filter(a => new Date(a.period).getDate().toString() === day)
          .length}
      />
    {/each}
  </div>
</div>
