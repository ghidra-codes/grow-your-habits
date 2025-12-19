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
		<motion.div
			className="plant-particles"
			initial={{ opacity: 0 }}
			animate={{ opacity: fadeIn ? 1 : 0 }}
			transition={{ duration: 1.6, ease: "easeOut" }}
			aria-hidden="true"
		>
			{particles.map((particle, i) => (
				<motion.div
					key={i}
					className="plant-particle"
					initial={false}
					animate={{
						top: [`${particle.start}%`, `${particle.end}%`],
						opacity: [0, 0.5, 0],
					}}
					transition={{
						duration: particle.duration,
						delay: particle.delay,
						repeat: Infinity,
						ease: "linear",
					}}
					style={{
						left: `${particle.left}%`,
						width: particle.size,
						height: particle.size,
						top: `${particle.start}%`,
					}}
				/>
			))}
		</motion.div>
	);
};

export default FloatingParticles;
