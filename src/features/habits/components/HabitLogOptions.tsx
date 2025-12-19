import { generateCurrentPeriod, getTodayDate } from "@/lib/dates";
import { hasLoggedToday } from "@/lib/habits";
import type { HabitWithLogs } from "@/types/habit.types";
import { useConfetti } from "@/ui/hooks/useConfetti";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import HabitDatePicker from "./HabitDatePicker";
import { onActivate } from "@/lib/a11y/keyboard";

const HabitLogOptions = ({
	habit,
	onToggleHabit,
}: {
	habit: HabitWithLogs;
	onToggleHabit: (habit: HabitWithLogs, date: string) => void;
}) => {
	const [selectionMode, setSelectionMode] = useState<"today" | "past" | null>(null);
	const [confirmUndoToday, setConfirmUndoToday] = useState(false);

	const { mode: periodMode, period } = generateCurrentPeriod(habit);
	const { playConfetti } = useConfetti();

	const completedToday = hasLoggedToday(habit);

	const handleOnSelectToday = (
		e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
	) => {
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
			<div className="log-options" role="radiogroup" aria-label="Log habit">
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

					<div
						className="radio-circle"
						onClick={handleOnSelectToday}
						role="radio"
						tabIndex={0}
						aria-describedby={confirmUndoToday ? "undo-hint" : undefined}
						aria-checked={completedToday || selectionMode === "today"}
						onKeyDown={(e) => onActivate(() => handleOnSelectToday(e))(e)}
					/>

					<span>
						{completedToday
							? confirmUndoToday
								? "Click to undo today"
								: "Today (completed)"
							: "Today"}
					</span>

					{confirmUndoToday && (
						<span id="undo-hint" className="sr-only" aria-live="polite">
							Click again to undo today's log
						</span>
					)}
				</div>

				{/* LOG PAST DATE */}
				<div className="radio-option">
					<input
						type="radio"
						name={`log-option-${habit.id}`}
						checked={selectionMode === "past"}
						readOnly
					/>

					<div
						className="radio-circle"
						role="radio"
						tabIndex={0}
						aria-checked={selectionMode === "past"}
						onClick={() => setSelectionMode("past")}
						onKeyDown={onActivate(() => setSelectionMode("past"))}
					/>
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
