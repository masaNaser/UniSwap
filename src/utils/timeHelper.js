// src/utils/timeHelper.js
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const formatTime = (timestamp) => {
  if (!timestamp) return "—";

  let fixed = timestamp;

  // ✅ If no timezone AND no Z, treat as UTC (add Z)
  if (!/[+-]\d\d:\d\d$/.test(timestamp) && !timestamp.endsWith("Z")) {
    fixed = timestamp + "Z";
  }

  return dayjs(fixed).local().format("DD MMM, hh:mm A");
};