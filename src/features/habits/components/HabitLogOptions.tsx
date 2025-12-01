import type { HabitWithRelations } from "@/types/habit.types";
import { generateCurrentPeriod } from "@/utils/date-picker/generateCurrentPeriod";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import HabitDatePicker from "./HabitDatePicker";

const DEFAULT_LOGUI = {
	habitId: null as string | null,
	mode: null as "today" | "past" | null,
	date: "",
};

const HabitLogOptions = ({
	habit,
	onToggleHabit,
}: {
	habit: HabitWithRelations;
	onToggleHabit: (habit: HabitWithRelations, date: string) => void;
}) => {
	const [logUI, setLogUI] = useState(DEFAULT_LOGUI);
	const { mode, period } = generateCurrentPeriod(habit);

	return (
		<>
			<p className="drawer-title">When would you like to log this habit?</p>

			<div className="log-options">
				{/* LOG TODAY */}
				<div
					className="radio-option"
					onClick={() => setLogUI({ habitId: habit.id, mode: "today", date: "" })}
				>
					<input
						type="radio"
						name={`log-option-${habit.id}`}
						checked={logUI.mode === "today"}
						readOnly
					/>
					<div className="radio-circle"></div>
					<span>Today</span>
				</div>

				{/* LOG PAST DATE */}
				<div
					className="radio-option"
					onClick={() => setLogUI({ habitId: habit.id, mode: "past", date: "" })}
				>
					<input
						type="radio"
						name={`log-option-${habit.id}`}
						checked={logUI.mode === "past"}
						readOnly
					/>
					<div className="radio-circle"></div>
					<span>Past date</span>
				</div>
			</div>

			{/* DATE PICKER */}
			<AnimatePresence>
				{logUI.mode === "past" && (
					<motion.div
						className="date-picker-container"
						initial={{ height: 0 }}
						animate={{ height: "auto" }}
						exit={{ height: 0 }}
						transition={{ duration: 0.25, ease: [0.42, 0.0, 0.2, 1] }}
						layout
					>
						<HabitDatePicker
							period={period}
							mode={mode}
							onSelectDate={(entry) => {
								onToggleHabit(habit, entry.date);
								setLogUI(DEFAULT_LOGUI);
							}}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default HabitLogOptions;
