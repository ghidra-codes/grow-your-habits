import type { Habit, HabitWithLogs } from "@/types/habit.types";
import Checkbox from "@/ui/Checkbox";
import { hasLoggedToday } from "@/utils/helpers/hasLoggedToday";
import confetti from "canvas-confetti";
import { useRef, useState } from "react";

interface HabitsListItemProps {
	habits: HabitWithLogs[];
	onSelect: (habit: Habit) => void;
	selectedHabit: Habit | null;
	onToggleHabit: (habit: HabitWithLogs) => void;
	isMutating: boolean;
}

const HabitsListItem: React.FC<HabitsListItemProps> = ({
	habits,
	onSelect,
	selectedHabit,
	onToggleHabit,
	isMutating,
}) => {
	const [confettiLock, setConfettiLock] = useState(false);

	const playConfetti = (checkboxEl: HTMLElement) => {
		setConfettiLock(true);

		const rect = checkboxEl.getBoundingClientRect();
		const origin = {
			x: (rect.left + rect.width / 2) / window.innerWidth,
			y: (rect.top + rect.height / 2) / window.innerHeight,
		};

		confetti({
			particleCount: 18,
			spread: 360,
			startVelocity: 22,
			scalar: 0.45,
			ticks: 38,
			decay: 0.78,
			origin,
			colors: ["#ffffff"],
		});

		setTimeout(() => setConfettiLock(false), 400);
	};

	const handleChecked = (habit: HabitWithLogs, isDone: boolean, checkboxEl: HTMLElement) => {
		if (!isDone) playConfetti(checkboxEl);

		onToggleHabit(habit);
	};

	return (
		<>
			{habits.map((habit) => {
				const isSelected = selectedHabit?.id === habit.id;
				const isDone = hasLoggedToday(habit);
				const disabled = isMutating || confettiLock;

				const checkboxRef = useRef<HTMLButtonElement>(null);

				return (
					<li
						key={habit.id}
						className={`habit-item ${isSelected ? "selected" : ""}`}
						onClick={(e) => {
							e.stopPropagation();
							onSelect(habit);
						}}
					>
						<div className="habit-item-content">
							<strong>{habit.name}</strong>
							{habit.description && <p>{habit.description}</p>}
						</div>

						<div className="checkbox-wrapper" onClick={(e) => e.stopPropagation()}>
							<Checkbox
								ref={checkboxRef}
								checked={isDone}
								disabled={disabled}
								onCheckedChange={() => {
									if (!checkboxRef.current) return;

									handleChecked(habit, isDone, checkboxRef.current);
								}}
							/>
						</div>
					</li>
				);
			})}
		</>
	);
};

export default HabitsListItem;
