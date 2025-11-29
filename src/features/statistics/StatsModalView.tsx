import { useHabitsQuery } from "@/features/habits/hooks/useHabitsQuery";
import { useUserIdRequired } from "@/hooks/useUserIdRequired";
import type { TimelineViewMode } from "@/types/statistics.types";
import LoadingSpinner from "@/ui/LoadingSpinner";
import ProgressBar from "@/ui/ProgressBar";
import Select from "@/ui/Select";
import { useState } from "react";
import { useHabitAdherence } from "../habits/hooks/habit-adherence/useHabitAdherence";
import { TimelineCarousel } from "./components/timeline/TimelineCarousel";
import { useStatsSteak } from "./hooks/useStatsStreak";
import { useStatsTimeline } from "./hooks/useStatsTimeline";
import StreakBar from "./components/StreakBar";

const StatsModalView = () => {
	const [timelineModes, setTimelineModes] = useState<Record<string, TimelineViewMode>>({});

	const userId = useUserIdRequired();

	const { data: habits = [], isLoading } = useHabitsQuery(userId);
	const { adherenceMap } = useHabitAdherence(habits);
	const { streakMap } = useStatsSteak(habits);
	const { timelineMap } = useStatsTimeline(habits, timelineModes);

	console.log("timelineMap:", timelineMap);
	console.log("streakMap:", streakMap);

	if (isLoading) return <LoadingSpinner />;

	return (
		<div className="stats-list">
			{habits.map((habit) => {
				const adherence = adherenceMap[habit.id];
				const currentStreak = streakMap[habit.id].currentStreak + 2;
				const longestStreak = streakMap[habit.id].longestStreak;
				const mode = timelineModes[habit.id] ?? "weekly";
				const isSinglePeriod = timelineMap[habit.id]?.length === 1;
				const isCompact = isSinglePeriod && timelineMap[habit.id][0].length > 7 && mode === "monthly";

				return (
					<div key={habit.id} className="habit-stats-card">
						<h2>
							Habit name: <span>{habit.name}</span>
						</h2>

						<div className="streak-container">
							<div className="current-streak">
								<div className="streak-info">
									<h3>
										Current streak: <span>{currentStreak || 0} days</span>
									</h3>

									{currentStreak > 12 && (
										<span className="streak-overflow-label">+{currentStreak - 12}</span>
									)}
								</div>

								<StreakBar streak={currentStreak || 0} />
							</div>

							<div className="longest-streak">
								<h3>
									Longest streak: <span>{longestStreak || 0} days</span>
								</h3>
							</div>
						</div>

						<div className="timeline-container">
							<div className="timeline-info">
								<h3>Timeline:</h3>

								<Select<TimelineViewMode>
									value={mode}
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
							</div>

							<TimelineCarousel data={timelineMap[habit.id]} compact={isCompact} mode={mode} />
						</div>

						<div className="progressbar-container">
							<h3>Adherence:</h3>
							<ProgressBar value={adherence?.percentage || 0} />
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default StatsModalView;
