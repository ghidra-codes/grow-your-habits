import type { HabitWithLogs } from "@/types/habit.types";
import type { InsightConfidence } from "@/types/insight.types";
import { differenceInDays, startOfDay } from "date-fns";

export const useInsightConfidence = (habits: HabitWithLogs[]): InsightConfidence => {
	if (habits.length === 0) {
		return { level: "low", label: "Still learning", daysTracked: 0 };
	}

	const today = startOfDay(new Date());

	const oldestHabitDate = habits.reduce((oldest, h) => {
		const created = startOfDay(new Date(h.created_at));
		return created < oldest ? created : oldest;
	}, today);

	const daysTracked = Math.max(1, differenceInDays(today, oldestHabitDate));

	let level: InsightConfidence["level"] = "low";

	if (daysTracked >= 30) level = "high";
	else if (daysTracked >= 7) level = "medium";

	return {
		level,
		daysTracked,
		label:
			level === "high"
				? "High confidence"
				: level === "medium"
				? "Growing confidence"
				: "Still learning",
	};
};
