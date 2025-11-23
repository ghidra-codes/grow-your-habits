import { useState } from "react";

interface HabitsFormProps {
	onAddHabit: (name: string, description: string) => Promise<void>;
	onUpdateHabit: (name: string, description: string) => Promise<void>;
	onCancel: () => void;
	isEditMode: boolean;
	initialValues?: {
		name: string;
		description: string;
	};
}

const HabitsForm = ({ onAddHabit, onUpdateHabit, onCancel, isEditMode, initialValues }: HabitsFormProps) => {
	const [habitName, setHabitName] = useState(initialValues?.name || "");
	const [habitDescription, setHabitDescription] = useState(initialValues?.description || "");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!habitName.trim()) return;

		const actionFn = isEditMode ? onUpdateHabit : onAddHabit;

		await actionFn(habitName.trim(), habitDescription.trim());
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				placeholder="Habit name"
				value={habitName}
				onChange={(e) => setHabitName(e.target.value)}
			/>

			<input
				type="text"
				placeholder="Description (optional)"
				value={habitDescription}
				onChange={(e) => setHabitDescription(e.target.value)}
			/>

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
