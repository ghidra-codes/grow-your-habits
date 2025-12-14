import type { SummaryPeriod } from "@/types/statistic.types";

export const getWeightedPeriodAdherence = (summaries: SummaryPeriod[]): number => {
	if (!summaries.length) return 0;

	const weights = {
		current: 0.3,
		recent: 1.0,
		old: 0.6,
	};

	let weightedCompleted = 0;
	let weightedTotal = 0;

	const reversed = [...summaries].reverse();

	reversed.forEach((period, index) => {
		let weight = weights.old;

		if (index === 0) weight = weights.current;
		else if (index < 4) weight = weights.recent;

		// COMPLETED PERIOD
		if (period.status === "completed") {
			weightedCompleted += weight;
			weightedTotal += weight;
			return;
		}

		// MISSED PERIOD
		if (period.status === "missed") {
			weightedTotal += weight;
			return;
		}

		// CURRENT (PENDING) PERIOD — fractional contribution
		if (period.status === "pending") {
			const progress = period.target > 0 ? Math.min(1, period.completed / period.target) : 0;

			weightedCompleted += progress * weight;
			weightedTotal += weight;
		}
	});

	if (weightedTotal === 0) return 0;

	return Math.round((weightedCompleted / weightedTotal) * 100);
};
