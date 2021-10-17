<script lang="ts">
  import { onMount } from 'svelte';

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
      if (!dates[year][month].hasOwnProperty(date)) dates[year][month][date] = {};

      day.setDate(date + 1);
    }

    console.log(dates);
    console.log(Object.keys(dates['2018']));
  });
</script>

{#each Object.keys(dates) as year}
  <div>
    <span>{year}</span>

    {#each Object.keys(dates[year]) as month}
      <div class="ml-4">
        <span>{month}</span>

        {#each Object.keys(dates[year][month]) as day}
          <div class="ml-8">
            <span>{day}</span>
          </div>
        {/each}
      </div>
    {/each}
  </div>
{/each}
