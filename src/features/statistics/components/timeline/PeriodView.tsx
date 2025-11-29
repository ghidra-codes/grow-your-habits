import { getISOWeek, getISOWeekYear, parseISO } from "date-fns";
import PeriodRow from "./PeriodRow";
import type { TimelineEntry } from "@/types/statistics.types";
import type React from "react";

interface PeriodViewProps {
	period: TimelineEntry[];
}

const PeriodView: React.FC<PeriodViewProps> = ({ period }) => {
	const weeks: TimelineEntry[][] = [];
	let current: TimelineEntry[] = [];

	let weekNum = getISOWeek(parseISO(period[0].date));
	let weekYear = getISOWeekYear(parseISO(period[0].date));

	period.forEach((entry) => {
		const d = parseISO(entry.date);
		const w = getISOWeek(d);
		const y = getISOWeekYear(d);

		if (w !== weekNum || y !== weekYear) {
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
				<PeriodRow key={i} period={week} />
			))}
		</>
	);
};

export default PeriodView;
