import type { AdherenceMap, Habit, HabitWithRelations } from "@/types/habit.types";
import AdherenceCircle from "@/ui/AdherenceCircle";
import Checkbox from "@/ui/Checkbox";
import { hasLoggedToday } from "@/utils/helpers/hasLoggedToday";
import confetti from "canvas-confetti";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface HabitsListItemProps {
	habits: HabitWithRelations[];
	onSelect: (habit: Habit) => void;
	selectedHabit: Habit | null;
	onToggleHabit: (habit: HabitWithRelations) => void;
	isMutating: boolean;
	adherenceMap: AdherenceMap;
}

const HabitsListItem: React.FC<HabitsListItemProps> = ({
	habits,
	onSelect,
	selectedHabit,
	onToggleHabit,
	isMutating,
	adherenceMap,
}) => {
	const [confettiLock, setConfettiLock] = useState(false);
	const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
	const checkboxRef = useRef<HTMLButtonElement>(null);

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
							<div
								className="habit-item-content"
								onClick={(e) => {
									e.stopPropagation();
									toggleExpand(habit.id);
								}}
							>
								<AdherenceCircle
									percentage={adherenceMap[habit.id].percentage || 0}
									className="habit-item-circle"
								/>

								<div className="habit-item-text">
									<strong>{habit.name}</strong>
									{habit.description && <p>{habit.description}</p>}
								</div>
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
						</div>
						<AnimatePresence mode="wait">
							{isExpanded && (
								<motion.div
									className="habit-item-info"
									initial={{ height: 0 }}
									animate={{ height: "auto" }}
									exit={{ height: 0 }}
									transition={{ duration: 0.3 }}
								>
									{habit.description && <p>{habit.description}</p>}

									<ul>
										<li>Completed: {adherenceMap[habit.id]?.logCount}</li>
										<li>Expected: {adherenceMap[habit.id]?.expected}</li>
										<li>Missed: {adherenceMap[habit.id]?.missed}</li>
										<li>{adherenceMap[habit.id]?.onTrack ? "On Track" : "Behind"}</li>
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
