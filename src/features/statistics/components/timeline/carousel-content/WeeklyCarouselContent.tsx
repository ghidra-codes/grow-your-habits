import type { WeeklySummaryTimeline } from "@/types/statistic.types";
import { padNumber } from "@/lib/ui";
import { format, parseISO } from "date-fns";
import { FaAngleDoubleRight } from "react-icons/fa";

const WeeklyCarouselContent = ({ weeks }: { weeks: WeeklySummaryTimeline }) => {
	const isMultipleSlides = weeks.length > 1;

	return (
		<>
			{weeks.map((slide, slideIndex) => (
				<div key={slideIndex} className="timeline-embla__slide weekly-summary">
					<div className="timeline-embla__slide-header">
						<span className="period-label">Week Summary</span>

						{isMultipleSlides && (
							<div
								className={`slide-arrow ${slideIndex === weeks.length - 1 ? "rotated" : ""}`}
							>
								<FaAngleDoubleRight size={22} />
							</div>
						)}
					</div>

					<div className="weekly-cells">
						{slide.map((week, i) => {
							if (!week) {
								return (
									<div key={i} className="week-cell week-cell--placeholder">
										<span className="week-cell__week-number">w--</span>
										<span className="week-cell__week-start-end">S: --/--</span>
										<span className="week-cell__week-start-end">E: --/--</span>
										<span className="week-cell__completed-target">--/--</span>
										<div className="week-cell__dot week-cell__dot--placeholder"></div>
									</div>
								);
							}

							const formattedStart = format(parseISO(week.start), "dd/MM");
							const formattedEnd = format(parseISO(week.end), "dd/MM");

							return (
								<div key={i} className="week-cell">
									<span className="week-cell__week-number">w{padNumber(week.number)}</span>
									<span className="week-cell__week-start-end">S: {formattedStart}</span>
									<span className="week-cell__week-start-end">E: {formattedEnd}</span>

									<span className="week-cell__completed-target">
										{padNumber(week.completed)}/{padNumber(week.target)}
									</span>
									<div className={`week-cell__dot week-cell__dot--${week.status}`}></div>
								</div>
							);
						})}
					</div>
				</div>
			))}
		</>
	);
};

export default WeeklyCarouselContent;
