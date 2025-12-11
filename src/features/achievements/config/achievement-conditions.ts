import type { AchievementContext } from "@/types/achievement.types";

export const ACHIEVEMENT_CONDITIONS: Record<string, (ctx: AchievementContext) => boolean> = {
	// Setup
	first_habit: (ctx) => ctx.habitCount >= 1,
	created_3_habits: (ctx) => ctx.habitCount >= 3,

	// Logging (per-habit)
	log_created: (ctx) => ctx.totalLogs >= 1,
	log_created_10: (ctx) => ctx.maxLogsForOneHabit >= 10,
	log_created_50: (ctx) => ctx.maxLogsForOneHabit >= 50,

	// Streaks (max streak across habits)
	habit_streak_3: (ctx) => ctx.streak >= 3,
	habit_streak_7: (ctx) => ctx.streak >= 7,
	habit_streak_12: (ctx) => ctx.streak >= 12,

	// Adherence / Goals
	habit_daily_consistency: (ctx) => ctx.dailyConsistency === true,
	habit_weekly_goal: (ctx) => ctx.weeklyGoalHit === true,
	habit_monthly_goal: (ctx) => ctx.monthlyGoalHit === true,

	// Plant growth
	plant_stage_2: (ctx) => ctx.plantStage >= 2,
	plant_stage_3: (ctx) => ctx.plantStage >= 3,
	plant_stage_5: (ctx) => ctx.plantStage >= 5,

	// Meta
	achievement_collector: () => false,
};
