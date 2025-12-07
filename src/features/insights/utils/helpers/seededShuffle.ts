export const seededShuffle = <T>(items: T[], seed: number): T[] => {
	let m = items.length;
	const result = [...items];

	const random = () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	while (m > 0) {
		const i = Math.floor(random() * m--);
		[result[m], result[i]] = [result[i], result[m]];
	}

	return result;
};
