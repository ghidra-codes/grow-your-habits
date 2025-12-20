import type { PlantHealth } from "@/types/plant.types";
import { useMemo } from "react";

interface PlantHealthBarProps {
	health: PlantHealth;
}

const SEGMENTS = 10;

const PlantHealthBar = ({ health }: PlantHealthBarProps) => {
	const filled = useMemo(() => Math.round((health / 100) * SEGMENTS), [health]);

	return (
		<div className="health-bar" aria-hidden="true">
			{Array.from({ length: SEGMENTS }).map((_, i) => {
				const isFilled = i < filled;

				return <div key={i} className={`segment segment-${i} ${isFilled ? "filled" : ""}`} />;
			})}
		</div>
	);
};

export default PlantHealthBar;
