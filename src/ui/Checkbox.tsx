import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { FaCheck } from "react-icons/fa";
import { forwardRef } from "react";

interface CheckboxProps {
	checked: boolean;
	disabled: boolean;
	onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
	({ checked, disabled, onCheckedChange }, ref) => (
		<RadixCheckbox.Root
			className="checkbox"
			checked={checked}
			onCheckedChange={onCheckedChange}
			disabled={disabled}
			ref={ref}
		>
			<RadixCheckbox.Indicator className="checkbox-icon">
				<FaCheck size={14} />
			</RadixCheckbox.Indicator>
		</RadixCheckbox.Root>
	)
);

export default Checkbox;
