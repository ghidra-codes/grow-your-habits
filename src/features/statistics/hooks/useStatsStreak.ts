import { useMemo } from "react";
import { calculateStreaks } from "@/lib/calculateStreaks";
import type { HabitWithLogs } from "@/types/habit.types";
import type { Streak } from "@/types/statistics.types";

export const useStatsStreak = (habit: HabitWithLogs): Streak =>
	useMemo(() => calculateStreaks(habit), [habit]);
