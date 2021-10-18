import { writable } from 'svelte/store';
import type { DestinyHistoricalStatsPeriodGroup } from 'bungie-api-ts/destiny2';
import type { UserSearchResponseDetail } from 'bungie-api-ts/user/interfaces';

export const profile = writable<UserSearchResponseDetail>();

export const activities = writable<DestinyHistoricalStatsPeriodGroup[]>([]);
// const updateActivities = (acts: DestinyHistoricalStatsPeriodGroup[]) => {
//   for (const act of acts) {
//     const day = format(new Date(act.period), 'yyyy-MM-dd');

//     if (!activities.hasOwnProperty(day))
//       activities[day] = writable<DestinyHistoricalStatsPeriodGroup[]>([act]);
//     else activities[day].update(a => a.concat(act));
//     //   (activities[day] as Writable<DestinyHistoricalStatsPeriodGroup[]>).update(a => a.concat(act));
//   }
// };
