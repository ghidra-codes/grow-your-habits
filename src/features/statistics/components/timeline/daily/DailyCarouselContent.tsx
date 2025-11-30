import type { DailyPeriodTimeline, TimelineEntry } from "@/types/statistics.types";
import { format, getISOWeek, parseISO } from "date-fns";
import { FaAngleDoubleRight } from "react-icons/fa";
import DailySlide from "./DailySlide";

interface DailyCarouselContentProps {
	periods: DailyPeriodTimeline;
	compact?: boolean;
	mode: "weekly" | "monthly";
}

const DailyCarouselContent = ({ periods, compact, mode }: DailyCarouselContentProps) => {
	const getLabel = (period: TimelineEntry[]) => {
		if (!period.length) return "";

		const firstDate = parseISO(period[0].date);

		if (mode === "weekly") {
			return `v${getISOWeek(firstDate)}`;
		}

		return format(firstDate, "LLLL");
	};

	const isMultiplePeriods = periods.length > 1;

	return (
		<>
			{periods.map((period, i) => (
				<div key={i} className={`timeline-embla__slide ${compact ? "compact" : ""}`}>
					<div className="timeline-embla__slide-header">
						<span className="period-label">{getLabel(period)}</span>
						{isMultiplePeriods && (
							<div className={`slide-arrow ${i === periods.length - 1 ? "rotated" : ""}`}>
								<FaAngleDoubleRight size={22} />
							</div>
						)}
					</div>
					<DailySlide period={period} />
				</div>
			))}
		</>
	);
};

export default DailyCarouselContent;
