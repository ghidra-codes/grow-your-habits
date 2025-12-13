import { useMemo } from "react";
import { calculateDailyAdherence, calculatePeriodAdherence } from "@/lib/adherence";
import type { HabitWithLogs, HabitAdherence } from "@/types/habit.types";

export const useHabitAdherence = (habit: HabitWithLogs): HabitAdherence =>
	useMemo(() => {
		if (habit.frequency_type === "daily") return calculateDailyAdherence(habit);

		return calculatePeriodAdherence(habit);
	}, [habit]);
