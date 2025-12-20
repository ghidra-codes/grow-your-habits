import { useEffect } from "react";

export const useVisualViewportHeight = () => {
	useEffect(() => {
		const update = () =>
			document.documentElement.style.setProperty(
				"--vvh",
				`${window.visualViewport?.height ?? window.innerHeight}px`
			);

		update();

		window.visualViewport?.addEventListener("resize", update);
		window.addEventListener("resize", update);

		return () => {
			window.visualViewport?.removeEventListener("resize", update);
			window.removeEventListener("resize", update);
		};
	}, []);
};
