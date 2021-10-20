<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import axios from 'axios';
  import type { BungieMembershipType } from 'bungie-api-ts/common';
  import type {
    DestinyHistoricalStatsPeriodGroup,
    DestinyCharacterComponent,
    DestinyProfileComponent
  } from 'bungie-api-ts/destiny2';

  import Year from 'lib/Calendar/Year.svelte';
  import { activities } from '../stores';
  import { formatSeconds, getActivities, getCalendarDays, getProfile } from '../utils';

  export let membershipType: BungieMembershipType;
  export let membershipId: string;

  let dates: any = {};
  onMount(() => (dates = getCalendarDays(new Date('2017, Sept 1'))));

  // replace activities_value by object with key-value
  let activities_value: DestinyHistoricalStatsPeriodGroup[];
  const activities_unsubscribe = activities.subscribe(value => (activities_value = value));
  onDestroy(() => activities_unsubscribe());

  //--- Cancel tokens
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  let profile: DestinyProfileComponent;
  let characters: DestinyCharacterComponent[] = [];

  onMount(async () => {
    activities.update(() => []);

    const res = await getProfile(membershipType, membershipId);

    profile = res.profile.data;
    characters = Object.keys(res.characters.data).map(key => (res.characters.data ?? {})[key]);

    characters.forEach(c => {
      fetchActivities(c, 0);
      fetchActivities(c, 1);
    });
  });
  onDestroy(() => {
    activities.update(() => []);
    profile = undefined;
    characters = [];
    source.cancel();
  });

  const fetchActivities = async (character: DestinyCharacterComponent, page: number = 0) => {
    const res = await getActivities(character, page, source);
    if (!res) return;

    activities.update(a => a.concat(res));
    fetchActivities(character, page + 2);
  };

  $: name = profile?.userInfo.bungieGlobalDisplayName ?? '';
  $: totalPlayTime =
    characters.map(c => +c.minutesPlayedTotal || 0).reduce((a, b) => a + b, 0) * 60;
  $: totalActivitiesTime = activities_value
    .map(a => a.values['timePlayedSeconds']?.basic.value ?? 0)
    .reduce((a, b) => a + b, 0);
  $: activityCount = activities_value.length;
</script>

<div class="space-y-4">
  <div>
    <p>Name: {name}</p>
    <p>Total Time in Destiny 2: {formatSeconds(totalPlayTime)}</p>
    <p>Total Time in Activities: {formatSeconds(totalActivitiesTime)}</p>
    <p>Destiny 2 Activity Count: {activityCount}</p>
    <p>Current Streak:</p>
    <p>Longest Streaks:</p>
  </div>

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
</div>
