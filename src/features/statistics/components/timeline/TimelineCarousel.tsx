import type { PeriodTimeline, TimelineEntry, TimelineViewMode } from "@/types/statistics.types";
import useEmblaCarousel from "embla-carousel-react";
import type React from "react";
import PeriodView from "./PeriodView";
import { format, getISOWeek, parseISO } from "date-fns";
import { FaAngleDoubleRight } from "react-icons/fa";

interface TimelineCarouselProps {
	data: PeriodTimeline;
	compact?: boolean;
	mode: TimelineViewMode;
}

export const TimelineCarousel: React.FC<TimelineCarouselProps> = ({ data, compact, mode }) => {
	const isMultiplePeriods = data.length > 1;

	const [emblaRef] = useEmblaCarousel({
		active: isMultiplePeriods,
		containScroll: "keepSnaps",
		align: "start",
	});

	const getLabel = (period: TimelineEntry[]) => {
		const firstDate = parseISO(period[0].date);

		if (mode === "weekly") {
			return `v${getISOWeek(firstDate)}`;
		}

		return format(firstDate, "LLLL");
	};

	return (
		<div className="timeline-embla" ref={emblaRef}>
			<div className="timeline-embla__container">
				{data.map((period, i) => (
					<div key={i} className={`timeline-embla__slide ${compact ? "compact" : ""}`}>
						<div className="timeline-embla__slide-header">
							<span className="period-label">{getLabel(period)}</span>
							{isMultiplePeriods && (
								<div className={`slide-arrow ${i === data.length - 1 ? "rotated" : ""}`}>
									<FaAngleDoubleRight size={22} />
								</div>
							)}
						</div>
						<PeriodView period={period} />
					</div>
				))}
			</div>
		</div>
	);
};
