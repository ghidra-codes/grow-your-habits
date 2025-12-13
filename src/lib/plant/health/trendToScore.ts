import type { TrendDirection } from "@/types/statistic.types";

export const trendToScore = (trend: TrendDirection): number => {
	switch (trend) {
		case "improving":
			return 100;
		case "stable":
			return 60;
		case "declining":
			return 20;
		default:
			return 0;
	}
};
