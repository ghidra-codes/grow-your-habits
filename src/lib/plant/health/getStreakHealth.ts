const MAX_STREAK_FOR_FULL_HEALTH = 12;

export const getStreakHealth = (currentStreak: number): number => {
	if (currentStreak <= 0) return 0;

	const clamped = Math.min(currentStreak, MAX_STREAK_FOR_FULL_HEALTH);
	const ratio = clamped / MAX_STREAK_FOR_FULL_HEALTH;

	return Math.round(ratio * 100);
};
