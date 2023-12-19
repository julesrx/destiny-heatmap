import type { BungieMembershipType, ServerResponse } from 'bungie-api-ts/common';
import type {
  DestinyProfileResponse,
  DestinyCharacterComponent,
  DestinyActivityHistoryResults
} from 'bungie-api-ts/destiny2';
import type { UserSearchResponse } from 'bungie-api-ts/user';
import { ofetch } from 'ofetch';

const instance = ofetch.create({
  baseURL: 'https://stats.bungie.net/Platform/',
  headers: { 'X-Api-Key': import.meta.env.VITE_BUNGIE_API_KEY.toString() }
});

export const getProfile = async (membershipType: BungieMembershipType, membershipId: string) => {
  const res = await instance<ServerResponse<DestinyProfileResponse>>(
    `Destiny2/${membershipType}/Profile/${membershipId}/`,
    {
      params: {
        components: '100,200'
      }
    }
  );

  return res.Response;
};

// Authenticated requests might receive more activities
export const getActivities = async (
  character: DestinyCharacterComponent,
  page: number = 0,
  signal: AbortSignal
) => {
  const res = await instance<ServerResponse<DestinyActivityHistoryResults>>(
    `Destiny2/${character.membershipType}/Account/${character.membershipId}/Character/${character.characterId}/Stats/Activities/`,
    {
      params: { count: 250, mode: 0, page: page },
      signal
    }
  );

  return res.Response.activities;
};

export const searchProfile = async (gamertag: string) => {
  const res = await instance<ServerResponse<UserSearchResponse>>(
    `User/Search/Prefix/${encodeURIComponent(gamertag.trim())}/0/`
  );

  return res.Response.searchResults;
};
