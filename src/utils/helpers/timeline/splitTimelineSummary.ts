export const splitTimelineSummary = <T>(entries: T[], size: number): (T | null)[][] => {
	const chunks: (T | null)[][] = [];

	for (let i = 0; i < entries.length; i += size) {
		const slice: (T | null)[] = entries.slice(i, i + size);

		while (slice.length < size) {
			slice.push(null);
		}

		chunks.push(slice);
	}

	return chunks;
};
