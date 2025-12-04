export const makeTimelineSummaryCells = (completed: number, target: number): { status: string }[] => {
	const cells: { status: string }[] = [];

	// Completed weeks
	for (let i = 0; i < completed; i++) {
		cells.push({ status: "completed" });
	}

	// Remaining target weeks
	for (let i = completed; i < target; i++) {
		cells.push({ status: "pending" });
	}

	// Pad to exactly 7 cells
	while (cells.length < 7) {
		cells.push({ status: "placeholder" });
	}

	return cells;
};
