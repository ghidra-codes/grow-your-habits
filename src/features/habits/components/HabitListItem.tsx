import type { AdherenceMap, Habit, HabitWithRelations } from "@/types/habit.types";
import AdherenceCircle from "@/ui/AdherenceCircle";
import Checkbox from "@/ui/Checkbox";
import getTodayDate from "@/utils/helpers/getTodayDate";
import { hasLoggedToday } from "@/utils/helpers/hasLoggedToday";
import { AnimatePresence } from "motion/react";
import { FaCaretDown } from "react-icons/fa";
import HabitInfoDrawer from "./HabitInfoDrawer";
import { useConfetti } from "@/hooks/useConfetti";

interface HabitListItemProps {
	habits: HabitWithRelations[];
	onSelect: (habit: Habit | null) => void;
	selectedHabit: Habit | null;
	onToggleHabit: (habit: HabitWithRelations, date: string) => void;
	expandedIds: Set<string>;
	setExpandedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
	isMutating: boolean;
	adherenceMap: AdherenceMap;
	onOpenLogModal: (habit: HabitWithRelations) => void;
}

const HabitListItem: React.FC<HabitListItemProps> = ({
	habits,
	onSelect,
	selectedHabit,
	onToggleHabit,
	expandedIds,
	setExpandedIds,
	isMutating,
	adherenceMap,
	onOpenLogModal,
}) => {
	const { playConfetti, confettiLock } = useConfetti();

	// HANDLERS
	const handleChecked = (habit: HabitWithRelations, isDoneDaily: boolean, checkboxEl: HTMLElement) => {
		if (habit.frequency_type === "daily") {
			if (!isDoneDaily) playConfetti(checkboxEl);

			onToggleHabit(habit, getTodayDate());
			return;
		}

		onOpenLogModal(habit);
		onSelect(null);
	};

	const handleToggleExpand = (habitId: string) => {
		setExpandedIds((prev) => {
			const next = new Set(prev);

			if (next.has(habitId)) next.delete(habitId);
			else next.add(habitId);

			return next;
		});

		if (selectedHabit && selectedHabit.id !== habitId) onSelect(null);
	};

	return (
		<>
			{habits.map((habit) => {
				const isSelected = selectedHabit?.id === habit.id;
				const isExpanded = expandedIds.has(habit.id);
				const isDoneDaily = habit.frequency_type === "daily" ? hasLoggedToday(habit) : false;
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
						{/* HEADER ROW */}
						<div className="habit-item-content-wrapper">
							<div className="habit-item-content">
								<div
									className="item-circle-wrapper"
									onClick={(e) => {
										e.stopPropagation();
										handleToggleExpand(habit.id);
									}}
								>
									<FaCaretDown
										size={18}
										className={isExpanded ? "caret rotated" : "caret"}
									/>
									<AdherenceCircle percentage={adherenceMap[habit.id].percentage || 0} />
								</div>

								<div className="habit-item-text">
									<strong>{habit.name}</strong>
									{habit.description && <p>{habit.description}</p>}
								</div>
							</div>

							<div className="checkbox-wrapper" onClick={(e) => e.stopPropagation()}>
								<Checkbox
									checked={isDoneDaily}
									disabled={disabled}
									onClick={(e) => handleChecked(habit, isDoneDaily, e.currentTarget)}
								/>
							</div>
						</div>

						{/* EXPANDED INFO PANEL */}
						<AnimatePresence mode="wait">
							{isExpanded && (
								<HabitInfoDrawer habit={habit} habitAdherence={adherenceMap[habit.id]} />
							)}
						</AnimatePresence>
					</li>
				);
			})}
		</>
	);
};

export default HabitListItem;
