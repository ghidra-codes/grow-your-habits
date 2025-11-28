import type { PeriodTimeline, TimelineEntry } from "@/types/statistics.types";
import { format, parseISO } from "date-fns";
import useEmblaCarousel from "embla-carousel-react";

type TimelineData = TimelineEntry[] | PeriodTimeline;

interface TimelineCarouselProps {
	data: TimelineData;
}

export const TimelineCarousel = ({ data }: TimelineCarouselProps) => {
	const [emblaRef] = useEmblaCarousel({ dragFree: false, loop: false });

	const slides = Array.isArray(data[0]) ? (data as PeriodTimeline) : ([data] as PeriodTimeline);

	return (
		<div className="timeline-embla" ref={emblaRef}>
			<div className="timeline-embla__container">
				{slides.map((period, i) => (
					<div key={i} className="timeline-embla__slide">
						<PeriodRow period={period} />
					</div>
				))}
			</div>
		</div>
	);
};

const PeriodRow = ({ period }: { period: TimelineEntry[] }) => (
	<div className="week-row">
		{period.map((day) => (
			<div key={day.date} className="week-day">
				<span className="week-day__weekday">{formatWeekday(day.date)}</span>
				<span className="week-day__date">{formatShortDate(day.date)}</span>

				<div
					className={`week-day__dot ${
						day.status === "completed"
							? "week-day__dot--completed"
							: day.status === "missed"
							? "week-day__dot--missed"
							: "week-day__dot--unavailable"
					}`}
				/>
			</div>
		))}
	</div>
);

const formatWeekday = (dateStr: string) => format(parseISO(dateStr), "EEE");

const formatShortDate = (dateStr: string) => format(parseISO(dateStr), "dd/MM");
