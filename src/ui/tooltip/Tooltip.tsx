import * as RadixTooltip from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";
import { MdInfoOutline } from "react-icons/md";
import { useTooltipController } from "./TooltipContext";

type ToolTipProps = {
	id: string;
	content: ReactNode;
	children?: ReactNode;
	side?: "top" | "right" | "bottom" | "left";
	sideOffset?: number;
	iconSize?: number;
};

const Tooltip = ({ id, content, children, side = "top", sideOffset = 4, iconSize = 22 }: ToolTipProps) => {
	const { openId, setOpenId } = useTooltipController();

	const isOpen = openId === id;

	return (
		<RadixTooltip.Root open={isOpen} disableHoverableContent>
			<RadixTooltip.Trigger
				asChild
				onClick={(e) => {
					e.stopPropagation();
					setOpenId(isOpen ? null : id);
				}}
			>
				{!children ? (
					<div onClick={(e) => e.stopPropagation()}>
						<button className="info-icon" onPointerDownCapture={(e) => e.stopPropagation()}>
							<MdInfoOutline size={iconSize} />
						</button>
					</div>
				) : (
					children
				)}
			</RadixTooltip.Trigger>

			<RadixTooltip.Portal>
				<RadixTooltip.Content
					className="tooltip"
					side={side}
					sideOffset={sideOffset}
					onPointerDownOutside={() => setOpenId(null)}
					onEscapeKeyDown={() => setOpenId(null)}
				>
					{content}
					<RadixTooltip.Arrow className="tooltip-arrow" />
				</RadixTooltip.Content>
			</RadixTooltip.Portal>
		</RadixTooltip.Root>
	);
};

export default Tooltip;
