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
		formState: { errors, isSubmitting },
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
		if (isSubmitting) return;

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
				<label htmlFor="habit-name" className="sr-only">
					Habit name
				</label>
				<input
					id="habit-name"
					type="text"
					placeholder="Habit name"
					aria-invalid={!!errors.name}
					aria-describedby={errors.name ? "habit-name-error" : undefined}
					{...register("name", {
						required: "Name is required",
						maxLength: {
							value: 30,
							message: "Max 30 characters",
						},
					})}
				/>

				<p
					id="habit-name-error"
					className={`form-error-text ${!errors.name ? "hidden" : ""}`}
					role="alert"
				>
					{errors.name?.message}
				</p>
			</div>

			<div className="input-group">
				<label htmlFor="habit-description" className="sr-only">
					Description
				</label>
				<textarea
					id="habit-description"
					placeholder="Description (optional)"
					aria-invalid={!!errors.description}
					aria-describedby={errors.description ? "habit-description-error" : undefined}
					{...register("description", {
						maxLength: {
							value: 120,
							message: "Max 120 characters",
						},
					})}
					rows={3}
				/>

				<p
					id="habit-description-error"
					className={`form-error-text ${!errors.description ? "hidden" : ""}`}
					role="alert"
				>
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
						className="frequency-input"
						placeholder="Times per week"
						aria-required="true"
						aria-invalid={!!errors.target_per_week}
						aria-describedby={errors.target_per_week ? "target-week-error" : undefined}
						min={1}
						max={7}
						{...register("target_per_week", {
							valueAsNumber: true,
							required: "Times per week is required",
							min: { value: 1, message: "Min is 1" },
							max: { value: 7, message: "Max is 7" },
						})}
					/>

					<p
						id="target-week-error"
						className={`form-error-text ${!errors.target_per_week ? "hidden" : ""}`}
						role="alert"
					>
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
						aria-required="true"
						aria-invalid={!!errors.target_per_month}
						aria-describedby={errors.target_per_month ? "target-month-error" : undefined}
						min={1}
						max={30}
						{...register("target_per_month", {
							valueAsNumber: true,
							required: "Times per month is required",
							min: { value: 1, message: "Min is 1" },
							max: { value: 30, message: "Max is 30" },
						})}
					/>

					<p
						id="target-month-error"
						className={`form-error-text ${!errors.target_per_month ? "hidden" : ""}`}
						role="alert"
					>
						{errors.target_per_month?.message}
					</p>
				</div>
			)}

			<div className={`form-actions ${isRangeType ? "form-actions-shifted" : ""}`}>
				<button type="button" onClick={onCancel} className="form-btn-cancel" disabled={isSubmitting}>
					Cancel
				</button>

				<button type="submit" className="form-btn-confirm" disabled={isSubmitting}>
					Save
				</button>
			</div>
		</form>
	);
};

export default HabitForm;
