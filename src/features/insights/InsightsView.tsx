import { useInsights } from "@/features/insights/hooks/useInsights";
import { useHabitsQuery } from "../habits/hooks/queries/useHabitsQuery";
import { useUserIdRequired } from "@/hooks/useUserIdRequired";

const InsightsView = () => {
	const userId = useUserIdRequired();
	const { data: habits = [], isLoading } = useHabitsQuery(userId);

	// Temporary for testing — replace with real weekly growth logic
	const weeklyGrowthChange = 5;

	const insights = useInsights({ habits, weeklyGrowthChange });

	if (isLoading) return <div>Loading insights…</div>;

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
