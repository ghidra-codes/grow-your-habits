import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { FaCheck } from "react-icons/fa";

interface CheckboxProps {
	checked: boolean;
	disabled: boolean;
	progress?: number;
	onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, disabled, progress, onClick }) => {
	const isProgressMode = typeof progress === "number";
	const isComplete = isProgressMode ? progress >= 100 : checked;

	return (
		<RadixCheckbox.Root checked={isComplete} disabled={disabled} className="checkbox" asChild>
			<button onClick={onClick} type="button">
				{isProgressMode && <span className="checkbox-fill" style={{ height: `${progress}%` }} />}

				<RadixCheckbox.Indicator className="checkbox-icon">
					<FaCheck size={14} />
				</RadixCheckbox.Indicator>
			</button>
		</RadixCheckbox.Root>
	);
};

export default Checkbox;
