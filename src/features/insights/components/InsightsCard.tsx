import { onActivate } from "@/lib/a11y/keyboard";
import type { Insight } from "@/types/insight.types";
import Tooltip from "@/ui/tooltip/Tooltip";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const InsightCard = ({
	insight,
	index,
	onClick,
	isLocked,
}: {
	insight: Insight;
	index: number;
	onClick: () => void;
	isLocked: boolean;
}) => {
	const [isAnimating, setIsAnimating] = useState(false);
	const [hasEntered, setHasEntered] = useState(false);

	const isTopCard = index === 0;
	const isDisabled = !isTopCard || isAnimating || isLocked;

	const handleClick = () => {
		if (isDisabled) return;

		setIsAnimating(true);

		setTimeout(() => {
			setIsAnimating(false);
			onClick();
		}, 400);
	};

	useEffect(() => {
		const timer = setTimeout(() => setHasEntered(true), 300);
		return () => clearTimeout(timer);
	}, []);

	const depthOpacity = 0.22 - index * 0.03;
	const restingShadow = `0 5px 8px rgba(0,0,0,${depthOpacity})`;

	return (
		<motion.li
			role="button"
			layout={false}
			className="insights-card"
			aria-disabled={isDisabled}
			onClick={index === 0 ? handleClick : undefined}
			initial={{ y: 0 }}
			animate={{
				y: isAnimating ? 175 : hasEntered ? index * -12 : 0,
				rotate: isAnimating ? -2 : 0,
				boxShadow: !hasEntered
					? isTopCard
						? restingShadow
						: "none"
					: isAnimating
					? "0 12px 16px rgba(0,0,0,0.28)"
					: restingShadow,
			}}
			transition={{
				y: {
					duration: isAnimating ? 0.35 : 0.4,
					ease: "easeOut",
				},
				rotate: { duration: 0.35 },
				boxShadow: { duration: 0.3 },
			}}
			whileTap={!isDisabled ? { y: 5, rotate: -0.5 } : undefined}
			tabIndex={!isDisabled ? 0 : -1}
			style={{ zIndex: 100 - index }}
			onKeyDown={isDisabled ? undefined : onActivate(handleClick)}
		>
			<div className="insights-icon-anchor">
				<Tooltip id={`insight-${insight.id}`} content={insight.description} side="top" />
			</div>

			<h3>{insight.title}</h3>
			<p>{insight.message}</p>
		</motion.li>
	);
};

export default InsightCard;
