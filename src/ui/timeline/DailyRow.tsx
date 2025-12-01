import type { TimelineEntry } from "@/types/statistics.types";
import { format, getDay, parseISO } from "date-fns";
import React from "react";

interface DailyRowProps {
	period: TimelineEntry[];
	renderOverride?: (entry: TimelineEntry) => React.ReactNode;
}

const formatWeekday = (dateStr: string) => format(parseISO(dateStr), "EEE");
const formatShortDate = (dateStr: string) => format(parseISO(dateStr), "dd/MM");

const DailyRow: React.FC<DailyRowProps> = ({ period, renderOverride }) => {
	const slots: (TimelineEntry | null)[] = Array(7).fill(null);

	period.forEach((entry) => {
		if (entry.date === "placeholder") return;

		const d = parseISO(entry.date);
		let idx = getDay(d);
		idx = idx === 0 ? 6 : idx - 1;
		slots[idx] = entry;
	});

	const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

	return (
		<div className="week-row">
			{slots.map((entry, i) => {
				if (!entry || entry.status === "unavailable") {
					return (
						<div key={i} className="week-day week-day--placeholder">
							<span className="week-day__weekday">{labels[i]}</span>
							<span className="week-day__date">--/--</span>
							<div className="week-day__dot week-day__dot--placeholder" />
						</div>
					);
				}

				if (renderOverride) {
					return <React.Fragment key={entry.date}>{renderOverride(entry)}</React.Fragment>;
				}

				return (
					<div key={entry.date} className="week-day">
						<span className="week-day__weekday">{formatWeekday(entry.date)}</span>
						<span className="week-day__date">{formatShortDate(entry.date)}</span>
						<div className={`week-day__dot week-day__dot--${entry.status}`} />
					</div>
				);
			})}
		</div>
	);
};

export default DailyRow;
