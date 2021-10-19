import type { CancelTokenSource } from 'axios';
import type { BungieMembershipType, ServerResponse } from 'bungie-api-ts/common';
import type {
  DestinyActivityHistoryResults,
  DestinyCharacterComponent,
  DestinyProfileResponse
} from 'bungie-api-ts/destiny2';

import api from './api';

export const getCalendarDays = (from: Date) => {
  const dates: any = {};

  const day = from;
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

  return dates;
};

export const formatSeconds = (seconds: number) => {
  const hours = (seconds / 60 / 60) << 0;

  const d = (seconds / (3600 * 24)) << 0;
  const h = ((seconds % (3600 * 24)) / 3600) << 0;
  const m = ((seconds % 3600) / 60) << 0;

  return `${hours}h = ${d}d ${h}h ${m}m`;
};

export const getProfile = async (membershipType: BungieMembershipType, membershipId: string) => {
  const res = await api.get<ServerResponse<DestinyProfileResponse>>(
    `Destiny2/${membershipType}/Profile/${membershipId}/`,
    {
      params: {
        components: '100,200'
      }
    }
  );

  return res.data.Response;
};

export const getActivities = async (
  character: DestinyCharacterComponent,
  page: number = 0,
  source: CancelTokenSource
) => {
  const res = await api.get<ServerResponse<DestinyActivityHistoryResults>>(
    `Destiny2/${character.membershipType}/Account/${character.membershipId}/Character/${character.characterId}/Stats/Activities/`,
    {
      params: { count: 250, mode: 0, page: page },
      cancelToken: source.token
    }
  );

  return res.data.Response.activities;
};
