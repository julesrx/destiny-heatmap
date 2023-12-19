<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { BungieMembershipType } from 'bungie-api-ts/common';
  import type {
    DestinyHistoricalStatsPeriodGroup,
    DestinyCharacterComponent,
    DestinyProfileComponent
  } from 'bungie-api-ts/destiny2';

  import Year from '../lib/Calendar/Year.svelte';
  import { activities } from '../stores';
  import { getActivities, getProfile } from '../api';
  import { formatSeconds, getCalendarDays, getStreak, throttle } from '../utils';
  import { APP_TITLE } from '../constants';

  export let membershipType: BungieMembershipType;
  export let membershipId: string;

  let dates: any = {};
  let days: string[] = [];
  onMount(() => {
    [days, dates] = getCalendarDays(new Date('2017, Sept 1'));
  });

  // replace activities_value by object with key-value
  let activities_value: DestinyHistoricalStatsPeriodGroup[];
  const activities_unsubscribe = activities.subscribe(value => (activities_value = value));
  onDestroy(() => activities_unsubscribe());

  let longestActiveStreak = 0;
  let longestInactiveStreak = 0;

  const getActivityCountByDay = (acts: DestinyHistoricalStatsPeriodGroup[], day: string) =>
    acts.filter(a => a.period.indexOf(day) > -1).length;

  const setStreaks = throttle((acts: DestinyHistoricalStatsPeriodGroup[]) => {
    if (!acts.length) return;

    // FIXME: not working
    // https://stackoverflow.com/a/46874335/8164741
    longestActiveStreak = getStreak(days.map(d => getActivityCountByDay(acts, d) > 0));
    longestInactiveStreak = getStreak(days.map(d => getActivityCountByDay(acts, d) === 0));
  }, 2500);

  $: setStreaks(activities_value);

  //--- Cancel tokens
  const controller = new AbortController();

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
      fetchActivities(c, 2);
    });
  });
  onDestroy(() => {
    activities.update(() => []);
    profile = undefined;
    characters = [];
    controller.abort();
  });

  const fetchActivities = async (character: DestinyCharacterComponent, page: number = 0) => {
    const res = await getActivities(character, page, controller.signal);
    if (!res) return;

    activities.update(a => a.concat(res));
    fetchActivities(character, page + 3);
  };

  $: name = profile?.userInfo.bungieGlobalDisplayName ?? '';
  $: totalPlayTime =
    characters.map(c => +c.minutesPlayedTotal || 0).reduce((a, b) => a + b, 0) * 60;
  $: totalActivitiesTime = activities_value
    .map(a => a.values['timePlayedSeconds']?.basic.value ?? 0)
    .reduce((a, b) => a + b, 0);
  $: activityCount = activities_value.length;

  $: title = name ? `${name} - ${APP_TITLE}` : APP_TITLE;
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="space-y-4">
  <div>
    <p>Name: {name}</p>
    <p>Total Time in Destiny 2: {formatSeconds(totalPlayTime)}</p>
    <p>Total Time in Activities: {formatSeconds(totalActivitiesTime)}</p>
    <p>Destiny 2 Activity Count: {activityCount}</p>
    <p>Current Streak:</p>
    <p>
      Longest Streaks: {longestActiveStreak} days active | {longestInactiveStreak} days inactive
    </p>
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
