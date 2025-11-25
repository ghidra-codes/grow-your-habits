import type { FrequencyType, HabitPayload } from "@/types/habit.types";
import { useForm } from "react-hook-form";
import { FaAngleDown } from "react-icons/fa";

type FormValues = {
	name: string;
	description: string;
	frequency_type: FrequencyType;
	target_per_week?: number | null;
	target_per_month?: number | null;
};

interface HabitsFormProps {
	onAddHabit: (payload: HabitPayload) => Promise<void>;
	onUpdateHabit: (payload: HabitPayload) => Promise<void>;
	onCancel: () => void;
	isEditMode: boolean;
	initialValues: FormValues | null;
}

const HabitsForm = ({ onAddHabit, onUpdateHabit, onCancel, isEditMode, initialValues }: HabitsFormProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<FormValues>({
		defaultValues: {
			name: initialValues?.name || "",
			description: initialValues?.description || "",
			frequency_type: initialValues?.frequency_type || "daily",
			target_per_week: initialValues?.target_per_week ?? null,
			target_per_month: initialValues?.target_per_month ?? null,
		},
	});

	const onSubmit = async (data: FormValues) => {
		const actionFn = isEditMode ? onUpdateHabit : onAddHabit;

		await actionFn({
			name: data.name.trim(),
			description: data.description.trim(),
			frequency_type: data.frequency_type,
			target_per_week: data.target_per_week ?? null,
			target_per_month: data.target_per_month ?? null,
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<input type="text" placeholder="Habit name" {...register("name", { required: true })} />
			{errors.name && <p className="form-error-text">Name is required</p>}

			<input type="text" placeholder="Description (optional)" {...register("description")} />

			<div className="frequency-wrapper">
				<select {...register("frequency_type")}>
					<option value="daily">Daily</option>
					<option value="weekly">Weekly</option>
					<option value="monthly">Monthly</option>
					<option value="custom">Custom</option>
				</select>

				<FaAngleDown className="select-icon" color="#f3f8f4" />
			</div>

			{watch("frequency_type") === "weekly" && (
				<input
					type="number"
					placeholder="Times per week"
					{...register("target_per_week", { valueAsNumber: true })}
				/>
			)}

			{watch("frequency_type") === "monthly" && (
				<input
					type="number"
					placeholder="Times per month"
					{...register("target_per_month", { valueAsNumber: true })}
				/>
			)}

			<div className="form-actions">
				<button type="button" onClick={onCancel} className="form-btn form-btn--cancel">
					Cancel
				</button>

				<button type="submit" className="form-btn form-btn--confirm">
					Save
				</button>
			</div>
		</form>
	);
};

export default HabitsForm;
