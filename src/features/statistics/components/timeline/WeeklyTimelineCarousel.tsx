import type { HabitWithLogs } from "@/types/habit.types";
import { EmblaWrapper } from "@/ui/EmblaWrapper";
import { useStatsWeeklyTimeline } from "../../hooks/timeline/useStatsWeeklyTimeline";
import WeeklyCarouselContent from "./carousel-content/WeeklyCarouselContent";

export type WeeklyCarouselProps = {
	habit: HabitWithLogs;
};

const WeeklyTimelineCarousel: React.FC<WeeklyCarouselProps> = ({ habit }) => {
	const data = useStatsWeeklyTimeline(habit);

	const multipleSlides = data.length > 1;

	return (
		<EmblaWrapper multipleSlides={multipleSlides}>
			<WeeklyCarouselContent weeks={data} />
		</EmblaWrapper>
	);
};

export default WeeklyTimelineCarousel;
