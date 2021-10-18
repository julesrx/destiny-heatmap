<script lang="ts">
  import type { DestinyHistoricalStatsPeriodGroup } from 'bungie-api-ts/destiny2';

  import Month from './Month.svelte';

  export let key: string;
  export let year: any;

  export let activities: DestinyHistoricalStatsPeriodGroup[] = [];
</script>

<div class="flex mb-8 space-x-2">
  <div class="flex items-center transform -rotate-90">{key}</div>

  <!-- space-x-6 not working -->
  <div class="flex justify-start">
    {#each Object.keys(year) as month}
      <Month
        key={month}
        month={year[month]}
        activities={activities.filter(
          a => (new Date(a.period).getMonth() + 1).toString() === month
        )}
      />
    {/each}
  </div>
</div>
