import { useMemo } from "react";
import { useHabitsQuery } from "@/features/habits/hooks/queries/useHabitsQuery";
import { usePlantStateQuery } from "@/features/plant/hooks/queries/usePlantStateQuery";
import { useHabitAdherenceMap } from "@/features/habits/hooks/derived/useHabitAdherenceMap";
import { useStatsStreakMap } from "@/features/statistics/hooks/useStatsStreakMap";

/**
 * Builds a consolidated context used for achievement evaluation.
 * Aggregates habit metrics, adherence, streak data, and plant state
 * into a single derived snapshot.
 */
export const useAchievementContext = (userId: string) => {
	const { data: habits = [] } = useHabitsQuery(userId);

	// DERIVED DATA
	const adherenceMap = useHabitAdherenceMap(habits);
	const streakMap = useStatsStreakMap(habits);

	// DB PLANT STATE
	const { data: plantState } = usePlantStateQuery(userId);

	const {
		habitCount,
		totalLogs,
		streak,
		dailyConsistency,
		weeklyGoalHit,
		monthlyGoalHit,
		plantStage,
		maxLogsForOneHabit,
	} = useMemo(() => {
		const habitCount = habits.length;

		const totalLogs = habits.reduce((sum, h) => sum + (h.logs?.length ?? 0), 0);

		const maxLogsForOneHabit = habits.length ? Math.max(...habits.map((h) => h.logs?.length ?? 0)) : 0;

		const streak = Math.max(0, ...Object.values(streakMap).map((s) => s.currentStreak ?? 0));

		let dailyConsistency = false;
		let weeklyGoalHit = false;
		let monthlyGoalHit = false;

		for (const habit of habits) {
			const adherence = adherenceMap[habit.id];
			if (!adherence) continue;

			if (habit.frequency_type === "daily" && adherence.percentage === 100) {
				dailyConsistency = true;
			}

			if (habit.frequency_type === "weekly") {
				if (adherence.logCount >= (habit.target_per_week ?? 0)) {
					weeklyGoalHit = true;
				}
			}

			if (habit.frequency_type === "monthly") {
				if (adherence.logCount >= (habit.target_per_month ?? 0)) {
					monthlyGoalHit = true;
				}
			}
		}

		const plantStage = plantState?.stage ?? 0;

		return {
			habitCount,
			totalLogs,
			streak,
			dailyConsistency,
			weeklyGoalHit,
			monthlyGoalHit,
			plantStage,
			maxLogsForOneHabit,
		};
	}, [habits, adherenceMap, streakMap, plantState]);

	return {
		habits,
		habitCount,
		totalLogs,
		streak,
		dailyConsistency,
		weeklyGoalHit,
		monthlyGoalHit,
		plantStage,
		maxLogsForOneHabit,
	};
};
