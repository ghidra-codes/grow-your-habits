import type { HabitWithLogs, ShortTermAdherenceMap } from "@/types/habit.types";
import { calculateShortTermAdherence } from "@/lib/calculateShortTermAdherence";
import { useMemo } from "react";

const useShortTermAdherenceMap = (habits: HabitWithLogs[]) =>
	useMemo(() => {
		const adherenceMap: ShortTermAdherenceMap = {};

		for (const habit of habits) adherenceMap[habit.id] = calculateShortTermAdherence(habit);

		return adherenceMap;
	}, [habits]);

export default useShortTermAdherenceMap;
