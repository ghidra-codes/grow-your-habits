import type { TrendDirection } from "@/types/statistic.types";

const TREND_SCORE: Record<TrendDirection, number> = {
	improving: 100,
	strong: 90,
	stable: 60,
	declining: 20,
};

export const trendToScore = (trend: TrendDirection): number => TREND_SCORE[trend];
