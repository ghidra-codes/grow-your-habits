import type { InsightGenerated, InsightID } from "@/types/insight.types";
import type { InsightContext } from "@/types/insight.types";
import { fullWeekdays } from "@/ui/constants/weekdays";

export const insightGenerators: Record<InsightID, (ctx: InsightContext) => InsightGenerated | null> = {
	"strongest-day": (ctx) => {
		if (ctx.strongestDayIndex == null) return null;

		return {
			id: "strongest-day",
			type: "positive",
			message: `You're most consistent on ${fullWeekdays[ctx.strongestDayIndex].toLowerCase()}s.`,
		};
	},

	"strongest-habit": (ctx) => {
		if (!ctx.strongestHabit) return null;

		return {
			id: "strongest-habit",
			type: "positive",
			message: `Your strongest habit is "${ctx.strongestHabit.name}".`,
		};
	},

	"weakest-habit": (ctx) => {
		if (!ctx.weakestHabit) return null;

		return {
			id: "weakest-habit",
			type: "negative",
			message: `Your weakest habit is "${ctx.weakestHabit.name}".`,
		};
	},

	"weekly-consistency": (ctx) => {
		return {
			id: "weekly-consistency",
			type: "neutral",
			message: `You completed ${ctx.weeklyTotal} habits this week.`,
		};
	},

	"weekly-growth": (ctx) => {
		const growth = ctx.weeklyGrowthChange;

		if (growth === 0) return null;

		if (growth > 0) {
			return {
				id: "weekly-growth",
				type: "positive",
				message: `Your plant gained ${growth} growth this week.`,
			};
		}

		return {
			id: "weekly-growth",
			type: "negative",
			message: `Your plant lost ${Math.abs(growth)} growth this week.`,
		};
	},

	"monthly-growth": (ctx) => {
		const growth = ctx.monthlyGrowthChange;

		if (growth === 0) return null;

		if (growth > 0) {
			return {
				id: "monthly-growth",
				type: "positive",
				message: `Your plant gained ${growth} growth this month.`,
			};
		}

		return {
			id: "monthly-growth",
			type: "negative",
			message: `Your plant lost ${Math.abs(growth)} growth this month.`,
		};
	},

	"best-streak-habit": (ctx) => {
		if (!ctx.bestStreakHabit) return null;

		return {
			id: "best-streak-habit",
			type: "positive",
			message: `Your best streak is with "${ctx.bestStreakHabit.name}" (${ctx.bestStreakHabit.longestStreak} in a row).`,
		};
	},

	"monthly-consistency": (ctx) => {
		return {
			id: "monthly-consistency",
			type: "neutral",
			message: `You completed ${ctx.monthlyTotal} habits this month.`,
		};
	},

	"most-improved-habit": (ctx) => {
		const habit = ctx.mostImprovedHabit;

		if (!habit || habit.improvement <= 0) return null;

		return {
			id: "most-improved-habit",
			type: "positive",
			message: `"${habit.name}" improved the most this week (+${habit.improvement.toFixed(1)}).`,
		};
	},
};
