import { reactive, readonly } from "vue";
import axios from "axios";
import { ServerResponse } from "bungie-api-ts/app";
import { UserInfoCard } from "bungie-api-ts/user";
import {
  DestinyProfileResponse,
  DestinyCharacterComponent,
  DestinyComponentType,
  DestinyActivityHistoryResults,
  DestinyActivityModeType,
} from "bungie-api-ts/destiny2";

import { CustomHistoricalStatsPeriodGroup } from "./interfaces";
import { http, getDestinyCharacterComponents } from "./api";

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const createStore = () => {
  const state = reactive({
    activities: [] as CustomHistoricalStatsPeriodGroup[],
    dates: {} as any, // TODO: type this,
    flatDates: [] as Date[],
  });

  const startSearch = (gamertag: string) => {
    //   source.cancel("Search canceled");

    state.activities = [];
    initDates();

    fetchProfile(gamertag);
  };

  const initDates = () => {
    state.dates = {};

    const day = new Date("2017, Sept 1");
    const now = new Date();

    while (day <= now) {
      if (!state.dates[day.getFullYear()]) {
        state.dates[day.getFullYear()] = {};
      }

      if (!state.dates[day.getFullYear()][day.getMonth() + 1]) {
        state.dates[day.getFullYear()][day.getMonth() + 1] = {};
      }

      if (!state.dates[day.getFullYear()][day.getMonth() + 1][day.getDate()]) {
        state.dates[day.getFullYear()][day.getMonth() + 1][day.getDate()] = [];
      }

      state.flatDates.push(new Date(day));
      day.setDate(day.getDate() + 1);
    }
  };

  const fetchProfile = async (gamertag: string) => {
    const usersres = await http.get<ServerResponse<UserInfoCard[]>>(
      `Destiny2/SearchDestinyPlayer/-1/${encodeURIComponent(gamertag.trim())}/`,
      { cancelToken: source.token }
    );

    // select profile instead
    const user = usersres.data.Response[0];

    const membershipType = user.membershipType;
    const membershipId = user.membershipId;

    const profileres = await http.get<ServerResponse<DestinyProfileResponse>>(
      `Destiny2/${membershipType}/Profile/${membershipId}/`,
      {
        params: {
          components: [DestinyComponentType.Profiles, DestinyComponentType.Characters].join(","),
        },
      }
    );

    const profile = profileres.data.Response;
    const characters = getDestinyCharacterComponents(profile);

    characters.forEach((c) => {
      fecthActivities(c, 0);
      fecthActivities(c, 1);
      fecthActivities(c, 2);
    });
  };

  const fecthActivities = async (character: DestinyCharacterComponent, page: number) => {
    const count = 250;

    const res = await http.get<ServerResponse<DestinyActivityHistoryResults>>(
      `Destiny2/${character.membershipType}/Account/${character.membershipId}/Character/${character.characterId}/Stats/Activities/`,
      {
        params: { count: count, page: page, mode: DestinyActivityModeType.None },
        cancelToken: source.token,
      }
    );

    const activities = res.data.Response.activities;
    if (activities && activities.length) {
      activities.forEach((a) => {
        const startDate = new Date(a.period);
        startDate.setSeconds(startDate.getSeconds() + a.values.startSeconds.basic.value);

        const endDate = new Date(startDate.getTime());
        endDate.setSeconds(startDate.getSeconds() + a.values.timePlayedSeconds.basic.value);

        const act = { ...a, startDate, endDate };
        state.activities.push(act);

        const date = new Date(act.period);
        try {
          state.dates[date.getFullYear()][date.getMonth() + 1][date.getDate()].push(act);
        } catch (ex) {
          console.log(date);
        }
      });

      fecthActivities(character, page + 3);
    }
  };

  return {
    state: readonly(state),
    startSearch,
  };
};

export default createStore();
