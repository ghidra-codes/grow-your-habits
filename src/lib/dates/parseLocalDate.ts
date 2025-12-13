export const parseLocalDate = (yyyyMMdd: string) => {
	const [y, m, d] = yyyyMMdd.split("-").map(Number);

	return new Date(y, m - 1, d);
};
