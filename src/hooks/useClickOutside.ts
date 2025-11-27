import { useEffect } from "react";

type Target = string | React.RefObject<HTMLElement | null>;

export function useClickOutside(targets: Target | Target[], onOutsideClick: () => void) {
	useEffect(() => {
		const list = Array.isArray(targets) ? targets : [targets];

		const resolve = (target: Target): HTMLElement | null => {
			if (!target) return null;

			// React ref
			if (typeof target === "object" && "current" in target) return target.current;

			// Selector
			if (typeof target === "string") return document.querySelector(target);

			return null;
		};

		const handleClick = (e: MouseEvent) => {
			const el = e.target;

			if (!(el instanceof HTMLElement)) return;

			const isInside = list.some((t) => {
				const node = resolve(t);
				return node && (el === node || node.contains(el));
			});

			if (isInside) return;

			onOutsideClick();
		};

		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, [targets, onOutsideClick]);
}
