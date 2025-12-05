import { useEffect, type RefObject } from "react";
import { type LottieRefCurrentProps } from "lottie-react";

/**
 * Custom hook to extract a static SVG string from a rendered Lottie animation
 * and log it to the console for easy copying during development.
 */
export const useLottieSvgExtractor = (
	lottieApiRef: RefObject<LottieRefCurrentProps | null>,
	containerRef: RefObject<HTMLDivElement | null>,
	targetFrame: number,
	animationData: object,
	enabled: boolean
) => {
	useEffect(() => {
		if (!enabled) return;

		console.log("--- Lottie SVG Extraction Utility Activated ---");

		const mountTimer = setTimeout(() => {
			if (lottieApiRef.current && containerRef.current) {
				lottieApiRef.current.goToAndStop(targetFrame, true);

				const renderTimer = setTimeout(() => {
					if (!containerRef.current) return;

					const svgElement = containerRef.current.querySelector("svg");

					if (svgElement) {
						const svgString = new XMLSerializer().serializeToString(svgElement);

						console.log(`\n✅ SVG Extracted: Frame ${targetFrame} for stage:`);
						console.log("--- START STATIC SVG STRING (Copy below) ---");
						console.log(svgString);
						console.log("--- END STATIC SVG STRING ---\n");
					} else {
						console.error("❌ SVG element not found in containerRef. Check renderer settings.");
					}
				}, 50);

				return () => clearTimeout(renderTimer);
			} else {
				console.error("❌ Lottie Refs not available for extraction. Is the component mounted?");
			}
		}, 250);

		return () => clearTimeout(mountTimer);
	}, [animationData, targetFrame, enabled, containerRef, lottieApiRef]);
};
