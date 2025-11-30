import type { TimelineEntry } from "@/types/statistics.types";
import { format, getDay, parseISO } from "date-fns";

interface DailyRowProps {
	period: TimelineEntry[];
}

// Helpers
const formatWeekday = (dateStr: string) => format(parseISO(dateStr), "EEE");
const formatShortDate = (dateStr: string) => format(parseISO(dateStr), "dd/MM");

const getEntryStatusClass = (status: TimelineEntry["status"]) => {
	switch (status) {
		case "completed":
			return "week-day__dot--completed";
		case "missed":
			return "week-day__dot--missed";
		case "pending":
			return "week-day__dot--pending";
		case "unavailable":
			return "week-day__dot--unavailable";
		default:
			return "";
	}
};

const DailyRow: React.FC<DailyRowProps> = ({ period }) => {
	const slots: (TimelineEntry | null)[] = Array(7).fill(null);

	period.forEach((entry) => {
		const date = parseISO(entry.date);
		let dayIndex = getDay(date);
		dayIndex = dayIndex === 0 ? 6 : dayIndex - 1;
		slots[dayIndex] = entry;
	});

	const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

	return (
		<div className="week-row">
			{slots.map((entry, idx) => {
				if (!entry) {
					return (
						<div key={idx} className="week-day week-day--placeholder">
							<span className="week-day__weekday">{weekdayLabels[idx]}</span>
							<span className="week-day__date">--/--</span>
							<div className="week-day__dot week-day__dot--placeholder" />
						</div>
					);
				}

				return (
					<div key={entry.date} className="week-day">
						<span className="week-day__weekday">{formatWeekday(entry.date)}</span>
						<span className="week-day__date">{formatShortDate(entry.date)}</span>
						<div className={`week-day__dot ${getEntryStatusClass(entry.status)}`} />
					</div>
				);
			})}
		</div>
	);
};

export default DailyRow;
