<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import axios from 'axios';
  import type { BungieMembershipType, ServerResponse } from 'bungie-api-ts/common';
  import type { UserSearchResponseDetail } from 'bungie-api-ts/user';
  import type {
    DestinyHistoricalStatsPeriodGroup,
    DestinyActivityHistoryResults,
    DestinyCharacterComponent,
    DestinyProfileResponse
  } from 'bungie-api-ts/destiny2';

  import Year from 'lib/Calendar/Year.svelte';
  import { profile, activities } from '~/stores';
  import api from '~/api';

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

  // replace activities_value by object with key-value
  let activities_value: DestinyHistoricalStatsPeriodGroup[];
  const activities_unsubscribe = activities.subscribe(value => (activities_value = value));
  onDestroy(() => activities_unsubscribe());

  //---
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  let profile_value: UserSearchResponseDetail;
  const profile_unsubscribe = profile.subscribe(value => {
    profile_value = value;
  });
  onDestroy(() => profile_unsubscribe());

  // temp
  export let membershipType: BungieMembershipType;
  export let membershipId: string;

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

<!-- space-y-8 not working -->
<div>
  {#each Object.keys(dates) as year}
    <Year
      key={year}
      year={dates[year]}
      activities={activities_value.filter(
        a => new Date(a.period).getFullYear().toString() === year
      )}
    />
  {/each}
</div>
