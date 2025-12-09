import { calculateRecentAdherence } from "@/lib/calculateRecentAdherence";
import type { HabitWithLogs, RecentAdherence } from "@/types/habit.types";
import { useMemo } from "react";

export const useRecentAdherence = (habit: HabitWithLogs): RecentAdherence =>
	useMemo(() => calculateRecentAdherence(habit), [habit]);
