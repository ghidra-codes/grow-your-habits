import type { AchievementFilters } from "@/types/achievement.types";

export const FILTER_OPTIONS: { label: string; value: AchievementFilters }[] = [
	{ label: "All", value: "all" },
	{ label: "Unlocked", value: "unlocked" },
	{ label: "Locked", value: "locked" },
	{ label: "Streak", value: "streak" },
	{ label: "Growth", value: "growth" },
	{ label: "Logging", value: "logging" },
	{ label: "Adherence", value: "adherence" },
	{ label: "Other", value: "other" },
] as const;
