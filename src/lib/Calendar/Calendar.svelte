<script lang="ts">
  import type { DestinyHistoricalStatsPeriodGroup } from 'bungie-api-ts/destiny2';
  import { onDestroy, onMount } from 'svelte';

  import Year from './Year.svelte';
  import { activities } from '~/stores';

  const dates: any = {};

  onMount(() => {
    const day = new Date('2017, Sept 1');
    const now = new Date();

    while (day <= now) {
      const year = day.getFullYear();
      const month = day.getMonth() + 1;
      const date = day.getDate();

      if (!dates.hasOwnProperty(year)) dates[year] = {};
      if (!dates[year].hasOwnProperty(month)) dates[year][month] = {};
      if (!dates[year][month].hasOwnProperty(date))
        dates[year][month][date] = new Date(year, month - 1, date);

      day.setDate(date + 1);
    }
  });

  let activities_value: DestinyHistoricalStatsPeriodGroup[];
  const activities_unsubscribe = activities.subscribe(value => (activities_value = value));
  onDestroy(() => activities_unsubscribe());

  // replace activities_value by object with key-value
</script>

<!-- space-y-8 not working -->
<div>
  {#each Object.keys(dates) as year}
    <Year
      key={year}
      year={dates[year]}
      activities={activities_value.filter(
        a => new Date(a.period).getFullYear().toString() === year
      )}
    />
  {/each}
</div>
