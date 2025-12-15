import type { Habit } from "@/types/habit.types";
import Tooltip from "@/ui/Tooltip";
import { FaRegEdit, FaRegPlusSquare, FaRegTrashAlt } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa6";

interface HabitsControlPanelProps {
	selectedHabit: Habit | null;
	onAdd: () => void;
	onEdit: () => void;
	onDelete: () => void;
	onOpenStats: () => void;
}

const HabitsControlPanel = ({
	selectedHabit,
	onAdd,
	onEdit,
	onDelete,
	onOpenStats,
}: HabitsControlPanelProps) => (
	<div className="habits-control-panel" onClick={(e) => e.stopPropagation()}>
		{!selectedHabit && (
			<div className="no-habit-selected-actions">
				<div className="control-action">
					<span className="control-label">ADD</span>
					<button className="add-habit-btn" onClick={onAdd}>
						<span className="icon-slot">
							<FaRegPlusSquare size={26} />
						</span>
					</button>
				</div>

				<span className="icon-slot">
					<Tooltip
						content="Click on a habit to edit, delete, or view statistics about it."
						side="left"
						iconSize={24}
					/>
				</span>
			</div>
		)}

		{selectedHabit && (
			<div className="habit-selected-actions">
				<div className="control-action">
					<span className="control-label">DELETE</span>
					<button className="delete-habit-btn" onClick={onDelete}>
						<span className="icon-slot">
							<FaRegTrashAlt size={25} />
						</span>
					</button>
				</div>

				<div className="control-action">
					<span className="control-label">EDIT</span>
					<button className="edit-habit-btn" onClick={onEdit}>
						<span className="icon-slot">
							<FaRegEdit size={28} />
						</span>
					</button>
				</div>

				<div className="control-action">
					<span className="control-label">STATS</span>
					<button className="stats-habit-btn" onClick={onOpenStats}>
						<span className="icon-slot">
							<FaChartLine size={26} />
						</span>
					</button>
				</div>
			</div>
		)}
	</div>
);

export default HabitsControlPanel;
