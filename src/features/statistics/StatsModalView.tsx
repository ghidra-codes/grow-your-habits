import { useHabitsQuery } from "@/features/habits/hooks/queries/useHabitsQuery";
import { useUserIdRequired } from "@/hooks/useUserIdRequired";
import type { TimelineModesMap, TimelineViewMode } from "@/types/statistics.types";
import LoadingSpinner from "@/ui/LoadingSpinner";
import ProgressBar from "@/ui/ProgressBar";
import Select from "@/ui/Select";
import { getHabitStats } from "@/utils/helpers/getHabitStats";
import { getCarouselProps } from "@/utils/helpers/timeline/getCarouselProps";
import { useState } from "react";
import { useHabitAdherence } from "../habits/hooks/derived/useHabitAdherence";
import StreakBar from "./components/StreakBar";
import { TimelineCarousel } from "./components/timeline/TimelineCarousel";
import { useStatsTimeline } from "./hooks/timeline/useStatsTimeline";
import { useStatsStreak } from "./hooks/useStatsStreak";
import useShortTermAdherence from "./hooks/useShortTermAdherence";

const StatsModalView = () => {
	const [timelineModes, setTimelineModes] = useState<TimelineModesMap>({});

	const userId = useUserIdRequired();

	const { data: habits = [], isLoading } = useHabitsQuery(userId);
	const adherenceMap = useHabitAdherence(habits);
	const shortTermAdherenceMap = useShortTermAdherence(habits);

	const streakMap = useStatsStreak(habits);
	const timelineMap = useStatsTimeline(habits, timelineModes);

	console.log("habits:", habits);
	console.log("streakMap:", streakMap);
	console.log("timelineMap:", timelineMap);
	console.log("adherenceMap:", adherenceMap);
	console.log("shortTermAdherenceMap:", shortTermAdherenceMap);

	if (isLoading) return <LoadingSpinner />;

	return (
		<div className="stats-list">
			{habits.map((habit) => {
				const stats = getHabitStats({
					habit,
					adherenceMap,
					streakMap,
					timelineMap,
					timelineModes,
					habitFrequency: habit.frequency_type,
					shortTermAdherenceMap,
				});

				const props = getCarouselProps(habit, timelineMap, stats.mode, stats.isCompact);
				const hasCarouselViewMode =
					habit.frequency_type === "daily" || habit.frequency_type === "custom";

				const isWeeklyFrequency = habit.frequency_type === "weekly";
				const isMonthlyFrequency = habit.frequency_type === "monthly";

				const frequencyLabel = isWeeklyFrequency
					? "week(s)"
					: isMonthlyFrequency
					? "month(s)"
					: "day(s)";

				return (
					<div key={habit.id} className="habit-stats-card">
						<h2>
							Habit name: <span>{habit.name}</span>
						</h2>

						<div className="streak-container">
							<div className="current-streak">
								<div className="streak-info">
									<h3>
										Current streak:{" "}
										<span>
											{stats.currentStreak || 0} {frequencyLabel}
										</span>
									</h3>

									{stats.currentStreak > 12 && (
										<span className="streak-overflow-label">
											+{stats.currentStreak - 12}
										</span>
									)}
								</div>

								<StreakBar streak={stats.currentStreak || 0} />
							</div>

							<div className="longest-streak">
								<h3>
									Longest streak:{" "}
									<span>
										{stats.longestStreak || 0} {frequencyLabel}
									</span>
								</h3>
							</div>
						</div>

						<div className="timeline-container">
							<div className="timeline-info">
								<h3>Timeline:</h3>

								{hasCarouselViewMode && (
									<Select<TimelineViewMode>
										value={stats.mode}
										className="timeline-mode-select"
										onChange={(value) =>
											setTimelineModes((prev) => ({
												...prev,
												[habit.id]: value,
											}))
										}
										options={[
											{ value: "monthly", label: "Monthly" },
											{ value: "weekly", label: "Weekly" },
										]}
									/>
								)}
							</div>

							<TimelineCarousel {...props} />
						</div>

						<div className="progressbar-container">
							<h3>Overall adherence:</h3>
							<ProgressBar value={stats.adherence.percentage || 0} />
						</div>

						<div className="progressbar-container">
							<h3>Adherence last 7 days:</h3>
							<ProgressBar value={stats.shortTermAdherence?.last7 || 0} />
						</div>

						<div className="progressbar-container">
							<h3>Adherence last 30 days:</h3>
							<ProgressBar value={stats.shortTermAdherence?.last30 || 0} />
						</div>

						<div className="trend-container">
							<h3>Trend:</h3>
							<span className={`trend-label trend-${stats.trend}`}>{stats.trend}</span>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default StatsModalView;
