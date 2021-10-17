<script lang="ts">
  import { getDay } from 'date-fns';

  export let date: Date;
  export let start: Boolean = false;

  // Assumes Monday is the first day of the week. If it's sunday, set getDay(date) + 1
  $: rowStart = start && `row-start-${getDay(date)}`;
</script>

<div
  class={`w-4 h-4 bg-dark-50 ${rowStart} cursor-pointer hover:(bg-dark-100)`}
  class:row_start_5={true}
  title={date.toString()}
/>
