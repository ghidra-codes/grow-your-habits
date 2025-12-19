import type { Habit } from "@/types/habit.types";
import Tooltip from "@/ui/tooltip/Tooltip";
import { FaRegEdit, FaRegPlusSquare, FaRegTrashAlt } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa6";
import { AnimatePresence, motion } from "motion/react";
import { PiArrowFatDownFill } from "react-icons/pi";
import { useState } from "react";
import { useStatsAndInsightsAccess } from "@/features/plant/hooks/derived/useStatsAndInsightsAccess";

interface HabitsControlPanelProps {
	selectedHabit: Habit | null;
	hasHabits: boolean;
	onAdd: () => void;
	onEdit: () => void;
	onDelete: () => void;
	onOpenStats: () => void;
}

const HabitsControlPanel = ({
	selectedHabit,
	hasHabits,
	onAdd,
	onEdit,
	onDelete,
	onOpenStats,
}: HabitsControlPanelProps) => {
	const { hasAccess } = useStatsAndInsightsAccess();
	const [showAddHint, setShowAddHint] = useState(true);

	return (
		<div className="habits-control-panel" onClick={(e) => e.stopPropagation()}>
			{!selectedHabit && (
				<div className="no-habit-selected-actions">
					<div className="control-action">
						<span className="control-label">ADD</span>
						<button className="add-habit-btn" onClick={onAdd} aria-label="Add new habit">
							<span className="icon-slot">
								<FaRegPlusSquare size={26} />
							</span>
						</button>

						<AnimatePresence>
							{!hasHabits && showAddHint && (
								<motion.div
									key="add-habit-hint"
									className="add-habit-hint"
									initial={{ opacity: 0, y: -6 }}
									animate={{
										opacity: 1,
										y: [-6, 3, -1],
									}}
									exit={{ opacity: 0, y: -4 }}
									transition={{
										duration: 0.8,
										ease: [0.22, 1, 0.36, 1],
									}}
									onAnimationComplete={() => setTimeout(() => setShowAddHint(false), 300)}
								>
									<PiArrowFatDownFill size={16} />
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{hasHabits && (
						<span className="icon-slot">
							<Tooltip
								id="habit-selection-hint"
								content="Click on a habit to edit, delete, or view statistics about it."
								side="left"
								iconSize={24}
							/>
						</span>
					)}
				</div>
			)}

			{selectedHabit && (
				<div className="habit-selected-actions">
					<div className="control-action">
						<span className="control-label">DELETE</span>
						<button
							className="delete-habit-btn"
							onClick={onDelete}
							aria-label="Delete selected habit"
						>
							<span className="icon-slot">
								<FaRegTrashAlt size={25} />
							</span>
						</button>
					</div>

					<div className="control-action">
						<span className="control-label">EDIT</span>
						<button className="edit-habit-btn" onClick={onEdit} aria-label="Edit selected habit">
							<span className="icon-slot">
								<FaRegEdit size={28} />
							</span>
						</button>
					</div>

					<div className="control-action">
						<span className="control-label">STATS</span>
						<button
							className="stats-habit-btn"
							onClick={onOpenStats}
							aria-label="View habit statistics"
							disabled={!hasAccess}
						>
							<span className="icon-slot">
								<FaChartLine size={26} />
							</span>
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default HabitsControlPanel;
