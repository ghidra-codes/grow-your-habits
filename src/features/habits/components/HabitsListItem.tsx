import type { AdherenceMap, Habit, HabitWithRelations } from "@/types/habit.types";
import AdherenceCircle from "@/ui/AdherenceCircle";
import Checkbox from "@/ui/Checkbox";
import { hasLoggedToday } from "@/utils/helpers/hasLoggedToday";
import confetti from "canvas-confetti";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MdDoneOutline } from "react-icons/md";
import { GoGoal } from "react-icons/go";
import { TbClockX } from "react-icons/tb";
import { FaCaretDown } from "react-icons/fa";

interface HabitsListItemProps {
	habits: HabitWithRelations[];
	onSelect: (habit: Habit) => void;
	selectedHabit: Habit | null;
	onToggleHabit: (habit: HabitWithRelations) => void;
	expandedIds: Set<string>;
	setExpandedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
	isMutating: boolean;
	adherenceMap: AdherenceMap;
}

const HabitsListItem: React.FC<HabitsListItemProps> = ({
	habits,
	onSelect,
	selectedHabit,
	onToggleHabit,
	expandedIds,
	setExpandedIds,
	isMutating,
	adherenceMap,
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

	const handleChecked = (habit: HabitWithRelations, isDone: boolean, checkboxEl: HTMLElement) => {
		if (!isDone) playConfetti(checkboxEl);

		onToggleHabit(habit);
	};

	const toggleExpand = (habitId: string) => {
		setExpandedIds((prev) => {
			const next = new Set(prev);

			if (next.has(habitId)) next.delete(habitId);
			else next.add(habitId);

			return next;
		});
	};

	return (
		<>
			{habits.map((habit) => {
				const isSelected = selectedHabit?.id === habit.id;
				const isExpanded = expandedIds.has(habit.id);
				const isDone = hasLoggedToday(habit);
				const disabled = isMutating || confettiLock;
				const { logCount, expected, missed, onTrack, percentage } = adherenceMap[habit.id] || {};

				return (
					<li
						key={habit.id}
						className={`habit-item ${isSelected ? "selected" : ""}`}
						onClick={(e) => {
							e.stopPropagation();
							onSelect(habit);
						}}
					>
						<div className="habit-item-content-wrapper">
							<div className="habit-item-content">
								<div
									className="item-circle-wrapper"
									onClick={(e) => {
										e.stopPropagation();
										toggleExpand(habit.id);
									}}
								>
									<FaCaretDown
										size={18}
										className={isExpanded ? "caret rotated" : "caret"}
									/>

									<AdherenceCircle
										percentage={percentage || 0}
										className="habit-item-circle"
									/>
								</div>

								<div className="habit-item-text">
									<strong>{habit.name}</strong>
									{habit.description && <p>{habit.description}</p>}
								</div>
							</div>

							<div className="checkbox-wrapper" onClick={(e) => e.stopPropagation()}>
								<Checkbox
									checked={isDone}
									disabled={disabled}
									onClick={(e) => {
										handleChecked(habit, isDone, e.currentTarget);
									}}
								/>
							</div>
						</div>
						<AnimatePresence mode="wait">
							{isExpanded && (
								<motion.div
									className="habit-item-info"
									initial={{ height: 0 }}
									animate={{ height: "auto" }}
									exit={{ height: 0 }}
									transition={{ duration: 0.3, ease: [0.42, 0.0, 0.2, 1] }}
									layout
								>
									{habit.description && (
										<p>
											<span>Description: </span>
											{habit.description}
										</p>
									)}

									<div className="divider-line"></div>

									<ul>
										<li>
											<MdDoneOutline size={22} className="done-icon" />
											<span>Done so far: </span>
											{logCount}
										</li>
										<li>
											<GoGoal size={22} className="goal-icon" />
											<span>Goal until today: </span>
											{expected}
										</li>
										<li>
											<TbClockX size={24} className="missed-icon" />
											<div className="offset">
												<span>Missed days: </span>
												{missed}
											</div>
										</li>
										<li>
											{onTrack
												? "You're on track. Nice work!"
												: "You're a bit behind. Keep going!"}
										</li>
									</ul>
								</motion.div>
							)}
						</AnimatePresence>
					</li>
				);
			})}
		</>
	);
};

export default HabitsListItem;
