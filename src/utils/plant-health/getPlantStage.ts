export const getPlantStage = (health: number): 1 | 2 | 3 | 4 | 5 => {
	if (health >= 80) return 5;
	if (health >= 60) return 4;
	if (health >= 40) return 3;
	if (health >= 20) return 2;
	return 1;
};
