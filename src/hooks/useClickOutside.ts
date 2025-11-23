import { useEffect } from "react";

type Selector = string | HTMLElement | null;
type SelectorList = Selector[];

/**
 * Triggers a callback when the user clicks anywhere outside the given element(s).
 * Accepts CSS selectors, refs, HTMLElements, or arrays of them.
 */
export const useClickOutside = (targets: Selector | SelectorList, onOutsideClick: () => void) => {
	useEffect(() => {
		const targetList = Array.isArray(targets) ? targets : [targets];

		const isInsideTarget = (el: HTMLElement) => {
			return targetList.some((target) => {
				if (!target) return false;

				// CSS Selector
				if (typeof target === "string") return el.closest(target) !== null;

				// HTMLElement
				const node = target instanceof HTMLElement ? target : null;
				return node && (el === node || node.contains(el));
			});
		};

		const handleClick = (e: MouseEvent) => {
			const clickedEl = e.target as HTMLElement;
			if (isInsideTarget(clickedEl)) return;

			onOutsideClick();
		};

		document.addEventListener("click", handleClick);
		return () => document.removeEventListener("click", handleClick);
	}, [targets, onOutsideClick]);
};
