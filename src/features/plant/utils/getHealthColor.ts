export const getHealthColor = (health: number): string => {
	const clamped = Math.max(0, Math.min(100, health));

	const red = Math.round(220 - (clamped / 100) * 120);
	const green = Math.round(80 + (clamped / 100) * 140);
	const blue = 80;

	return `rgb(${red}, ${green}, ${blue})`;
};
