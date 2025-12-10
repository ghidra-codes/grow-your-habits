import type { InsightConfig } from "@/types/insights.types";

export const INSIGHTS_CONFIG: ReadonlyArray<InsightConfig> = [
	{
		id: "strongest-day",
		title: "Your strongest day",
		description: "The day of the week you complete the most habits.",
	},
	{
		id: "strongest-habit",
		title: "Your strongest habit",
		description: "The habit with the highest overall adherence.",
	},
	{
		id: "weakest-habit",
		title: "Your weakest habit",
		description: "The habit with the lowest adherence.",
	},
	{
		id: "weekly-consistency",
		title: "Your weekly consistency",
		description: "Summary of how many habits you completed this week.",
	},
	{
		id: "weekly-growth",
		title: "Plant growth this week",
		description: "How much your plant grew or declined based on your habits.",
	},
	{
		id: "monthly-growth",
		title: "Plant growth this month",
		description: "How much your plant grew or declined this month.",
	},
	{
		id: "best-streak-habit",
		title: "Your best streak",
		description: "The habit with your longest active or historical streak.",
	},
	{
		id: "monthly-consistency",
		title: "Your monthly consistency",
		description: "Summary of how many habits you completed this month.",
	},
	{
		id: "most-improved-habit",
		title: "Your most improved habit",
		description: "The habit that improved the most compared to last week.",
	},
];
