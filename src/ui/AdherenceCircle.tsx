import type React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface AdherenceCircleProps {
	percentage: number;
}

const AdherenceCircle: React.FC<AdherenceCircleProps> = ({ percentage }) => {
	return (
		<div className="adherence-circle">
			<CircularProgressbar
				value={percentage}
				text={`${Math.round(percentage)}%`}
				styles={buildStyles({
					pathColor: "#6da978",
					trailColor: "#062b3a",
					textColor: "#f3f8f4",
					strokeLinecap: "round",
					textSize: "24px",
				})}
			/>
		</div>
	);
};

export default AdherenceCircle;
