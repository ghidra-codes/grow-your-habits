import { useHabitsQuery } from "@/features/habits/hooks/useHabitsQuery";
import { useUserIdRequired } from "@/hooks/useUserIdRequired";
import LoadingSpinner from "@/ui/LoadingSpinner";
import { useHabitAdherence } from "../habits/hooks/habit-adherence/useHabitAdherence";

const StatisticsView = () => {
	const userId = useUserIdRequired();

	const { data: habits = [], isLoading: loadingHabits } = useHabitsQuery(userId);
	const { adherenceByHabitId, isLoading: loadingAdherence } = useHabitAdherence(habits, userId);

	const loading = loadingHabits || loadingAdherence;

	if (loading) return <LoadingSpinner />;

	return (
		<div className="stats-list">
			{habits.map((habit) => {
				const adherence = adherenceByHabitId[habit.id];

				return (
					<div key={habit.id} className="habit-stats-card">
						<h3>{habit.name}</h3>
						<p>Adherence: {adherence.percentage.toFixed(0)}%</p>
						<p>Completed: {adherence.actual}</p>
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
