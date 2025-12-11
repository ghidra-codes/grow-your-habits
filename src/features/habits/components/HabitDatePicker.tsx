import type { TimelineEntry } from "@/types/statistic.types";
import DailyRow from "@/ui/timeline/DailyRow";
import DailyRows from "@/ui/timeline/DailyRows";
import { format, isAfter, parseISO, startOfToday } from "date-fns";

interface HabitDatePickerProps {
	period: TimelineEntry[];
	mode: "weekly" | "monthly";
	onSelectDate: (entryDate: string, completed: boolean, e: React.MouseEvent<HTMLDivElement>) => void;
}

const HabitDatePicker = ({ period, mode, onSelectDate }: HabitDatePickerProps) => {
	const renderClickable = (entry: TimelineEntry) => {
		const d = parseISO(entry.date);
		const today = startOfToday();
		const isFuture = isAfter(d, today);

		const weekday = format(d, "EEE");
		const short = format(d, "dd/MM");

		const disabled = entry.status === "unavailable" || isFuture;
		const completed = entry.status === "completed";

		const dotStateClass = disabled ? "disabled" : completed ? "completed" : "active";

		return (
			<div
				className={`week-day date-picker-day ${disabled ? "disabled" : "active"}`}
				onClick={(e) => {
					if (!disabled) onSelectDate(entry.date, completed, e);
				}}
			>
				<span className="week-day__weekday">{weekday}</span>
				<span className="week-day__date">{short}</span>
				<div className={`date-picker__dot ${dotStateClass}`} />
			</div>
		);
	};

	if (mode === "weekly") {
		return (
			<div className="date-picker-wrapper">
				<DailyRow period={period} renderOverride={renderClickable} />
			</div>
		);
	}

	return (
		<div className={`date-picker-wrapper ${period.length > 7 ? "compact" : ""}`}>
			<DailyRows period={period} renderOverride={renderClickable} />
		</div>
	);
};

export default HabitDatePicker;
