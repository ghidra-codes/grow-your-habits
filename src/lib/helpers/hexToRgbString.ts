export const hexToRgbString = (hex: string): string => {
	const stripped = hex.replace("#", "");
	const bigint = parseInt(stripped, 16);

	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;

	return `rgb(${r}, ${g}, ${b})`;
};
