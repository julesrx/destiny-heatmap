import axios from "axios";
import { DestinyCharacterComponent, DestinyProfileResponse } from "bungie-api-ts/destiny2";

export const http = axios.create({
  baseURL: "https://stats.bungie.net/Platform/",
  headers: { "X-Api-Key": import.meta.env.VITE_VUE_APP_BUNGIE_API_KEY },
});

export const getDestinyCharacterComponents = (
  res: DestinyProfileResponse
): DestinyCharacterComponent[] => {
  if (!res.characters.data) throw new Error("Characters not found on response");

  return Object.keys(res.characters.data)
    .map((key) => (res.characters.data ?? {})[key])
    .sort((a, b) => (a.dateLastPlayed < b.dateLastPlayed ? 1 : -1));
};
