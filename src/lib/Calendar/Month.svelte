<script lang="ts">
  import Day from './Day.svelte';

  export let key: string;
  export let month: any;
</script>

<div class="mr-6">
  <span>{key}</span>

  <div class="grid grid-rows-7 grid-flow-col">
    {#each Object.keys(month) as day}
      <Day date={month[day]} start={Number(day) === 1} />
    {/each}
  </div>
</div>
