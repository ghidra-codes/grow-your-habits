import type { PlantHealth } from "@/types/plant.types";
import { motion } from "motion/react";

interface PlantHealthBarProps {
	health: PlantHealth;
}

const PlantHealthBar = ({ health }: PlantHealthBarProps) => {
	const segments = 10;
	const filled = Math.round((health / 100) * segments);

	const colors = [
		"#d9534f",
		"#e8703f",
		"#f08435",
		"#c1a46c",
		"#a4b17a",
		"#8db381",
		"#77b487",
		"#63aa7d",
		"#55966d",
		"#4e7956",
	];

	return (
		<div className="health-bar">
			{colors.map((color, i) => {
				const isFilled = i < filled;

				return (
					<motion.div
						key={i}
						className="segment"
						style={{
							backgroundColor: isFilled ? color : undefined,
						}}
						animate={{
							opacity: isFilled ? 1 : 0.4,
						}}
					/>
				);
			})}
		</div>
	);
};

export default PlantHealthBar;
