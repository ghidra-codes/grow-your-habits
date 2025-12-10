import * as RadixTooltip from "@radix-ui/react-tooltip";
import { useState, type ReactNode } from "react";

type ToolTipProps = {
	content: ReactNode;
	children: ReactNode;
	side?: "top" | "right" | "bottom" | "left";
	sideOffset?: number;
};

const Tooltip = ({ content, children, side = "top", sideOffset = 6 }: ToolTipProps) => {
	const [open, setOpen] = useState(false);

	return (
		<RadixTooltip.Root open={open} onOpenChange={setOpen}>
			<RadixTooltip.Trigger
				asChild
				onClick={(e) => {
					e.stopPropagation();
					setOpen((prev) => !prev);
				}}
			>
				{children}
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
