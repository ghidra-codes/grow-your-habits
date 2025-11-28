import { useHabitsQuery } from "@/features/habits/hooks/useHabitsQuery";
import { useUserIdRequired } from "@/hooks/useUserIdRequired";
import LoadingSpinner from "@/ui/LoadingSpinner";
import { useHabitAdherence } from "../habits/hooks/habit-adherence/useHabitAdherence";
import AdherenceCircle from "@/ui/AdherenceCircle";

import { TimelineCarousel } from "./components/timeline/TimelineCarousel";
import { useTimelineStats } from "./hooks/useTimelineStats";
import { useStreakStats } from "./hooks/useStreakStats";

const StatisticsView = () => {
	const userId = useUserIdRequired();

	const { data: habits = [], isLoading } = useHabitsQuery(userId);
	const { adherenceMap } = useHabitAdherence(habits);
	const { streakMap } = useStreakStats(habits);
	const { timelineMap } = useTimelineStats(habits, "daily");

	console.log("timelineMap:", timelineMap);
	console.log("streakMap:", streakMap);

	if (isLoading) return <LoadingSpinner />;

	return (
		<div className="stats-list">
			{habits.map((habit) => {
				const adherence = adherenceMap[habit.id];

				return (
					<div key={habit.id} className="habit-stats-card">
						<h3>{habit.name}</h3>

						<TimelineCarousel data={timelineMap[habit.id]} />

						<AdherenceCircle
							percentage={adherence.percentage}
							className="habit-card-circle"
							textSize="28px"
						/>
						<p>Adherence: {adherence.percentage.toFixed(1)}%</p>
						<p>Completed: {adherence.logCount}</p>
						<p>Expected: {adherence.expected}</p>
						<p>Missed: {adherence.missed}</p>
						<p>{adherence.onTrack ? "On Track" : "Behind"}</p>
					</div>
				);
			})}
		</div>
	);
};

export default StatisticsView;
