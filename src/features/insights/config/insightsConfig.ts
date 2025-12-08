import type { InsightConfig } from "@/types/insights.types";

export const INSIGHTS_CONFIG: InsightConfig[] = [
	{
		id: "strongest-day",
		title: "Your strongest day",
		description: "The day of the week you complete the most habits.",
		defaultType: "positive",
	},
	{
		id: "strongest-habit",
		title: "Your strongest habit",
		description: "The habit with the highest overall adherence.",
		defaultType: "positive",
	},
	{
		id: "weakest-habit",
		title: "Your weakest habit",
		description: "The habit with the lowest adherence.",
		defaultType: "negative",
	},
	{
		id: "weekly-consistency",
		title: "Your weekly consistency",
		description: "Summary of how many habits you completed this week.",
		defaultType: "neutral",
	},
	{
		id: "weekly-growth",
		title: "Plant growth this week",
		description: "How much your plant grew or declined based on your habits.",
		defaultType: "neutral",
	},
	{
		id: "monthly-growth",
		title: "Plant growth this month",
		description: "How much your plant grew or declined this month.",
		defaultType: "neutral",
	},

	{
		id: "best-streak-habit",
		title: "Your best streak",
		description: "The habit with your longest active or historical streak.",
		defaultType: "positive",
	},
	{
		id: "monthly-consistency",
		title: "Your monthly consistency",
		description: "Summary of how many habits you completed this month.",
		defaultType: "neutral",
	},
	{
		id: "most-improved-habit",
		title: "Your most improved habit",
		description: "The habit that improved the most compared to last week.",
		defaultType: "positive",
	},
];
