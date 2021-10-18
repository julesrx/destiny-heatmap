<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { ServerResponse } from 'bungie-api-ts/common';
  import type { UserSearchResponseDetail } from 'bungie-api-ts/user';
  import type {
    DestinyActivityHistoryResults,
    DestinyCharacterComponent,
    DestinyProfileResponse
  } from 'bungie-api-ts/destiny2';

  import api from './api';
  import { profile, activities } from './stores';
  import Search from 'lib/Search.svelte';
  import Calendar from 'lib/Calendar/Calendar.svelte';

  let profile_value: UserSearchResponseDetail;
  const profile_unsubscribe = profile.subscribe(value => {
    profile_value = value;
  });
  onDestroy(() => profile_unsubscribe());

  // temp
  const membershipType = 1;
  const membershipId = '4611686018430712353';

  onMount(async () => {
    const res = await api.get<ServerResponse<DestinyProfileResponse>>(
      `Destiny2/${membershipType}/Profile/${membershipId}/`,
      {
        params: {
          components: '100,200'
        }
      }
    );

    var characters = Object.keys(res.data.Response.characters.data).map(
      key => (res.data.Response.characters.data ?? {})[key]
    );
    await Promise.all(characters.map(c => fetchActivities(c, 0)));
  });

  // inifnite loop ?
  const fetchActivities = async (character: DestinyCharacterComponent, page: number = 0) => {
    const count = 250;

    const res = await api.get<ServerResponse<DestinyActivityHistoryResults>>(
      `Destiny2/${character.membershipType}/Account/${character.membershipId}/Character/${character.characterId}/Stats/Activities/`,
      {
        params: { count: count, mode: 0, page: page }
      }
    );

    if (!res.data.Response.activities) return;

    // updateActivities(res.data.Response.activities);
    activities.update(a => a.concat(res.data.Response.activities));

    console.log(character.characterId, page);
    fetchActivities(character, page + 1);
  };
</script>

<main class="pl-2 pt-2">
  <!-- What font h1 Pop OS -->
  <h1 class="text-4xl mb-4">Destiny 2 Heatmap</h1>

  <Search />
  <Calendar />
</main>

<p class="text-dark-50 absolute bottom-0 right-0 text-right pb-1 pr-2">
  Note: this is a blatant copy of <a
    href="https://chrisfried.github.io/secret-scrublandeux/"
    target="_blank"
    rel="noreferrer noopener">Destiny 2 Historical Heatmap</a
  >
  by
  <a target="_blank" rel="noreferrer noopener" href="https://twitter.com/chrisfried">@chrisfried</a
  >, but done with Svelte, with dark mode and no authentification.
</p>

<style lang="postcss">
  a {
    @apply text-light-blue-900;
  }
</style>
