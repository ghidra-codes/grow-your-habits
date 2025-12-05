import { useMemo } from "react";
import { calculateShortTermAdherence } from "@/lib/calculateShortTermAdherence";
import type { HabitWithLogs, ShortTermAdherence } from "@/types/habit.types";

export const useShortTermAdherence = (habit: HabitWithLogs): ShortTermAdherence =>
	useMemo(() => calculateShortTermAdherence(habit), [habit]);
