import "server-only";

import {
  formatAgeChinese,
  formatAgeEnglish,
  getHongKongCalendarDate,
  getRoundedAgeMonths,
  parseIsoCalendarDate,
} from "./age.mjs";

export type PortfolioAge = Readonly<{
  totalMonths: number;
  english: string;
  chinese: string;
}>;

export function getCurrentPortfolioAge(now: Date = new Date()): PortfolioAge | null {
  const configuredDate = process.env.OLIVER_BIRTH_DATE?.trim();

  if (!configuredDate) {
    if (process.env.REQUIRE_OLIVER_AGE === "true") {
      throw new Error("Required server-only age configuration is missing.");
    }

    return null;
  }

  let startingDate;
  try {
    startingDate = parseIsoCalendarDate(configuredDate);
  } catch {
    throw new Error("Server-only age configuration is invalid.");
  }

  const totalMonths = getRoundedAgeMonths(
    startingDate,
    getHongKongCalendarDate(now),
  );

  return Object.freeze({
    totalMonths,
    english: formatAgeEnglish(totalMonths),
    chinese: formatAgeChinese(totalMonths),
  });
}
