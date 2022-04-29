import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function timeToDisplayStr(time: Dayjs): string {
  if (time.isAfter(dayjs().subtract(1, "day"))) {
    return time.fromNow();
  }
  return time.format("MMM D, YY");
}
