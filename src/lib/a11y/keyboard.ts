export const onActivate = (handler: () => void) => (e: React.KeyboardEvent) => {
	if (e.key === "Enter" || e.key === " ") {
		e.preventDefault();
		handler();
	}
};
