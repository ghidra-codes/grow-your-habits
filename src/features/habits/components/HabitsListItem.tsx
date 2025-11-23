import type { Habit } from "@/types/habit.types";
import type React from "react";
import Checkbox from "@/ui/Checkbox";

interface HabitsListItemProps {
	habits: Habit[];
	onSelect: (habit: Habit) => void;
	selectedHabit: Habit | null;
}

const HabitsListItem: React.FC<HabitsListItemProps> = ({ habits, onSelect, selectedHabit }) => (
	<>
		{habits.map((habit) => {
			const isSelected = selectedHabit?.id === habit.id;

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
						<Checkbox />
					</div>
				</li>
			);
		})}
	</>
);
export default HabitsListItem;
