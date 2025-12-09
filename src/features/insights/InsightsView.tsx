import { useInsights } from "@/features/insights/hooks/useInsights";
import { useMonthlyGrowthChange } from "@/features/plant/hooks/queries/growth-change/useMonthlyGrowthChange";
import { useWeeklyGrowthChange } from "@/features/plant/hooks/queries/growth-change/useWeeklyGrowthChange";
import { useUserIdRequired } from "@/features/auth/hooks/useUserIdRequired";
import LoadingSpinner from "@/ui/LoadingSpinner";
import { useHabitsQuery } from "../habits/hooks/queries/useHabitsQuery";

const InsightsView = () => {
	const userId = useUserIdRequired();
	const { data: habits = [], isLoading } = useHabitsQuery(userId);

	const { data: weeklyGrowthChange = 0 } = useWeeklyGrowthChange(userId);
	const { data: monthlyGrowthChange = 0 } = useMonthlyGrowthChange(userId);

	const insights = useInsights({ habits, weeklyGrowthChange, monthlyGrowthChange });

	if (isLoading) return <LoadingSpinner />;

	return (
		<div style={{ padding: "1rem" }}>
			<h2 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>Insights (Debug View)</h2>

			{insights.length === 0 && <div>No insights available for your current habits.</div>}

			<ul style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
				{insights.map((insight) => (
					<li
						key={insight.id}
						style={{
							padding: "0.75rem",
							borderRadius: "6px",
							background: "#1e1e1e",
							color: "#fff",
							border: "1px solid #333",
						}}
					>
						<strong>{insight.id}</strong>
						<div>{insight.message}</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default InsightsView;
