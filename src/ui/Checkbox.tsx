import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { FaCheck } from "react-icons/fa";

interface CheckboxProps {
	checked: boolean;
	disabled: boolean;
	onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, disabled, onClick }) => (
	<RadixCheckbox.Root checked={checked} disabled={disabled} className="checkbox" asChild>
		<button onClick={onClick} type="button">
			<RadixCheckbox.Indicator className="checkbox-icon">
				<FaCheck size={14} />
			</RadixCheckbox.Indicator>
		</button>
	</RadixCheckbox.Root>
);

export default Checkbox;
