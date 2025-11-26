import type { FrequencyType } from "@/types/habit.types";

/**
 * Narrow a string to FrequencyType.
 * Falls back to "custom" if the DB somehow contains an unexpected value.
 */

const allowed = ["daily", "weekly", "monthly", "custom"] as const;

const isFrequencyType = (value: string): value is FrequencyType =>
	(allowed as readonly string[]).includes(value);

export const assertFrequencyType = (value: string): FrequencyType =>
	isFrequencyType(value) ? value : "custom";
