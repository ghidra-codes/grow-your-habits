import type { TimelineMap, TimelineViewMode } from "@/types/statistics.types";
import type { TimelineCarouselProps } from "@/types/carousel.types";
import type { HabitWithLogs } from "@/types/habit.types";

export const getCarouselProps = (
	habit: HabitWithLogs,
	timelineMap: TimelineMap,
	mode: TimelineViewMode,
	compact: boolean
): TimelineCarouselProps => {
	switch (habit.frequency_type) {
		case "daily":
			return {
				frequency: "daily",
				data: timelineMap.daily[habit.id],
				mode,
				compact,
			};

		case "weekly":
			return {
				frequency: "weekly",
				data: timelineMap.weekly[habit.id],
			};

		case "monthly":
			return {
				frequency: "monthly",
				data: timelineMap.monthly[habit.id],
			};
	}
};
