import { useClickOutside } from "@/hooks/useClickOutside";
import { useUserIdRequired } from "@/hooks/useUserIdRequired";
import type { Habit } from "@/types/habit.types";
import Modal from "@/ui/Modal";
import { useState } from "react";
import { FaRegEdit, FaRegPlusSquare, FaRegTrashAlt } from "react-icons/fa";
import HabitsForm from "./components/HabitsForm";
import HabitsListItem from "./components/HabitsListItem";
import { useAddHabit } from "./hooks/useAddHabit";
import { useDeleteHabit } from "./hooks/useDeleteHabit";
import { useHabitsQuery } from "./hooks/useHabitsQuery";
import { useUpdateHabit } from "./hooks/useUpdateHabit";

const HabitsView = () => {
	const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
	const [modalMode, setModalMode] = useState<"add" | "edit">("add");
	const [isOpen, setIsOpen] = useState(false);

	const userId = useUserIdRequired();

	const { data: habits, isFetching, isError, error } = useHabitsQuery(userId);
	const { mutateAsync: addHabit } = useAddHabit(userId);
	const { mutateAsync: deleteHabit } = useDeleteHabit(userId);
	const { mutateAsync: updateHabit } = useUpdateHabit(userId);

	useClickOutside([".habit-item", ".habits-control-panel", ".habits-form", ".modal"], () =>
		setSelectedHabit(null)
	);

	const handleAddHabit = async (name: string, description: string) => {
		await addHabit({ name, description });
		setIsOpen(false);
	};

	const handleUpdateHabit = async (name: string, description: string) => {
		if (!selectedHabit) return;

		await updateHabit({
			habitId: selectedHabit.id,
			name,
			description,
		});

		setIsOpen(false);
	};

	const isEditMode = modalMode === "edit";

	return (
		<>
			<div className="habits-container">
				{/* Loading / Error */}
				{isFetching && <p>Loading habits…</p>}
				{isError && <p>{error?.message}</p>}

				<div className="habits-control-panel" onClick={(e) => e.stopPropagation()}>
					{!selectedHabit && (
						<button
							className="add-habit-btn"
							onClick={() => {
								setModalMode("add");
								setIsOpen(true);
							}}
						>
							<FaRegPlusSquare size={26} />
						</button>
					)}

					{selectedHabit && (
						<>
							<button
								className="delete-habit-btn"
								onClick={() => {
									deleteHabit(selectedHabit.id);
									setSelectedHabit(null);
								}}
							>
								<FaRegTrashAlt size={25} />
							</button>
							<button
								className="edit-habit-btn"
								onClick={() => {
									setModalMode("edit");
									setIsOpen(true);
								}}
							>
								<FaRegEdit size={27} />
							</button>
						</>
					)}
				</div>
				{/* Habits List */}
				{habits && habits.length > 0 && (
					<ul className="habits-list">
						<HabitsListItem
							habits={habits}
							onSelect={(habit) => setSelectedHabit(habit)}
							selectedHabit={selectedHabit}
						/>
					</ul>
				)}
			</div>

			<Modal
				isOpen={isOpen}
				handleClose={() => setIsOpen(false)}
				title={!isEditMode ? "Add New Habit" : "Edit Habit"}
				description={
					!isEditMode
						? "Fill out the form to add a new habit."
						: "Update the details of your habit."
				}
				contentClass="habits-form"
			>
				<HabitsForm
					isEditMode={isEditMode}
					initialValues={
						isEditMode && selectedHabit
							? {
									name: selectedHabit.name,
									description: selectedHabit.description || "",
							  }
							: undefined
					}
					onUpdateHabit={handleUpdateHabit}
					onAddHabit={handleAddHabit}
					onCancel={() => setIsOpen(false)}
				/>
			</Modal>
		</>
	);
};

export default HabitsView;
