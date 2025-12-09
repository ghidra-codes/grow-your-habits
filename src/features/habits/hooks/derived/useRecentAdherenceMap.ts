import type { HabitWithLogs, RecentAdherenceMap } from "@/types/habit.types";
import { calculateRecentAdherence } from "@/lib/calculateRecentAdherence";
import { useMemo } from "react";

export const useRecentAdherenceMap = (habits: HabitWithLogs[]) =>
	useMemo(() => {
		if (habits.length === 0) return {};

		const adherenceMap: RecentAdherenceMap = {};

		for (const habit of habits) adherenceMap[habit.id] = calculateRecentAdherence(habit);

		return adherenceMap;
	}, [habits]);
