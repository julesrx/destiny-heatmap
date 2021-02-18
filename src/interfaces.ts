import { DestinyHistoricalStatsPeriodGroup } from "bungie-api-ts/destiny2";

export interface CustomHistoricalStatsPeriodGroup extends DestinyHistoricalStatsPeriodGroup {
  startDate: Date;
  endDate: Date;
}
