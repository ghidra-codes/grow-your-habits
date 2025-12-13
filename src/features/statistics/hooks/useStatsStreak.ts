import { calculateStreaks } from "@/lib/streaks";
import type { HabitWithLogs } from "@/types/habit.types";
import type { Streak } from "@/types/statistic.types";
import { useMemo } from "react";

export const useStatsStreak = (habit: HabitWithLogs): Streak =>
	useMemo(() => calculateStreaks(habit), [habit]);
