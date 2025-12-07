import type { Insight, InsightID } from "@/types/insights.types";
import type { InsightContext } from "@/types/insights.types";

const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const insightGenerators: Record<InsightID, (ctx: InsightContext) => Insight | null> = {
	// -------------------------------------------------------------
	// 1. Strongest day
	// -------------------------------------------------------------
	"strongest-day": (ctx) => {
		if (ctx.strongestDayIndex == null) return null;

		return {
			id: "strongest-day",
			type: "positive",
			message: `You’re most consistent on ${weekdayNames[ctx.strongestDayIndex]}.`,
		};
	},

	// -------------------------------------------------------------
	// 2. Strongest habit
	// -------------------------------------------------------------
	"strongest-habit": (ctx) => {
		if (!ctx.strongestHabit) return null;

		return {
			id: "strongest-habit",
			type: "positive",
			message: `Your strongest habit is ${ctx.strongestHabit.name}.`,
		};
	},

	// -------------------------------------------------------------
	// 3. Weakest habit
	// -------------------------------------------------------------
	"weakest-habit": (ctx) => {
		if (!ctx.weakestHabit) return null;

		return {
			id: "weakest-habit",
			type: "neutral",
			message: `${ctx.weakestHabit.name} is your most fragile habit right now.`,
		};
	},

	// -------------------------------------------------------------
	// 4. Weekly consistency
	// -------------------------------------------------------------
	"weekly-consistency": (ctx) => {
		return {
			id: "weekly-consistency",
			type: "neutral",
			message: `You completed ${ctx.weeklyTotal} habits this week.`,
		};
	},

	// -------------------------------------------------------------
	// 5. Weekly plant growth summary
	// -------------------------------------------------------------
	"weekly-growth": (ctx) => {
		const growth = ctx.weeklyGrowthChange;

		if (growth >= 0) {
			return {
				id: "weekly-growth",
				type: "positive",
				message: `Your plant gained +${growth} growth this week.`,
			};
		}

		return {
			id: "weekly-growth",
			type: "negative",
			message: `Your plant lost ${Math.abs(growth)} growth this week.`,
		};
	},

	// -------------------------------------------------------------
	// 6. Best streak habit
	// -------------------------------------------------------------
	"best-streak-habit": (ctx) => {
		if (!ctx.bestStreakHabit) return null;

		return {
			id: "best-streak-habit",
			type: "positive",
			message: `Your best streak is with ${ctx.bestStreakHabit.name} (${ctx.bestStreakHabit.longestStreak} days).`,
		};
	},

	// -------------------------------------------------------------
	// 7. Monthly consistency summary
	// -------------------------------------------------------------
	"monthly-consistency": (ctx) => {
		return {
			id: "monthly-consistency",
			type: "neutral",
			message: `You completed ${ctx.monthlyTotal} habits this month.`,
		};
	},

	// -------------------------------------------------------------
	// 8. Most improved habit
	// -------------------------------------------------------------
	"most-improved-habit": (ctx) => {
		const h = ctx.mostImprovedHabit;

		if (!h) return null;

		// Only show if improvement is meaningful
		if (h.improvement <= 0) return null;

		return {
			id: "most-improved-habit",
			type: "positive",
			message: `${h.name} improved the most (+${h.improvement.toFixed(0)}%).`,
		};
	},
};
