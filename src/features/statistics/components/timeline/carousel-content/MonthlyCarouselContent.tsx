import type { MonthlySummaryTimeline } from "@/types/statistics.types";
import { padNumber } from "@/utils/helpers/padNumber";

const MonthlyCarouselContent = ({ months }: { months: MonthlySummaryTimeline }) => {
	const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	return (
		<>
			{months.map((slide, slideIndex) => (
				<div key={slideIndex} className="timeline-embla__slide monthly-summary">
					<div className="timeline-embla__slide-header">
						<span className="period-label">Month Summary</span>
					</div>

					<div className="monthly-cells">
						{slide.map((month, i) => {
							if (!month) {
								return (
									<div key={i} className="month-cell month-cell--placeholder">
										<span className="month-cell__month">---</span>
										<span className="month-cell__year">----</span>
										<span className="month-cell__completed-target">--/--</span>
										<div className="month-cell__dot month-cell__dot--placeholder"></div>
									</div>
								);
							}

							return (
								<div key={i} className="month-cell">
									<span className="month-cell__month">{MONTH_NAMES[month.month - 1]}</span>
									<span className="month-cell__year">{month.year}</span>

									<span className="month-cell__completed-target">
										{padNumber(month.completed)}/{padNumber(month.target)}
									</span>
									<div className={`month-cell__dot month-cell__dot--${month.status}`}></div>
								</div>
							);
						})}
					</div>
				</div>
			))}
		</>
	);
};

export default MonthlyCarouselContent;
