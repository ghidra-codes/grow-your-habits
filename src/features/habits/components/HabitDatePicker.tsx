import type { TimelineEntry } from "@/types/statistics.types";
import DailyRow from "@/ui/timeline/DailyRow";
import DailySlide from "@/ui/timeline/DailySlide";
import { format, isAfter, parseISO, startOfToday } from "date-fns";

interface HabitDatePickerProps {
	period: TimelineEntry[];
	mode: "weekly" | "monthly";
	onSelectDate: (entry: TimelineEntry) => void;
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
				onClick={() => {
					if (!disabled) onSelectDate(entry);
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
			<DailySlide period={period} renderOverride={renderClickable} />
		</div>
	);
};

export default HabitDatePicker;
