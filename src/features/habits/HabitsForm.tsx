import { useState } from "react";

interface HabitsFormProps {
	onAddHabit: (name: string, description: string) => Promise<void>;
	onCancel: () => void;
}

const HabitsForm = ({ onAddHabit, onCancel }: HabitsFormProps) => {
	const [habitName, setHabitName] = useState("");
	const [habitDescription, setHabitDescription] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!habitName.trim()) return;

		await onAddHabit(habitName.trim(), habitDescription.trim());

		setHabitName("");
		setHabitDescription("");
	};

	const handleClose = () => {
		setHabitName("");
		setHabitDescription("");
		onCancel();
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
				<button type="button" onClick={handleClose} className="form-btn form-btn--cancel">
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
