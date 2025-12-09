import { useState, useCallback } from "react";
import confetti from "canvas-confetti";

export const useConfetti = () => {
	const [confettiLock, setConfettiLock] = useState(false);

	const playConfetti = useCallback((el: HTMLElement, onDone?: () => void) => {
		setConfettiLock(true);

		const rect = el.getBoundingClientRect();
		const origin = {
			x: (rect.left + rect.width / 2) / window.innerWidth,
			y: (rect.top + rect.height / 2) / window.innerHeight,
		};

		confetti({
			particleCount: 18,
			spread: 360,
			startVelocity: 22,
			scalar: 0.45,
			ticks: 38,
			decay: 0.78,
			origin,
			colors: ["#ffffff"],
			zIndex: 10000,
		});

		setTimeout(() => {
			setConfettiLock(false);
			onDone?.();
		}, 400);
	}, []);

	return { playConfetti, confettiLock };
};
