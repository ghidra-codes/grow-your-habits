import { useMemo } from "react";
import { calculateHabitAdherence } from "@/lib/calculateHabitAdherence";
import type { HabitWithLogs, HabitAdherence } from "@/types/habit.types";

export const useHabitAdherence = (habit: HabitWithLogs): HabitAdherence =>
	useMemo(() => calculateHabitAdherence(habit), [habit]);
