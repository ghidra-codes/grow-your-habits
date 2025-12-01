import type { MonthlySummaryTimeline } from "@/types/statistics.types";
import { format, parseISO } from "date-fns";

const MonthlyCarouselContent = ({ months }: { months: MonthlySummaryTimeline }) => {
	return months.map((m) => (
		<div key={`${m.year}-${m.month}`} className="summary-slide">
			<div className="summary-label">
				<span>{format(parseISO(m.start), "LLLL yyyy")}</span>
			</div>

			<div className="summary-stats">
				<div>
					{m.completed}/{m.target}
				</div>
				<div className={`status status--${m.status}`}>{m.status}</div>
			</div>
		</div>
	));
};

export default MonthlyCarouselContent;
