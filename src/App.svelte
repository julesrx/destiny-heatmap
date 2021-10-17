<script lang="ts">
  import type { UserSearchResponseDetail } from 'bungie-api-ts/user';

  import { profile } from './stores';
  import Search from 'lib/Search.svelte';
  import Calendar from 'lib/Calendar/Calendar.svelte';

  let profile_value: UserSearchResponseDetail;
  const unsubscribe = profile.subscribe(value => {
    profile_value = value;
  });
</script>

<main class="pl-2 pt-2">
  <!-- What font h1 Pop OS -->
  <h1 class="text-4xl mb-4">Destiny 2 Heatmap</h1>

  {JSON.stringify(profile_value)}

  <Search />
  <Calendar />
</main>
