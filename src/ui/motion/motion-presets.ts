import type { Transition } from "motion/react";

export const tapSpring: { whileTap: { scale: number }; transition: Transition } = {
	whileTap: { scale: 0.96 },
	transition: { type: "spring", stiffness: 300, damping: 20 },
};
