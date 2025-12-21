import { onActivate } from "@/lib/a11y/keyboard";
import type { Insight } from "@/types/insight.types";
import Tooltip from "@/ui/tooltip/Tooltip";
import { animate, motion, useMotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";

// CONFIG
const DRAG_TRIGGER_Y = 60;
const SNAP_BACK_DURATION = 0.18;
const ANIMATION_DURATION = 400;
const ENTER_DELAY = 300;

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
	const [isDragging, setIsDragging] = useState(false);
	const [hasEntered, setHasEntered] = useState(false);

	const y = useMotionValue(0);

	const didDrag = useRef(false);

	const isTopCard = index === 0;
	const isDisabled = !isTopCard || isAnimating || isLocked;

	const activate = () => {
		if (isDisabled) return;

		setIsAnimating(true);

		setTimeout(() => {
			setIsAnimating(false);
			onClick();
		}, ANIMATION_DURATION);
	};

	useEffect(() => {
		const timer = setTimeout(() => setHasEntered(true), ENTER_DELAY);
		return () => clearTimeout(timer);
	}, []);

	// STYLES
	const depthOpacity = 0.22 - index * 0.03;
	const restingShadow = `0 5px 8px rgba(0,0,0,${depthOpacity})`;

	return (
		<motion.li
			role="button"
			layout={false}
			className="insights-card"
			aria-disabled={isDisabled}
			style={{
				zIndex: isDragging ? 999 : 100 - index,
				y,
			}}
			onClick={() => {
				if (didDrag.current || !isTopCard) return;
				activate();
			}}
			drag={isTopCard && !isLocked ? "y" : false}
			dragConstraints={{ top: 0, bottom: 140 }}
			dragElastic={0.15}
			dragMomentum={false}
			onDragStart={() => {
				didDrag.current = true;
				setIsDragging(true);
			}}
			onDragEnd={(_, info) => {
				const triggered = info.offset.y > DRAG_TRIGGER_Y;

				setIsDragging(false);

				if (triggered) {
					activate();
				} else {
					animate(y, 0, {
						duration: SNAP_BACK_DURATION,
						ease: "easeOut",
					});
				}

				setTimeout(() => {
					didDrag.current = false;
				}, 0);
			}}
			tabIndex={!isDisabled ? 0 : -1}
			onKeyDown={isDisabled ? undefined : onActivate(activate)}
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
