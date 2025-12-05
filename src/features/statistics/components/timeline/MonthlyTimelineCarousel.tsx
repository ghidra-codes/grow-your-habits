import { EmblaWrapper } from "@/ui/EmblaWrapper";
import MonthlyCarouselContent from "./carousel-content/MonthlyCarouselContent";
import type { HabitWithLogs } from "@/types/habit.types";
import { useStatsMonthlyTimeline } from "../../hooks/timeline/useStatsMonthlyTimeline";

export type MonthlyCarouselProps = {
	habit: HabitWithLogs;
};

const MonthlyTimelineCarousel: React.FC<MonthlyCarouselProps> = ({ habit }) => {
	const data = useStatsMonthlyTimeline(habit);

	const multipleSlides = data.length > 1;

	return (
		<EmblaWrapper multipleSlides={multipleSlides}>
			<MonthlyCarouselContent months={data} />
		</EmblaWrapper>
	);
};

export default MonthlyTimelineCarousel;
