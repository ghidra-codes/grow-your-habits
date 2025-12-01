import type { HabitWithRelations } from "@/types/habit.types";
import type { TimelineEntry } from "@/types/statistics.types";
import {
	startOfWeek,
	endOfWeek,
	startOfMonth,
	eachDayOfInterval,
	format,
	isSameMonth,
	isAfter,
} from "date-fns";

export const generateCurrentPeriod = (
	habit: HabitWithRelations
): {
	period: TimelineEntry[];
	mode: "weekly" | "monthly";
} => {
	const today = new Date();

	// WEEKLY
	if (habit.frequency_type === "weekly") {
		const start = startOfWeek(today, { weekStartsOn: 1 });
		const end = endOfWeek(today, { weekStartsOn: 1 });

		const days = eachDayOfInterval({ start, end });

		const period: TimelineEntry[] = days.map((d) => {
			const dateStr = format(d, "yyyy-MM-dd");
			const logged = habit.logs?.some((l) => l.log_date === dateStr) ?? false;

			if (isAfter(d, today)) return { date: dateStr, status: "unavailable" };

			return { date: dateStr, status: logged ? "completed" : "pending" };
		});

		return { period, mode: "weekly" };
	}

	// MONTHLY
	const monthStart = startOfMonth(today);

	const visualStart = startOfWeek(monthStart, { weekStartsOn: 1 });
	const visualEnd = endOfWeek(today, { weekStartsOn: 1 });

	const days = eachDayOfInterval({ start: visualStart, end: visualEnd });

	const period: TimelineEntry[] = days.map((d) => {
		const dateStr = format(d, "yyyy-MM-dd");
		const logged = habit.logs?.some((l) => l.log_date === dateStr) ?? false;
		const inThisMonth = isSameMonth(d, monthStart);

		if (!inThisMonth) return { date: dateStr, status: "unavailable" };

		if (isAfter(d, today)) return { date: dateStr, status: "unavailable" };

		return { date: dateStr, status: logged ? "completed" : "pending" };
	});

	return { period, mode: "monthly" };
};
