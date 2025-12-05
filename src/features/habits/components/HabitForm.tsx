import type { FrequencyType, HabitPayload } from "@/types/habit.types";
import Select from "@/ui/Select";
import { Controller, useForm } from "react-hook-form";

type FormValues = {
	name: string;
	description: string;
	frequency_type: FrequencyType;
	target_per_week?: number | null;
	target_per_month?: number | null;
};

interface HabitFormProps {
	onAddHabit: (payload: HabitPayload) => Promise<void>;
	onUpdateHabit: (payload: HabitPayload) => Promise<void>;
	onCancel: () => void;
	isEditMode: boolean;
	initialValues: FormValues | null;
}

const HabitForm = ({ onAddHabit, onUpdateHabit, onCancel, isEditMode, initialValues }: HabitFormProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		control,
	} = useForm<FormValues>({
		shouldUnregister: false,
		defaultValues: initialValues || {
			name: "",
			description: "",
			frequency_type: "daily",
			target_per_week: null,
			target_per_month: null,
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

	const frequency = watch("frequency_type");
	const isRangeType = frequency === "weekly" || frequency === "monthly";

	return (
		<form onSubmit={handleSubmit(onSubmit)} noValidate>
			<div className="input-group">
				<input
					type="text"
					placeholder="Habit name"
					{...register("name", {
						required: "Name is required",
						maxLength: {
							value: 30,
							message: "Max 30 characters",
						},
					})}
				/>
				<p className={`form-error-text ${!errors.name ? "hidden" : ""}`}>{errors.name?.message}</p>
			</div>

			<div className="input-group">
				<textarea
					placeholder="Description (optional)"
					{...register("description", {
						maxLength: {
							value: 120,
							message: "Max 120 characters",
						},
					})}
					rows={3}
				/>
				<p className={`form-error-text ${!errors.description ? "hidden" : ""}`}>
					{errors.description?.message}
				</p>
			</div>

			<Controller
				name="frequency_type"
				control={control}
				render={({ field }) => (
					<Select<FrequencyType>
						value={field.value}
						onChange={field.onChange}
						options={[
							{ label: "Daily", value: "daily" },
							{ label: "Weekly", value: "weekly" },
							{ label: "Monthly", value: "monthly" },
						]}
					/>
				)}
			/>

			{frequency === "weekly" && (
				<div className="input-group">
					<input
						type="number"
						placeholder="Times per week"
						className="frequency-input"
						min={1}
						max={7}
						{...register("target_per_week", {
							valueAsNumber: true,
							required: "Times per week is required",
							min: { value: 1, message: "Min is 1" },
							max: { value: 7, message: "Max is 7" },
						})}
					/>

					<p className={`form-error-text ${!errors.target_per_week ? "hidden" : ""}`}>
						{errors.target_per_week?.message}
					</p>
				</div>
			)}

			{frequency === "monthly" && (
				<div className="input-group">
					<input
						type="number"
						placeholder="Times per month"
						className="frequency-input"
						min={1}
						max={30}
						{...register("target_per_month", {
							valueAsNumber: true,
							required: "Times per month is required",
							min: { value: 1, message: "Min is 1" },
							max: { value: 30, message: "Max is 30" },
						})}
					/>

					<p className={`form-error-text ${!errors.target_per_month ? "hidden" : ""}`}>
						{errors.target_per_month?.message}
					</p>
				</div>
			)}

			<div className={`form-actions ${isRangeType ? "form-actions-shifted" : ""}`}>
				<button type="button" onClick={onCancel} className="form-btn-cancel">
					Cancel
				</button>

				<button type="submit" className="form-btn-confirm">
					Save
				</button>
			</div>
		</form>
	);
};

export default HabitForm;
