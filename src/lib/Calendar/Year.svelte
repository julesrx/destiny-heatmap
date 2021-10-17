<script lang="ts">
  import Month from './Month.svelte';

  export let key: string;
  export let year: any;
</script>

<div class="flex mb-8 space-x-2">
  <div class="flex items-center transform -rotate-90">{key}</div>

  <!-- space-x-6 not working -->
  <div class="flex justify-start">
    {#each Object.keys(year) as month}
      <Month key={month} month={year[month]} />
    {/each}
  </div>
</div>
