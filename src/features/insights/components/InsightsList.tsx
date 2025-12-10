import type { Insight } from "@/types/insights.types";
import { useState } from "react";
import InsightCard from "./InsightsCard";

const InsightsList = ({ rawInsights }: { rawInsights: Insight[] }) => {
	const [insights, setInsights] = useState(rawInsights);
	const [isLocked, setIsLocked] = useState(false);

	const handleCardClick = (id: string) => {
		if (isLocked) return;
		setIsLocked(true);

		setInsights((prev) => {
			const first = prev[0];
			if (!first || first.id !== id) return prev;
			return [...prev.slice(1), first];
		});

		setTimeout(() => setIsLocked(false), 600);
	};

	return (
		<>
			{insights.map((insight, i) => (
				<InsightCard
					key={insight.id}
					insight={insight}
					index={i}
					onClick={() => handleCardClick(insight.id)}
					isLocked={isLocked}
				/>
			))}
		</>
	);
};

export default InsightsList;
