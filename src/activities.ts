import { reactive, computed, readonly } from "vue";
import axios from "axios";
import { ServerResponse } from "bungie-api-ts/app";
import { BungieMembershipType } from "bungie-api-ts/common";
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
    profile: null as DestinyProfileResponse | null,
    activities: [] as CustomHistoricalStatsPeriodGroup[],
    dates: {} as any, // TODO: type this,
    flatDates: [] as Date[],
  });

  const startSearch = (membershipType: BungieMembershipType, membershipId: string) => {
    state.profile = null;
    state.activities = [];
    initDates();

    fetchProfile(membershipType, membershipId);
  };

  const initDates = () => {
    state.dates = {};
    state.flatDates = [];

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

  const fetchProfile = async (membershipType: BungieMembershipType, membershipId: string) => {
    const res = await http.get<ServerResponse<DestinyProfileResponse>>(
      `Destiny2/${membershipType}/Profile/${membershipId}/`,
      {
        params: {
          components: [DestinyComponentType.Profiles, DestinyComponentType.Characters].join(","),
        },
      }
    );

    const profile = res.data.Response;
    const characters = getDestinyCharacterComponents(profile);

    state.profile = profile;

    characters.forEach((c) => {
      fecthActivities(c, 0);
      fecthActivities(c, 1);
      fecthActivities(c, 2);
    });
  };

  const fecthActivities = async (character: DestinyCharacterComponent, page: number) => {
    const count = 250;

    try {
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
    } catch (ex) {
      if (axios.isCancel(ex)) {
        console.log("search canceled");
      }
    }
  };

  // TODO: use for display ?
  const maxTime = computed(() => {
    const res: number[] = state.flatDates.map((d) => {
      const r = state.dates[d.getFullYear()]?.[d.getMonth() + 1]?.[d.getDate()];

      return !r
        ? 0
        : r.reduce(
            (a: number, b: CustomHistoricalStatsPeriodGroup) =>
              a + b.values["timePlayedSeconds"].basic.value,
            0
          );
    });

    return res.sort((a, b) => (a > b ? -1 : 1))[0];
  });

  return {
    state: readonly(state),
    maxTime,
    startSearch,
    cancel: source.cancel,
  };
};

export default createStore();
