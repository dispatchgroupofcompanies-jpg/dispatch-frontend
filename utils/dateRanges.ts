import dayjs from "dayjs";

export interface WeekOption {
  label: string;
  value: string;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
}

/**
 * Generates weekly settlement ranges starting strictly from July 19 up to today.
 */
export const generateRelayWeeklyRanges = (
  anchorDateStr: string = "2026-07-19"
): WeekOption[] => {
  const options: WeekOption[] = [];
  let start = dayjs(anchorDateStr).startOf("day");
  const today = dayjs().endOf("day");

  let weekIndex = 1;

  while (start.isBefore(today)) {
    const end = start.add(6, "day").endOf("day");

    const label = `Week ${weekIndex} (${start.format("MMM DD")} - ${end.format("MMM DD, YYYY")})`;
    const value = `${start.format("YYYY-MM-DD")}_${end.format("YYYY-MM-DD")}`;

    options.push({
      label,
      value,
      startDate: start,
      endDate: end,
    });

    start = start.add(7, "day").startOf("day");
    weekIndex++;
  }

  // Returns array strictly ordered chronologically: [Index 0 = Week 1 (July 19), ..., Last Index = Current Week]
  return options;
};