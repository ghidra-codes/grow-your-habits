import { useEffect } from "react";

export const useVisualViewportHeight = () => {
	useEffect(() => {
		const update = () => {
			const height = window.visualViewport?.height ?? window.innerHeight;

			document.documentElement.style.setProperty("--vvh", `${height}px`);
		};

		update();

		window.visualViewport?.addEventListener("resize", update);
		window.addEventListener("resize", update);

		return () => {
			window.visualViewport?.removeEventListener("resize", update);
			window.removeEventListener("resize", update);
		};
	}, []);
};
