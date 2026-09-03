import dayjs from "dayjs";

export interface WeekOption {
  label: string;
  value: string;
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
}

export const generateRelayWeeklyRanges = (
  anchorDateStr: string = "2026-07-19"
): WeekOption[] => {
  // Option to view all records across all time
  const options: WeekOption[] = [
    {
      label: "All 3P Records",
      value: "all",
    },
  ];

  let start = dayjs(anchorDateStr).startOf("day");
  const today = dayjs().endOf("day");
  while (start.isBefore(today)) {
    const end = start.add(6, "day").endOf("day");

    options.push({
      // Keep the picker focused on the date range; the week number and year
      // are not needed when selecting 3P records for a week.
      label: `${start.format("MMM DD")} - ${end.format("MMM DD")}`,
      value: `${start.format("YYYY-MM-DD")}_${end.format("YYYY-MM-DD")}`,
      startDate: start,
      endDate: end,
    });

    start = start.add(7, "day").startOf("day");
  }

  return options;
};
