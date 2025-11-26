import type React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface AdherenceCircleProps {
	percentage: number;
	textSize?: string;
	className?: string;
}

const AdherenceCircle: React.FC<AdherenceCircleProps> = ({ percentage, textSize = "22px", className }) => {
	return (
		<div className={`adherence-circle ${className}`}>
			<CircularProgressbar
				value={percentage}
				text={`${Math.round(percentage)}%`}
				styles={buildStyles({
					pathColor: "#6da978",
					trailColor: "#062b3a",
					textColor: "#f3f8f4",
					strokeLinecap: "round",
					textSize,
				})}
			/>
		</div>
	);
};

export default AdherenceCircle;
