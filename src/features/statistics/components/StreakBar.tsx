import React from "react";
import { PiFireSimpleDuotone } from "react-icons/pi";

interface StreakBarProps {
	streak: number;
	maxSegments?: number;
}

const StreakBar: React.FC<StreakBarProps> = ({ streak, maxSegments = 12 }) => {
	const segments = Math.min(streak, maxSegments);

	return (
		<div className={`streakbar glow-${segments}`}>
			<div className="streakbar__segments">
				{Array.from({ length: maxSegments }).map((_, i) => {
					const isActive = i < segments;

					return (
						<PiFireSimpleDuotone
							key={i}
							className={`streakbar__segment ${isActive ? "active" : ""}`}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default StreakBar;
