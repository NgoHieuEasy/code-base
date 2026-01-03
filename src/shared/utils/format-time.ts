import type { Dayjs } from "dayjs";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import i18next from "i18next";

// ----------------------------------------------------------------------
export type IDateValue = string | number | null;
dayjs.extend(duration);
dayjs.extend(relativeTime);

// ----------------------------------------------------------------------

export type DatePickerFormat =
  | Dayjs
  | Date
  | string
  | number
  | null
  | undefined;

/**
 * Docs: https://day.js.org/docs/en/display/format
 */
export const formatStr = {
  dateTime: "DD MMM YYYY h:mm a", // 17 Apr 2022 12:00 am
  date: "DD MMM YYYY", // 17 Apr 2022
  time: "h:mm a", // 12:00 am
  split: {
    dateTime: "DD/MM/YYYY h:mm a", // 17/04/2022 12:00 am
    date: "DD/MM/YYYY", // 17/04/2022
  },
  paramCase: {
    dateTime: "DD-MM-YYYY h:mm a", // 17-04-2022 12:00 am
    date: "DD-MM-YYYY", // 17-04-2022
  },
};

export function today(format?: string) {
  return dayjs(new Date()).startOf("day").format(format);
}

// ----------------------------------------------------------------------
/* get year */

export function fYearStr(date?: IDateValue) {
  if (!date) {
    return null;
  }
  return dayjs().diff(date, "year");
}

// ----------------------------------------------------------------------
/* get year */

export function fMonthStr(date?: IDateValue) {
  if (!date) {
    return null;
  }
  return dayjs().diff(date, "month");
}

// ----------------------------------------------------------------------
/* convert hours to days */

export function fHoursToDay(hours: number) {
  return dayjs.duration(hours, "hours").asDays();
}

// ----------------------------------------------------------------------

/** output: 17 Apr 2022 12:00 am
 */
export function fDateTime(date: DatePickerFormat, format?: string) {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid
    ? dayjs(date)
        .locale(i18next.language)
        .format(format ?? formatStr.dateTime)
    : "Invalid time value";
}

// ----------------------------------------------------------------------

/** output: 17 Apr 2022
 */
export function fDate(date: DatePickerFormat, format?: string) {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid
    ? dayjs(date).format(format ?? formatStr.date)
    : "Invalid time value";
}

// ----------------------------------------------------------------------

/** output: 12:00 am
 */
export function fTime(date: DatePickerFormat, format?: string) {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid
    ? dayjs(date).format(format ?? formatStr.time)
    : "Invalid time value";
}

// ----------------------------------------------------------------------

/** output: 1713250100
 */
export function fTimestamp(date: DatePickerFormat) {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid ? dayjs(date).valueOf() : "Invalid time value";
}

// ----------------------------------------------------------------------



export const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();

  const sec = Math.floor(diffMs / 1000);
  const min = Math.floor(sec / 60);
  const hrs = Math.floor(min / 60);
  const days = Math.floor(hrs / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (sec < 60) return `about ${sec} seconds ago`;
  if (min < 60) return `about ${min} minutes ago`;
  if (hrs < 24) return `about ${hrs} hours ago`;
  if (days < 30) return `about ${days} days ago`;
  if (months < 12) return `about ${months} months ago`;
  return `about ${years} years ago`;
};
