<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { BungieMembershipType, ServerResponse } from 'bungie-api-ts/common';
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

  const fetchActivities = async (character: DestinyCharacterComponent, page: number = 0) => {
    const mode = 5; //DestinyActivityModeType.AllPvP;
    const count = 250;

    const res = await api.get<ServerResponse<DestinyActivityHistoryResults>>(
      `Destiny2/${character.membershipType}/Account/${character.membershipId}/Character/${character.characterId}/Stats/Activities/`,
      {
        params: { count: count, mode: mode, page: page }
      }
    );

    if (!res.data.Response.activities) return;

    activities.update(n => n.concat(res.data.Response.activities));
    await fetchActivities(character, page + 1);
  };
</script>

<main class="pl-2 pt-2">
  <!-- What font h1 Pop OS -->
  <h1 class="text-4xl mb-4">Destiny 2 Heatmap</h1>

  {JSON.stringify(profile_value)}

  <Search />
  <Calendar />
</main>
