import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { FaCheck } from "react-icons/fa";

const Checkbox = () => (
	<RadixCheckbox.Root className="checkbox">
		<RadixCheckbox.Indicator className="checkbox-icon">
			<FaCheck size={14} />
		</RadixCheckbox.Indicator>
	</RadixCheckbox.Root>
);

export default Checkbox;
