<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import axios from 'axios';
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
  import Note from 'lib/Note.svelte';
  import Calendar from 'lib/Calendar/Calendar.svelte';

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  let profile_value: UserSearchResponseDetail;
  const profile_unsubscribe = profile.subscribe(value => {
    profile_value = value;
  });
  onDestroy(() => profile_unsubscribe());

  // temp
  const membershipType = 1;
  const membershipId = '4611686018430712353';

  onMount(async () => {
    activities.update(() => []);

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
  onDestroy(() => {
    activities.update(() => []);
    source.cancel();
  });

  // inifnite loop ?
  const fetchActivities = async (character: DestinyCharacterComponent, page: number = 0) => {
    const count = 250;

    const res = await api.get<ServerResponse<DestinyActivityHistoryResults>>(
      `Destiny2/${character.membershipType}/Account/${character.membershipId}/Character/${character.characterId}/Stats/Activities/`,
      {
        params: { count: count, mode: 0, page: page },
        cancelToken: source.token
      }
    );

    if (!res.data.Response.activities) return;

    activities.update(a => a.concat(res.data.Response.activities));
    fetchActivities(character, page + 1);
  };
</script>

<main class="pl-2 pt-2">
  <h1 class="text-4xl mb-4">Destiny 2 Heatmap</h1>

  <Search />
  <Calendar />
</main>

<Note />
