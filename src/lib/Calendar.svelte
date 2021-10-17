<script lang="ts">
  import { onMount } from 'svelte';

  import Day from './Day.svelte';

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

{#each Object.keys(dates) as year}
  <div>
    <span>{year}</span>

    <div class="flex flex-wrap space-x-4">
      {#each Object.keys(dates[year]) as month}
        <div>
          <span>{month}</span>

          <div class="grid grid-rows-7 grid-flow-col">
            {#each Object.keys(dates[year][month]) as day}
              <Day date={dates[year][month][day]} start={Number(day) === 1} />
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
{/each}
