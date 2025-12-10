import { mapHexToNormalized } from "@/lib/helpers/mapHexToNormalized";
import { ORIGINAL_PLANT_COLORS } from "../constants/plant-colors";

type RGBA = [number, number, number, number];
type LottieJSON = Record<string, unknown>;

export const recolorLottie = (json: LottieJSON, profile: Record<string, string>): LottieJSON => {
	const originalMap: Record<string, RGBA> = {};
	const targetMap: Record<string, RGBA> = {};

	for (const hex of ORIGINAL_PLANT_COLORS) {
		const normalized = mapHexToNormalized(hex);
		originalMap[hex] = normalized;

		const targetHex = profile[hex] ?? hex;
		targetMap[hex] = mapHexToNormalized(targetHex);
	}

	const isClose = (a: number, b: number) => Math.abs(a - b) < 0.02;

	// Match a Lottie RGB array to a original plant color
	const findMatchingHex = (rgb: number[]): string | undefined => {
		for (const hex of ORIGINAL_PLANT_COLORS) {
			const orig = originalMap[hex];
			if (isClose(orig[0], rgb[0]) && isClose(orig[1], rgb[1]) && isClose(orig[2], rgb[2])) {
				return hex;
			}
		}
		return undefined;
	};

	// Recursive traversal
	const walk = (node: unknown) => {
		if (!node || typeof node !== "object") return;

		const obj = node as Record<string, unknown>;

		const colorProp = obj.c as { k?: number[] } | undefined;

		if (Array.isArray(colorProp?.k) && colorProp.k.length >= 3) {
			const rgb = colorProp.k.slice(0, 3);
			const matchHex = findMatchingHex(rgb);

			if (matchHex) {
				colorProp.k = targetMap[matchHex];
			}
		}

		for (const value of Object.values(obj)) {
			walk(value);
		}
	};

	walk(json);
	return json;
};
