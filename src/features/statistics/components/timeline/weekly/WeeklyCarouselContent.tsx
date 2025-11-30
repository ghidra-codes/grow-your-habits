import type { WeeklySummaryTimeline } from "@/types/statistics.types";

const WeeklyCarouselContent = ({ weeks }: { weeks: WeeklySummaryTimeline }) => {
	return weeks.map((w) => (
		<div key={`${w.year}-${w.weekNumber}`} className="summary-slide">
			<div className="summary-label">
				<span>
					v{w.weekNumber} – {w.start} → {w.end}
				</span>
			</div>

			<div className="summary-stats">
				<div>
					{w.completed}/{w.target}
				</div>
				<div className={`status status--${w.status}`}>{w.status}</div>
			</div>
		</div>
	));
};

export default WeeklyCarouselContent;
