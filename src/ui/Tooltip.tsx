import * as RadixTooltip from "@radix-ui/react-tooltip";
import { useState, type ReactNode } from "react";
import { MdInfoOutline } from "react-icons/md";

type ToolTipProps = {
	content: ReactNode;
	side?: "top" | "right" | "bottom" | "left";
	sideOffset?: number;
	iconSize?: number;
};

const Tooltip = ({ content, side = "top", sideOffset = 4, iconSize = 22 }: ToolTipProps) => {
	const [open, setOpen] = useState(false);

	return (
		<RadixTooltip.Root open={open} disableHoverableContent>
			<RadixTooltip.Trigger
				asChild
				onClick={(e) => {
					e.stopPropagation();
					setOpen((prev) => !prev);
				}}
			>
				<div onClick={(e) => e.stopPropagation()}>
					<button className="info-icon" onPointerDownCapture={(e) => e.stopPropagation()}>
						<MdInfoOutline size={iconSize} />
					</button>
				</div>
			</RadixTooltip.Trigger>

			<RadixTooltip.Portal>
				<RadixTooltip.Content
					className="tooltip"
					side={side}
					sideOffset={sideOffset}
					onPointerDownOutside={() => setOpen(false)}
					onEscapeKeyDown={() => setOpen(false)}
				>
					{content}
					<RadixTooltip.Arrow className="tooltip-arrow" />
				</RadixTooltip.Content>
			</RadixTooltip.Portal>
		</RadixTooltip.Root>
	);
};

export default Tooltip;
