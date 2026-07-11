const ISO_CALENDAR_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export const HONG_KONG_TIME_ZONE = "Asia/Hong_Kong";

/**
 * @typedef {Readonly<{ year: number; month: number; day: number }>} CalendarDate
 */

function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function daysInMonth(year, month) {
  const monthLengths = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  return monthLengths[month - 1] ?? 0;
}

/**
 * @param {unknown} value
 * @returns {asserts value is CalendarDate}
 */
function assertCalendarDate(value) {
  const date = /** @type {Partial<CalendarDate> | null} */ (value);
  if (
    !date ||
    !Number.isInteger(date.year) ||
    !Number.isInteger(date.month) ||
    !Number.isInteger(date.day) ||
    date.year < 1 ||
    date.month < 1 ||
    date.month > 12 ||
    date.day < 1 ||
    date.day > daysInMonth(date.year, date.month)
  ) {
    throw new TypeError("Invalid calendar date.");
  }
}

/**
 * Parse a strict Gregorian YYYY-MM-DD calendar date without applying a timezone.
 *
 * @param {string} source
 * @returns {CalendarDate}
 */
export function parseIsoCalendarDate(source) {
  const match = ISO_CALENDAR_DATE.exec(source);
  if (!match) throw new TypeError("Invalid ISO calendar date.");

  const parsed = Object.freeze({
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  });
  assertCalendarDate(parsed);
  return parsed;
}

/**
 * @param {CalendarDate} left
 * @param {CalendarDate} right
 */
function compareCalendarDates(left, right) {
  return (
    left.year - right.year ||
    left.month - right.month ||
    left.day - right.day
  );
}

/**
 * Add whole calendar months, clamping the day to the last valid day of the
 * destination month.
 *
 * @param {CalendarDate} date
 * @param {number} monthCount
 * @returns {CalendarDate}
 */
function addCalendarMonths(date, monthCount) {
  assertCalendarDate(date);
  if (!Number.isInteger(monthCount) || monthCount < 0) {
    throw new TypeError("Month count must be a non-negative integer.");
  }

  const absoluteMonth = date.year * 12 + (date.month - 1) + monthCount;
  const year = Math.floor(absoluteMonth / 12);
  const month = absoluteMonth % 12 + 1;

  return Object.freeze({
    year,
    month,
    day: Math.min(date.day, daysInMonth(year, month)),
  });
}

/**
 * Return the current Gregorian calendar date in Hong Kong, independent of the
 * viewer's or build runner's local timezone.
 *
 * @param {Date} [now]
 * @returns {CalendarDate}
 */
export function getHongKongCalendarDate(now = new Date()) {
  if (!(now instanceof Date) || Number.isNaN(now.getTime())) {
    throw new TypeError("Invalid current instant.");
  }

  const parts = new Intl.DateTimeFormat("en-CA-u-ca-gregory-nu-latn", {
    timeZone: HONG_KONG_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type === "year" || part.type === "month" || part.type === "day")
      .map((part) => [part.type, Number(part.value)]),
  );
  const date = Object.freeze({
    year: values.year,
    month: values.month,
    day: values.day,
  });
  assertCalendarDate(date);
  return date;
}

/**
 * Count calendar months and round any partial month upward. Dates before the
 * starting date are clamped to zero.
 *
 * @param {CalendarDate} startingDate
 * @param {CalendarDate} currentDate
 */
export function getRoundedAgeMonths(startingDate, currentDate) {
  assertCalendarDate(startingDate);
  assertCalendarDate(currentDate);

  if (compareCalendarDates(currentDate, startingDate) <= 0) return 0;

  const nominalMonths =
    (currentDate.year - startingDate.year) * 12 +
    currentDate.month -
    startingDate.month;
  let completedMonths = nominalMonths;
  let anniversary = addCalendarMonths(startingDate, completedMonths);

  if (compareCalendarDates(currentDate, anniversary) < 0) {
    completedMonths -= 1;
    anniversary = addCalendarMonths(startingDate, completedMonths);
  }

  return completedMonths + (compareCalendarDates(currentDate, anniversary) > 0 ? 1 : 0);
}

function assertMonthTotal(totalMonths) {
  if (!Number.isInteger(totalMonths) || totalMonths < 0) {
    throw new TypeError("Age month total must be a non-negative integer.");
  }
}

function pluralize(value, singular, plural) {
  return `${value} ${value === 1 ? singular : plural}`;
}

/**
 * @param {number} totalMonths
 */
export function formatAgeEnglish(totalMonths) {
  assertMonthTotal(totalMonths);
  if (totalMonths < 12) return pluralize(totalMonths, "month", "months");

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const yearText = pluralize(years, "year", "years");
  return months === 0
    ? yearText
    : `${yearText} ${pluralize(months, "month", "months")}`;
}

/**
 * @param {number} totalMonths
 */
export function formatAgeChinese(totalMonths) {
  assertMonthTotal(totalMonths);
  if (totalMonths < 12) return `${totalMonths}個月`;

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return months === 0 ? `${years}歲` : `${years}歲${months}個月`;
}
