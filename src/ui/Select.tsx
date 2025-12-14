import { useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { useClickOutside } from "./hooks/useClickOutside";

interface Option<T extends string> {
	label: string;
	value: T;
}

interface SelectProps<T extends string> {
	value: T;
	onChange: (value: T) => void;
	options: Option<T>[];
	chevronSize?: number;
	className?: string;
}

const Select = <T extends string>({
	value,
	onChange,
	options,
	chevronSize = 18,
	className,
}: SelectProps<T>) => {
	const [open, setOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement | null>(null);

	const selectedLabel = options.find((opt) => opt.value === value)?.label ?? "Select";

	useClickOutside(rootRef, () => setOpen(false));

	return (
		<div ref={rootRef} className={`select ${className ?? ""}`}>
			<button
				type="button"
				className={`select-trigger ${open ? "open" : ""}`}
				onClick={() => setOpen((p) => !p)}
			>
				{selectedLabel}
				<FaAngleDown className="chevron" size={chevronSize} />
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
