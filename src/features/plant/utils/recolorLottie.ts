import { mapHexToNormalized } from "@/lib/ui";
import { ORIGINAL_PLANT_COLORS } from "../constants/plant-colors";
import type { LottieAnimation } from "@/types/lottie.types";

type RGBA = [number, number, number, number];

interface ColorValue {
	k: number[];
}

// CHECK IF VALUE IS OBJECT
const isObject = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null;

// CHECK IF VALUE IS COLOR PROPERTY
const isColorProp = (value: unknown): value is ColorValue => {
	if (!isObject(value)) return false;
	if (!("k" in value)) return false;

	const obj: { [key: string]: unknown } = value;

	if (!Array.isArray(obj["k"])) return false;

	const kUnknown: unknown[] = obj["k"] as unknown[];

	for (const element of kUnknown) {
		const valueElement: unknown = element;
		if (typeof valueElement !== "number") return false;
	}

	return true;
};

/**
 * Recursively recolors a Lottie animation JSON structure.
 * Maps original plant colors to target profile colors using
 * normalized RGB matching for reliable replacements.
 */
export const recolorLottie = (json: LottieAnimation, profile: Record<string, string>): LottieAnimation => {
	const originalMap: Record<string, RGBA> = {};
	const targetMap: Record<string, RGBA> = {};

	// BUILD COLOR MAPS
	for (const hex of ORIGINAL_PLANT_COLORS) {
		originalMap[hex] = mapHexToNormalized(hex);

		const target = profile[hex] ?? hex;
		targetMap[hex] = mapHexToNormalized(target);
	}

	// CHECK RGB SIMILARITY
	const isClose = (a: number, b: number): boolean => Math.abs(a - b) < 0.02;

	// FIND MATCHING ORIGINAL COLOR
	const findMatchingHex = (rgb: number[]): string | undefined => {
		for (const hex of ORIGINAL_PLANT_COLORS) {
			const [r, g, b] = originalMap[hex];
			if (isClose(r, rgb[0]) && isClose(g, rgb[1]) && isClose(b, rgb[2])) {
				return hex;
			}
		}
		return undefined;
	};

	// RECURSIVE WALK THROUGH LOTTIE JSON
	const walk = (node: unknown): void => {
		if (!isObject(node)) return;

		if ("c" in node) {
			const cValue = node.c;

			if (isColorProp(cValue) && cValue.k.length >= 3) {
				const rgb = cValue.k.slice(0, 3);
				const match = findMatchingHex(rgb);
				if (match) {
					cValue.k = targetMap[match];
				}
			}
		}

		for (const value of Object.values(node)) {
			walk(value);
		}
	};

	walk(json);
	return json;
};
