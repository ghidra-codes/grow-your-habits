import type { InsightConfig } from "@/types/insight.types";

export const INSIGHTS_CONFIG: ReadonlyArray<InsightConfig> = [
	{
		id: "strongest-day",
		title: "Your strongest day",
		description: "The weekday on which you complete the most habits overall.",
	},
	{
		id: "strongest-habit",
		title: "Your strongest habit",
		description: "The habit you follow most consistently based on adherence.",
	},
	{
		id: "weakest-habit",
		title: "Your weakest habit",
		description: "The habit with the lowest adherence.",
	},
	{
		id: "weekly-consistency",
		title: "Your weekly consistency",
		description: "How many total habit completions you logged in the past week.",
	},
	{
		id: "weekly-growth",
		title: "Plant growth this week",
		description: "How your plant grew or declined based on last week's habit activity.",
	},
	{
		id: "monthly-growth",
		title: "Plant growth this month",
		description: "How your plant grew or declined over the past month.",
	},
	{
		id: "best-streak-habit",
		title: "Your best streak",
		description: "The habit with your longest recorded streak.",
	},
	{
		id: "monthly-consistency",
		title: "Your monthly consistency",
		description: "How many total habit completions you logged this month.",
	},
	{
		id: "most-improved-habit",
		title: "Your most improved habit",
		description: "The habit that has shown the biggest improvement compared to your longer-term average.",
	},
];
