import type { HabitWithRelations, ShortTermAdherenceMap } from "@/types/habit.types";
import { calculateShortTermAdherence } from "@/utils/calculateShortTermAdherence";
import { useMemo } from "react";

const useShortTermAdherence = (habits: HabitWithRelations[]) =>
	useMemo(() => {
		const adherenceMap: ShortTermAdherenceMap = {};

		for (const habit of habits) adherenceMap[habit.id] = calculateShortTermAdherence(habit);

		return adherenceMap;
	}, [habits]);

export default useShortTermAdherence;
