import { hexToRgbString } from "@/lib/ui";
import { ORIGINAL_PLANT_COLORS } from "../constants/plant-colors";

const escape = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const recolorSvg = (svg: string, profile: Record<string, string>): string => {
	let output = svg;

	for (const hex of ORIGINAL_PLANT_COLORS) {
		const key = hex.toUpperCase();

		const target = profile[key];
		if (!target) continue;

		const rgb = hexToRgbString(hex);
		const patterns = [hex, hex.toLowerCase(), hex.toUpperCase(), rgb, rgb.replace(/\s+/g, "")];

		for (const pat of patterns) {
			const regex = new RegExp(escape(pat), "gi");
			output = output.replaceAll(regex, target);
		}
	}

	return output;
};
