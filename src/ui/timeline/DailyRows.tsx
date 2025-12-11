import type { TimelineEntry } from "@/types/statistic.types";
import { getISOWeek, getISOWeekYear, parseISO } from "date-fns";
import DailyRow from "./DailyRow";

interface DailyRowsProps {
	period: TimelineEntry[];
	renderOverride?: (entry: TimelineEntry) => React.ReactNode;
}

const DailyRows: React.FC<DailyRowsProps> = ({ period, renderOverride }) => {
	const weeks: TimelineEntry[][] = [];
	let current: TimelineEntry[] = [];

	const firstReal = period.find((e) => e.date !== "placeholder");
	let weekNum = firstReal ? getISOWeek(parseISO(firstReal.date)) : 0;
	let weekYear = firstReal ? getISOWeekYear(parseISO(firstReal.date)) : 0;

	period.forEach((entry) => {
		if (entry.date === "placeholder") {
			if (current.length > 0 && current[0].date !== "placeholder") {
				weeks.push(current);
				current = [];
			}

			if (current.length === 7) {
				weeks.push(current);
				current = [];
			}

			current.push(entry);
			return;
		}

		const d = parseISO(entry.date);
		const w = getISOWeek(d);
		const y = getISOWeekYear(d);

		if (w !== weekNum || y !== weekYear || current.length === 7) {
			weeks.push(current);
			current = [];
			weekNum = w;
			weekYear = y;
		}

		current.push(entry);
	});

	if (current.length) weeks.push(current);

	return (
		<>
			{weeks.map((week, i) => (
				<DailyRow key={i} period={week} renderOverride={renderOverride} />
			))}
		</>
	);
};

export default DailyRows;
