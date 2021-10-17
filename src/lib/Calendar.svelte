<script lang="ts">
  import { onMount } from 'svelte';

  import Year from './Year.svelte';

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
</script>

<!-- space-y-8 not working -->
<div >
  {#each Object.keys(dates) as year}
    <Year key={year} year={dates[year]} />
  {/each}
</div>
