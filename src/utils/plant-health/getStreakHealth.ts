export const getStreakHealth = (currentStreak: number): number => {
	if (currentStreak >= 7) return 100;
	if (currentStreak >= 3) return 65;
	return Math.max(0, currentStreak * 20);
};
