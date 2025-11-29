import React from "react";
import { TbFlame } from "react-icons/tb";

interface StreakBarProps {
	streak: number;
	maxSegments?: number;
}

const StreakBar: React.FC<StreakBarProps> = ({ streak, maxSegments = 12 }) => {
	const segments = Math.min(streak, maxSegments);
	console.log(streak);

	return (
		<div className={`streakbar glow-${segments}`}>
			<div className="streakbar__segments">
				{Array.from({ length: maxSegments }).map((_, i) => {
					const isActive = i < segments;

					return <TbFlame key={i} className={`streakbar__segment ${isActive ? "active" : ""}`} />;
				})}
			</div>
		</div>
	);
};

export default StreakBar;
