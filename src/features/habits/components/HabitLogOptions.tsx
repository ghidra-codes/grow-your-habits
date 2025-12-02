import { useConfetti } from "@/hooks/useConfetti";
import type { HabitWithRelations } from "@/types/habit.types";
import { generateCurrentPeriod } from "@/utils/date-picker/generateCurrentPeriod";
import getTodayDate from "@/utils/helpers/getTodayDate";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import HabitDatePicker from "./HabitDatePicker";
import { hasLoggedToday } from "@/utils/helpers/hasLoggedToday";

const HabitLogOptions = ({
	habit,
	onToggleHabit,
}: {
	habit: HabitWithRelations;
	onToggleHabit: (habit: HabitWithRelations, date: string) => void;
}) => {
	const [selectionMode, setSelectionMode] = useState<"today" | "past" | null>(null);
	const [confirmUndoToday, setConfirmUndoToday] = useState(false);

	const { mode: periodMode, period } = generateCurrentPeriod(habit);
	const { playConfetti } = useConfetti();

	const completedToday = hasLoggedToday(habit);

	const handleOnSelectToday = (e: React.MouseEvent<HTMLDivElement>) => {
		setSelectionMode("today");

		if (completedToday) {
			if (!confirmUndoToday) {
				setConfirmUndoToday(true);
				return;
			}

			onToggleHabit(habit, getTodayDate());
			setConfirmUndoToday(false);
			setSelectionMode(null);
			return;
		}

		playConfetti(e.currentTarget as HTMLElement, () => {
			onToggleHabit(habit, getTodayDate());
			setSelectionMode(null);
		});
	};

	const handleOnSelectDate = (
		entryDate: string,
		completed: boolean,
		e: React.MouseEvent<HTMLDivElement>
	) => {
		if (completed) {
			onToggleHabit(habit, entryDate);
			setSelectionMode(null);
			return;
		}

		playConfetti(e.currentTarget, () => {
			onToggleHabit(habit, entryDate);
			setSelectionMode(null);
		});
	};

	return (
		<div className="habit-log-options">
			<div className="log-options">
				{/* LOG TODAY */}
				<div
					className={`radio-option ${completedToday ? "completed" : ""} ${
						confirmUndoToday ? "undo" : ""
					}`}
				>
					<input
						type="radio"
						name={`log-option-${habit.id}`}
						checked={completedToday || selectionMode === "today"}
						readOnly
					/>

					<div className="radio-circle" onClick={handleOnSelectToday}></div>
					<span>
						{completedToday
							? confirmUndoToday
								? "Click to undo today"
								: "Today (completed)"
							: "Today"}
					</span>
				</div>

				{/* LOG PAST DATE */}
				<div className="radio-option">
					<input
						type="radio"
						name={`log-option-${habit.id}`}
						checked={selectionMode === "past"}
						readOnly
					/>

					<div className="radio-circle" onClick={() => setSelectionMode("past")}></div>
					<span>Past date</span>
				</div>
			</div>

			{/* DATE PICKER */}
			<AnimatePresence>
				{selectionMode === "past" && (
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
							mode={periodMode}
							onSelectDate={handleOnSelectDate}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default HabitLogOptions;
