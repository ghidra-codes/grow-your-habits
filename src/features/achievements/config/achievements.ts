import { ACHIEVEMENT_BADGES } from "@/assets/svgs";

export const ACHIEVEMENTS = [
	// Setup achievement
	{
		id: "first_habit",
		title: "Getting Started",
		description: "Create your first habit",
		badge: ACHIEVEMENT_BADGES.first_habit,
		type: "setup",
	},

	// Habit creation
	{
		id: "created_3_habits",
		title: "Habit Collector",
		description: "Create 3 habits",
		badge: ACHIEVEMENT_BADGES.created_3_habits,
		type: "setup",
	},

	// Logging
	{
		id: "log_created",
		title: "First Steps",
		description: "Log a habit for the first time",
		badge: ACHIEVEMENT_BADGES.log_created,
		type: "logging",
	},
	{
		id: "log_created_10",
		title: "Momentum Builder",
		description: "Log a habit 10 times",
		badge: ACHIEVEMENT_BADGES.log_created_10,
		type: "logging",
	},
	{
		id: "log_created_50",
		title: "Habit Veteran",
		description: "Log a habit 50 times",
		badge: ACHIEVEMENT_BADGES.log_created_50,
		type: "logging",
	},

	// Streaks
	{
		id: "habit_streak_3",
		title: "On a Roll",
		description: "Complete a habit 3 times in a row",
		badge: ACHIEVEMENT_BADGES.habit_streak_3,
		type: "streak",
	},
	{
		id: "habit_streak_7",
		title: "Streak Champion",
		description: "Complete a habit 7 times in a row",
		badge: ACHIEVEMENT_BADGES.habit_streak_7,
		type: "streak",
	},
	{
		id: "habit_streak_12",
		title: "Master of Routine",
		description: "Complete a habit 12 times in a row",
		badge: ACHIEVEMENT_BADGES.habit_streak_12,
		type: "streak",
	},

	// Adherence / Goals
	{
		id: "habit_daily_consistency",
		title: "Daily Devotee",
		description: "Achieve 100% adherence for a daily habit",
		badge: ACHIEVEMENT_BADGES.habit_daily_consistency,
		type: "adherence",
	},
	{
		id: "habit_weekly_goal",
		title: "Weekly Warrior",
		description: "Hit the weekly goal for a weekly habit",
		badge: ACHIEVEMENT_BADGES.habit_weekly_goal,
		type: "adherence",
	},
	{
		id: "habit_monthly_goal",
		title: "Monthly Conqueror",
		description: "Hit the monthly goal for a monthly habit",
		badge: ACHIEVEMENT_BADGES.habit_monthly_goal,
		type: "adherence",
	},

	// Plant growth
	{
		id: "plant_stage_2",
		title: "It's Alive!",
		description: "Your plant has grown to stage 2",
		badge: ACHIEVEMENT_BADGES.plant_stage_2,
		type: "growth",
	},
	{
		id: "plant_stage_3",
		title: "Growth Spurt",
		description: "Your plant has grown to stage 3",
		badge: ACHIEVEMENT_BADGES.plant_stage_3,
		type: "growth",
	},
	{
		id: "plant_stage_5",
		title: "Master Gardener",
		description: "Your plant has grown to stage 5",
		badge: ACHIEVEMENT_BADGES.plant_stage_5,
		type: "growth",
	},

	// Meta achievement
	{
		id: "achievement_collector",
		title: "Legend of Growth",
		description: "Collect all achievements",
		badge: ACHIEVEMENT_BADGES.achievement_collector,
		type: "meta",
	},
] as const;
