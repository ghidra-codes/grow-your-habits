import { GoGoal } from "react-icons/go";
import { MdDoneOutline } from "react-icons/md";
import { TbClockX } from "react-icons/tb";
import { motion } from "motion/react";
import type { HabitAdherence, HabitWithLogs } from "@/types/habit.types";
import type React from "react";

interface HabitInfoDrawerProps {
	habit: HabitWithLogs;
	habitAdherence: HabitAdherence;
}

const HabitInfoDrawer: React.FC<HabitInfoDrawerProps> = ({ habit, habitAdherence }) => {
	const { logCount, expected, missed, period } = habitAdherence;

	return (
		<motion.div
			role="region"
			aria-label={`${habit.name} information`}
			className="habit-info-drawer"
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
					<MdDoneOutline size={22} className="done-icon" aria-hidden />
					<span>Done so far: </span>
					{logCount}
				</li>
				<li>
					<GoGoal size={22} className="goal-icon" aria-hidden />
					<span>Goal until today: </span>
					{expected}
				</li>
				<li>
					<TbClockX size={24} className="missed-icon" aria-hidden />
					<div className="offset">
						<span>Missed {period}s: </span> {missed}
					</div>
				</li>
			</ul>
		</motion.div>
	);
};

export default HabitInfoDrawer;
