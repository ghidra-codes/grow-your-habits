export const getDailyGrowthAmount = (health: number): number => {
	if (health < 10) return 0;
	return Math.round(1 + health / 20);
};
