import { useUserIdRequired } from "@/hooks/useUserIdRequired";
import { useHabits, useHabitsActions, useHabitsError, useHabitsFetching } from "@/store/useHabitsStore";
import Modal from "@/ui/Modal";
import { useEffect, useState } from "react";
import HabitsForm from "./HabitsForm";

const HabitsView = () => {
	const [isOpen, setIsOpen] = useState(false);

	const userId = useUserIdRequired();

	const habits = useHabits();
	const isFetching = useHabitsFetching();
	const error = useHabitsError();

	const { getHabits, addHabit } = useHabitsActions();

	const handleAddHabit = async (name: string, description: string) => {
		await addHabit(userId, name, description);

		setIsOpen(false);
	};

	useEffect(() => {
		getHabits(userId);
	}, [userId, getHabits]);

	return (
		<>
			<div>
				{/* Loading / Error */}
				{isFetching && <p className="text-gray-500">Loading habits…</p>}
				{error && <p className="text-red-600">{error}</p>}
				<button onClick={() => setIsOpen(true)}>Add Habit</button>
				{/* Habits List */}
				<ul className="space-y-2">
					{habits.map((habit) => (
						<li key={habit.id} className="border rounded px-4 py-2 bg-white shadow-sm">
							<strong>{habit.name}</strong>
							{habit.description && (
								<p className="text-gray-600 text-sm">{habit.description}</p>
							)}
						</li>
					))}
				</ul>
			</div>
			<Modal
				isOpen={isOpen}
				handleClose={() => setIsOpen(false)}
				title="Add New Habit"
				description="Fill out the form to add a new habit."
				contentClass="habits-form"
			>
				<HabitsForm onAddHabit={handleAddHabit} onCancel={() => setIsOpen(false)} />
			</Modal>
		</>
	);
};

export default HabitsView;
