export const getDailyGrowthAmount = (health: number): number => {
	if (health < 10) return 0;

	const BASE = 1;

	const scaled = health / 20;

	const amount = BASE + scaled;

	return Math.round(amount);
};
