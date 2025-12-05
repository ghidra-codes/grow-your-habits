import type { FrequencyType } from "@/types/habit.types";

/**
 * Narrow a string to FrequencyType.
 * Falls back to "daily" if the DB somehow contains an unexpected value.
 */

const allowed = ["daily", "weekly", "monthly"] as const;

const isFrequencyType = (value: string): value is FrequencyType =>
	(allowed as readonly string[]).includes(value);

export const assertFrequencyType = (value: string): FrequencyType =>
	isFrequencyType(value) ? value : "daily";
