export type InsightID =
	| "strongest-day"
	| "strongest-habit"
	| "weakest-habit"
	| "weekly-consistency"
	| "weekly-growth"
	| "best-streak-habit"
	| "monthly-consistency"
	| "most-improved-habit";

export type InsightConfig = {
	id: InsightID;
	title: string;
	description?: string;
	dependsOn: ("completionsByDay" | "habits" | "weeklyTotals" | "monthlyTotals" | "growth" | "streaks")[];
	defaultType?: "positive" | "neutral" | "negative";
};

export const INSIGHTS_CONFIG: InsightConfig[] = [
	{
		id: "strongest-day",
		title: "Your strongest day",
		description: "The day of the week you complete the most habits.",
		dependsOn: ["completionsByDay"],
		defaultType: "positive",
	},
	{
		id: "strongest-habit",
		title: "Your strongest habit",
		description: "The habit with the highest overall adherence.",
		dependsOn: ["habits"],
		defaultType: "positive",
	},
	{
		id: "weakest-habit",
		title: "Your weakest habit",
		description: "The habit with the lowest adherence.",
		dependsOn: ["habits"],
		defaultType: "neutral",
	},
	{
		id: "weekly-consistency",
		title: "Your weekly consistency",
		description: "Summary of how many habits you completed this week.",
		dependsOn: ["weeklyTotals"],
		defaultType: "neutral",
	},
	{
		id: "weekly-growth",
		title: "Plant growth this week",
		description: "How much your plant grew or declined based on your habits.",
		dependsOn: ["growth"],
		defaultType: "neutral",
	},
	{
		id: "best-streak-habit",
		title: "Your best streak",
		description: "The habit with your longest active or historical streak.",
		dependsOn: ["streaks", "habits"],
		defaultType: "positive",
	},
	{
		id: "monthly-consistency",
		title: "Your monthly consistency",
		description: "Summary of how many habits you completed this month.",
		dependsOn: ["monthlyTotals"],
		defaultType: "neutral",
	},
	{
		id: "most-improved-habit",
		title: "Your most improved habit",
		description: "The habit that improved the most compared to last week.",
		dependsOn: ["habits"],
		defaultType: "positive",
	},
];
