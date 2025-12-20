import { motion } from "motion/react";
import { useState } from "react";

const PARTICLE_COUNT = 10;
const CONTAINER_HEIGHT = 500;
const EARLY_BIAS = 3;
const START_DELAY = 5;

const FloatingParticles = () => {
	const [particles] = useState(() =>
		Array.from({ length: PARTICLE_COUNT }).map(() => {
			const duration = 25 + Math.random() * 20;

			const startY = CONTAINER_HEIGHT * (1.2 + Math.random() * 0.1);
			const endY = CONTAINER_HEIGHT * (-0.2 - Math.random() * 0.1);

			const progress = Math.random() ** EARLY_BIAS;
			const initialY = startY + (endY - startY) * progress;

			return {
				left: Math.random() * 100,
				size: 2 + Math.random() * 3,
				initialY,
				endY,
				duration,
				repeatDelay: Math.random() * 6,
			};
		})
	);

	return (
		<div className="plant-particles" aria-hidden="true">
			{particles.map((p, i) => (
				<motion.div
					key={i}
					className="plant-particle"
					initial={{ y: p.initialY, opacity: 0 }}
					animate={{ y: p.endY, opacity: [0, 0.5, 0] }}
					transition={{
						duration: p.duration,
						delay: START_DELAY,
						repeat: Infinity,
						repeatDelay: p.repeatDelay,
						ease: "linear",
					}}
					style={{
						left: `${p.left}%`,
						width: p.size,
						height: p.size,
					}}
				/>
			))}
		</div>
	);
};

export default FloatingParticles;
