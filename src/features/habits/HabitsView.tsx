import { useClickOutside } from "@/hooks/useClickOutside";
import { useUserIdRequired } from "@/hooks/useUserIdRequired";
import type { Habit, HabitPayload, HabitWithLogs } from "@/types/habit.types";
import LoadingSpinner from "@/ui/LoadingSpinner";
import Modal from "@/ui/Modal";
import { hasLoggedToday } from "@/utils/helpers/hasLoggedToday";
import { useState } from "react";
import { FaRegEdit, FaRegPlusSquare, FaRegTrashAlt } from "react-icons/fa";
import HabitsForm from "./components/HabitsForm";
import HabitsListItem from "./components/HabitsListItem";
import { useDeleteHabitLog } from "./hooks/habit-logs/useDeleteHabitLog";
import { useLogHabit } from "./hooks/habit-logs/useLogHabit";
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

	const { mutateAsync: logHabit, isPending: isLogging } = useLogHabit(userId);
	const { mutateAsync: deleteHabitLog, isPending: isDeletingLog } = useDeleteHabitLog(userId);

	useClickOutside([".habit-item", ".habits-control-panel", ".habits-form", ".modal"], () =>
		setSelectedHabit(null)
	);

	const handleAddHabit = async (payload: HabitPayload) => {
		await addHabit(payload);

		setIsOpen(false);
	};

	const handleUpdateHabit = async (payload: HabitPayload) => {
		if (!selectedHabit) return;

		await updateHabit({ habitId: selectedHabit.id, ...payload });
		setIsOpen(false);
	};

	const handleToggleHabit = async (habit: HabitWithLogs) => {
		const isDone = hasLoggedToday(habit);

		const mutateFn = isDone ? deleteHabitLog : logHabit;
		await mutateFn(habit.id);
	};

	const isEditMode = modalMode === "edit";
	const isMutating = isLogging || isDeletingLog;

	const modalInfo = {
		title: !isEditMode ? "Add New Habit" : "Edit Habit",
		description: !isEditMode
			? "Fill out the form to add a new habit."
			: "Update the details of your habit.",
	};

	const initalFormValues =
		isEditMode && selectedHabit
			? {
					name: selectedHabit.name,
					description: selectedHabit.description || "",
					frequency_type: selectedHabit.frequency_type,
					target_per_week: selectedHabit.target_per_week,
					target_per_month: selectedHabit.target_per_month,
			  }
			: null;

	if (isFetching) return <LoadingSpinner />;

	if (isError) return <p>{error?.message}</p>;

	return (
		<>
			<div className="habits-container">
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
							onToggleHabit={handleToggleHabit}
							isMutating={isMutating}
						/>
					</ul>
				)}
			</div>

			<Modal
				isOpen={isOpen}
				handleClose={() => setIsOpen(false)}
				title={modalInfo.title}
				description={modalInfo.description}
				contentClass="habits-form"
			>
				<HabitsForm
					isEditMode={isEditMode}
					initialValues={initalFormValues}
					onUpdateHabit={handleUpdateHabit}
					onAddHabit={handleAddHabit}
					onCancel={() => setIsOpen(false)}
				/>
			</Modal>
		</>
	);
};

export default HabitsView;
