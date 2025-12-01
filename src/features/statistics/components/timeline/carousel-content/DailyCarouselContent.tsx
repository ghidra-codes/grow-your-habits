import type { DailyPeriodTimeline, TimelineEntry } from "@/types/statistics.types";
import DailySlide from "@/ui/timeline/DailySlide";
import { splitIntoWeeks } from "@/utils/helpers/splitIntoWeeks";
import { format, getISOWeek, parseISO } from "date-fns";
import { FaAngleDoubleRight } from "react-icons/fa";

interface DailyCarouselContentProps {
	periods: DailyPeriodTimeline;
	compact?: boolean;
	mode: "weekly" | "monthly";
}

const makePlaceholderEntry = (): TimelineEntry => ({
	date: "placeholder",
	status: "unavailable",
});

const DailyCarouselContent = ({ periods, compact, mode }: DailyCarouselContentProps) => {
	const getLabel = (period: TimelineEntry[]) => {
		if (!period.length) return "";
		const firstDate = parseISO(period[0].date);
		return mode === "weekly" ? `v${getISOWeek(firstDate)}` : format(firstDate, "LLLL");
	};

	const weekCounts = periods.map((p) => splitIntoWeeks(p).length);
	const maxWeeks = Math.max(...weekCounts);

	const paddedPeriods = periods.map((period, index) => {
		const missingWeeks = maxWeeks - weekCounts[index];
		if (missingWeeks <= 0) return period;
		return [...period, ...Array.from({ length: missingWeeks * 7 }, makePlaceholderEntry)];
	});

	const isMultiplePeriods = paddedPeriods.length > 1;

	return (
		<>
			{paddedPeriods.map((period, i) => (
				<div key={i} className={`timeline-embla__slide ${compact ? "compact" : ""}`}>
					<div className="timeline-embla__slide-header">
						<span className="period-label">{getLabel(period)}</span>
						{isMultiplePeriods && (
							<div className={`slide-arrow ${i === paddedPeriods.length - 1 ? "rotated" : ""}`}>
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
