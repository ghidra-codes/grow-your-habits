import { useState } from "react";
import { FaAngleDown } from "react-icons/fa";

interface Option {
	label: string;
	value: string;
}

interface SelectProps {
	value: string;
	onChange: (value: string) => void;
	options: Option[];
}

const Select = ({ value, onChange, options }: SelectProps) => {
	const [open, setOpen] = useState(false);

	const selectedLabel = options.find((opt) => opt.value === value)?.label ?? "Select";

	return (
		<div className="select">
			<button
				type="button"
				className={`select-trigger ${open ? "open" : ""}`}
				onClick={() => setOpen((p) => !p)}
			>
				{selectedLabel}
				<FaAngleDown className="chevron" size={18} />
			</button>

			<ul className={`select-options ${open ? "open" : ""}`}>
				{options.map((opt) => (
					<li
						key={opt.value}
						onClick={() => {
							onChange(opt.value);
							setOpen(false);
						}}
					>
						{opt.label}
					</li>
				))}
			</ul>
		</div>
	);
};

export default Select;
