import { motion } from "motion/react";
import { useEffect, useState } from "react";

const FloatingParticles = () => {
	const [fadeIn, setFadeIn] = useState(false);

	const [particles] = useState(() =>
		Array.from({ length: 8 }).map(() => {
			const start = 120 + Math.random() * 10;
			const end = -20 - Math.random() * 10;
			const duration = 25 + Math.random() * 20;
			const offset = Math.random();

			return {
				left: Math.random() * 100,
				size: 2 + Math.random() * 3,
				start,
				end,
				duration,
				delay: -duration * offset,
			};
		})
	);

	useEffect(() => {
		const timer = setTimeout(() => setFadeIn(true), 5000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div
			className="plant-particles"
			style={{
				position: "absolute",
				inset: 0,
				zIndex: 9999,
				background: "rgba(255, 0, 0, 0.1)", // DEBUG
			}}
		>
			<div
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					width: 8,
					height: 8,
					background: "red",
					transform: "translate(-50%, -50%)",
				}}
			/>
		</div>
	);
};

export default FloatingParticles;
