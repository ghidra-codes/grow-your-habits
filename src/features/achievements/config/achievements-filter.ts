import type { AchievementFilters } from "@/types/achievements.types";

export const FILTER_OPTIONS: { label: string; value: AchievementFilters }[] = [
	{ label: "All", value: "all" },
	{ label: "Unlocked", value: "unlocked" },
	{ label: "Locked", value: "locked" },

	// Types
	{ label: "Setup", value: "setup" },
	{ label: "Logging", value: "logging" },
	{ label: "Streak", value: "streak" },
	{ label: "Adherence", value: "adherence" },
	{ label: "Growth", value: "growth" },
	{ label: "Meta", value: "meta" },
] as const;
