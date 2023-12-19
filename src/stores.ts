import { writable } from 'svelte/store';
import type { DestinyHistoricalStatsPeriodGroup } from 'bungie-api-ts/destiny2';
import type { UserSearchResponseDetail } from 'bungie-api-ts/user';

export const profile = writable<UserSearchResponseDetail>();
export const activities = writable<DestinyHistoricalStatsPeriodGroup[]>([]);
