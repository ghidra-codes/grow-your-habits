import type { HabitWithLogs } from "@/types/habit.types";
import type { TimelineViewMode } from "@/types/statistic.types";
import { EmblaWrapper } from "@/ui/EmblaWrapper";
import { useStatsDailyTimeline } from "../../hooks/timeline/useStatsDailyTimeline";
import DailyCarouselContent from "./carousel-content/DailyCarouselContent";

export type DailyCarouselProps = {
	habit: HabitWithLogs;
	mode: TimelineViewMode;
};

const DailyTimelineCarousel: React.FC<DailyCarouselProps> = ({ habit, mode }) => {
	const period = useStatsDailyTimeline(habit, mode);

	const days = period[0].length;
	const compact = days > 7 && mode === "monthly";

	const multipleSlides = period.length > 1;

	return (
		<EmblaWrapper multipleSlides={multipleSlides}>
			<DailyCarouselContent periods={period} compact={compact} mode={mode} />
		</EmblaWrapper>
	);
};

export default DailyTimelineCarousel;
