import axios, { CancelTokenSource } from 'axios';
import type { BungieMembershipType, ServerResponse } from 'bungie-api-ts/common';
import type {
  DestinyProfileResponse,
  DestinyCharacterComponent,
  DestinyActivityHistoryResults
} from 'bungie-api-ts/destiny2';

const instance = axios.create({
  baseURL: 'https://stats.bungie.net/Platform/',
  headers: { 'X-Api-Key': import.meta.env.VITE_BUNGIE_API_KEY.toString() }
});

export const getProfile = async (membershipType: BungieMembershipType, membershipId: string) => {
  const res = await instance.get<ServerResponse<DestinyProfileResponse>>(
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
  const res = await instance.get<ServerResponse<DestinyActivityHistoryResults>>(
    `Destiny2/${character.membershipType}/Account/${character.membershipId}/Character/${character.characterId}/Stats/Activities/`,
    {
      params: { count: 250, mode: 0, page: page },
      cancelToken: source.token
    }
  );

  return res.data.Response.activities;
};

export default instance;
