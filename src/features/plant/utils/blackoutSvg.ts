export const blackoutSvg = (svg: string): string => {
	return svg
		.replace(/fill="[^"]*"/gi, `fill="rgba(0,0,0,0.85)"`)
		.replace(/fill-opacity="[^"]*"/gi, `fill-opacity="1"`);
};
