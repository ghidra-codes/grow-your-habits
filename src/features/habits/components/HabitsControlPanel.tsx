import type { Habit } from "@/types/habit.types";
import { FaRegEdit, FaRegPlusSquare, FaRegTrashAlt } from "react-icons/fa";

interface HabitsControlPanelProps {
	selectedHabit: Habit | null;
	onAdd: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

const HabitsControlPanel = ({ selectedHabit, onAdd, onEdit, onDelete }: HabitsControlPanelProps) => (
	<div className="habits-control-panel" onClick={(e) => e.stopPropagation()}>
		{!selectedHabit && (
			<button className="add-habit-btn" onClick={onAdd}>
				<FaRegPlusSquare size={26} />
			</button>
		)}

		{selectedHabit && (
			<>
				<button className="delete-habit-btn" onClick={onDelete}>
					<FaRegTrashAlt size={25} />
				</button>
				<button className="edit-habit-btn" onClick={onEdit}>
					<FaRegEdit size={27} />
				</button>
			</>
		)}
	</div>
);

export default HabitsControlPanel;
