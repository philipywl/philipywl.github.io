import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  formatAgeChinese,
  formatAgeEnglish,
  getHongKongCalendarDate,
  getRoundedAgeMonths,
  parseIsoCalendarDate,
} from "../lib/age.mjs";

const calendarDate = (source) => parseIsoCalendarDate(source);
const projectRoot = fileURLToPath(new URL("../", import.meta.url));

function runServerAge(source, environment = {}) {
  return spawnSync(
    process.execPath,
    ["--conditions=react-server", "--input-type=module", "-e", source],
    {
      cwd: projectRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        OLIVER_BIRTH_DATE: "",
        REQUIRE_OLIVER_AGE: "false",
        ...environment,
      },
    },
  );
}

test("parses only valid strict ISO calendar dates", () => {
  assert.deepEqual(calendarDate("2030-04-10"), {
    year: 2030,
    month: 4,
    day: 10,
  });

  for (const invalid of [
    "2030-4-10",
    "2030/04/10",
    "0000-04-10",
    "2030-02-29",
    "2030-13-10",
    "not-a-date",
  ]) {
    assert.throws(() => calendarDate(invalid), TypeError);
  }
});

test("rounds partial calendar months upward without using elapsed days", () => {
  const startingDate = calendarDate("2030-04-10");
  const cases = [
    ["2030-04-09", 0],
    ["2030-04-10", 0],
    ["2030-04-11", 1],
    ["2030-05-09", 1],
    ["2030-05-10", 1],
    ["2030-05-11", 2],
    ["2031-04-09", 12],
    ["2031-04-10", 12],
    ["2031-04-11", 13],
  ];

  for (const [current, expected] of cases) {
    assert.equal(getRoundedAgeMonths(startingDate, calendarDate(current)), expected, current);
  }
});

test("handles clamped month-end anniversaries across a leap year", () => {
  const startingDate = calendarDate("2032-01-31");

  assert.equal(getRoundedAgeMonths(startingDate, calendarDate("2032-02-29")), 1);
  assert.equal(getRoundedAgeMonths(startingDate, calendarDate("2032-03-01")), 2);
  assert.equal(getRoundedAgeMonths(startingDate, calendarDate("2032-03-31")), 2);
});

test("uses the Hong Kong calendar date at the UTC day boundary", () => {
  const beforeHongKongMidnight = new Date("2031-08-20T15:59:59Z");
  const atHongKongMidnight = new Date("2031-08-20T16:00:00Z");

  assert.deepEqual(getHongKongCalendarDate(beforeHongKongMidnight), {
    year: 2031,
    month: 8,
    day: 20,
  });
  assert.deepEqual(getHongKongCalendarDate(atHongKongMidnight), {
    year: 2031,
    month: 8,
    day: 21,
  });

  const startingDate = calendarDate("2030-01-20");
  assert.equal(
    getRoundedAgeMonths(startingDate, getHongKongCalendarDate(beforeHongKongMidnight)),
    19,
  );
  assert.equal(
    getRoundedAgeMonths(startingDate, getHongKongCalendarDate(atHongKongMidnight)),
    20,
  );
});

test("formats English singular and plural age units", () => {
  const cases = [
    [0, "0 months"],
    [1, "1 month"],
    [2, "2 months"],
    [12, "1 year"],
    [13, "1 year 1 month"],
    [19, "1 year 7 months"],
    [24, "2 years"],
    [25, "2 years 1 month"],
  ];

  for (const [months, expected] of cases) {
    assert.equal(formatAgeEnglish(months), expected);
  }
});

test("formats Chinese ages with and without remaining months", () => {
  const cases = [
    [0, "0個月"],
    [1, "1個月"],
    [2, "2個月"],
    [12, "1歲"],
    [13, "1歲1個月"],
    [19, "1歲7個月"],
    [24, "2歲"],
    [25, "2歲1個月"],
  ];

  for (const [months, expected] of cases) {
    assert.equal(formatAgeChinese(months), expected);
  }
});

test("rejects invalid month totals and invalid current instants", () => {
  for (const invalid of [-1, 1.5, Number.NaN]) {
    assert.throws(() => formatAgeEnglish(invalid), TypeError);
    assert.throws(() => formatAgeChinese(invalid), TypeError);
  }

  assert.throws(() => getHongKongCalendarDate(new Date(Number.NaN)), TypeError);
});

test("keeps optional server configuration out of the returned age object", () => {
  const missing = runServerAge(`
    const { getCurrentPortfolioAge } = await import("./lib/current-age.server.ts");
    process.stdout.write(JSON.stringify(getCurrentPortfolioAge()));
  `);
  assert.equal(missing.status, 0, missing.stderr);
  assert.equal(missing.stdout, "null");

  const configured = runServerAge(
    `
      const { getCurrentPortfolioAge } = await import("./lib/current-age.server.ts");
      const result = getCurrentPortfolioAge(new Date("2031-09-04T16:00:00Z"));
      process.stdout.write(JSON.stringify(result));
    `,
    {
      OLIVER_BIRTH_DATE: "2030-02-14",
      REQUIRE_OLIVER_AGE: "true",
    },
  );
  assert.equal(configured.status, 0, configured.stderr);
  assert.deepEqual(JSON.parse(configured.stdout), {
    totalMonths: 19,
    english: "1 year 7 months",
    chinese: "1歲7個月",
  });
});

test("fails generically when required server configuration is missing or invalid", () => {
  const missing = runServerAge(
    `
      const { getCurrentPortfolioAge } = await import("./lib/current-age.server.ts");
      try {
        getCurrentPortfolioAge();
        process.exitCode = 2;
      } catch (error) {
        process.stdout.write(error.message);
      }
    `,
    { REQUIRE_OLIVER_AGE: "true" },
  );
  assert.equal(missing.status, 0, missing.stderr);
  assert.equal(missing.stdout, "Required server-only age configuration is missing.");

  const invalid = runServerAge(
    `
      const { getCurrentPortfolioAge } = await import("./lib/current-age.server.ts");
      try {
        getCurrentPortfolioAge();
        process.exitCode = 2;
      } catch (error) {
        process.stdout.write(error.message);
      }
    `,
    {
      OLIVER_BIRTH_DATE: "not-a-date",
      REQUIRE_OLIVER_AGE: "true",
    },
  );
  assert.equal(invalid.status, 0, invalid.stderr);
  assert.equal(invalid.stdout, "Server-only age configuration is invalid.");
});
