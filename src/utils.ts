export const getCalendarDays = (from: Date) => {
  const dates: any = {};
  const days: string[] = [];

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

    days.push(day.toISOString().split('T')[0]);

    day.setDate(date + 1);
  }

  return [days, dates];
};

export const formatSeconds = (seconds: number) => {
  const hours = (seconds / 60 / 60) << 0;

  const d = (seconds / (3600 * 24)) << 0;
  const h = ((seconds % (3600 * 24)) / 3600) << 0;
  const m = ((seconds % 3600) / 60) << 0;

  return `${hours}h = ${d}d ${h}h ${m}m`;
};

export const getBackgroundColorFromTimePlayed = (seconds: number) => {
  const h = ((100 - seconds / 864) * 120) / 50 - 120;
  const s = seconds / 86400 > 0 ? '100%' : '0%';
  const l = seconds / 86400 > 0 ? (seconds / 864 > 50 ? 100 - seconds / 864 + '%' : '50%') : '29%';

  return `hsl(${h}, ${s}, ${l})`;
};

export const getStreak = (arr: boolean[]) =>
  Math.max(...arr.reduce((res, n) => (n ? res[res.length - 1]++ : res.push(0), res), [0]));
