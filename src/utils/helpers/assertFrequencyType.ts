import type { FrequencyType } from "@/types/habit.types";

/**
 * Narrow a string to FrequencyType.
 * Falls back to "custom" if the DB somehow contains an unexpected value.
 */
export const assertFrequencyType = (value: string): FrequencyType => {
	const allowed: FrequencyType[] = ["daily", "weekly", "monthly", "custom"];

	return allowed.includes(value as FrequencyType) ? (value as FrequencyType) : "custom";
};
