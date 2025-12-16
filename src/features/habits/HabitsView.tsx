import { useUserIdRequired } from "@/features/auth/hooks/useUserIdRequired";
import { useStatsModalActions } from "@/store/useStatsModalStore";
import type { HabitWithLogs } from "@/types/habit.types";
import ErrorMessage from "@/ui/ErrorMessage";
import { useClickOutside } from "@/ui/hooks/useClickOutside";
import LoadingSpinner from "@/ui/LoadingSpinner";
import Modal from "@/ui/Modal";
import { useState } from "react";
import HabitForm from "./components/HabitForm";
import HabitListItem from "./components/HabitListItem";
import HabitLogOptions from "./components/HabitLogOptions";
import HabitsControlPanel from "./components/HabitsControlPanel";
import { modalModeConfig } from "./config/modal-mode";
import { useHabitAdherenceMap } from "./hooks/derived/useHabitAdherenceMap";
import { useHabitsQuery } from "./hooks/queries/useHabitsQuery";
import { useHabitActions } from "./hooks/useHabitActions";
import { useHabitLogModal } from "./hooks/useHabitLogModal";
import { useHabitModal } from "./hooks/useHabitModal";

const HabitsView = () => {
	const [selectedHabit, setSelectedHabit] = useState<HabitWithLogs | null>(null);
	const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

	const userId = useUserIdRequired();

	// Data fetching
	const { data: habits, isLoading, isError, error } = useHabitsQuery(userId);
	const adherenceMap = useHabitAdherenceMap(habits || []);

	// Modal management
	const { isOpen, modalMode, openModal, closeModal, initialFormValues } = useHabitModal(selectedHabit);
	const { open } = useStatsModalActions();

	const {
		isOpen: isLogModalOpen,
		logOptionsHabit,
		openModal: openLogModal,
		closeModal: closeLogModal,
	} = useHabitLogModal();

	// Habit actions
	const { handleAddHabit, handleUpdateHabit, handleDeleteHabit, handleToggleHabit, isMutating } =
		useHabitActions(userId, selectedHabit, setSelectedHabit, closeModal);

	// Click outside to deselect habit
	useClickOutside([".habits-list", ".habits-control-panel", ".modal-content-container"], () =>
		setSelectedHabit(null)
	);

	if (isLoading) return <LoadingSpinner />;
	if (isError)
		return (
			<ErrorMessage
				title="Unable to load your habits"
				message="There was a problem loading your habits. Please try again."
				errorMessage={error?.message}
			/>
		);

	return (
		<>
			<div className="habits-container">
				<h2 className="view-heading">Habits</h2>

				<HabitsControlPanel
					selectedHabit={selectedHabit}
					onAdd={() => openModal("add")}
					onEdit={() => openModal("edit")}
					onDelete={() => handleDeleteHabit()}
					onOpenStats={() => selectedHabit && open(selectedHabit)}
					hasHabits={!!habits && habits.length > 0}
				/>

				{habits && habits.length === 0 && (
					<div className="habits-empty-state">
						<p>No habits found.</p>
						<p>Add a habit to get started.</p>
					</div>
				)}

				{habits && habits.length > 0 && (
					<ul className="habits-list">
						<HabitListItem
							habits={habits}
							selectedHabit={selectedHabit}
							onSelect={setSelectedHabit}
							onToggleHabit={handleToggleHabit}
							isMutating={isMutating}
							adherenceMap={adherenceMap}
							expandedIds={expandedIds}
							setExpandedIds={setExpandedIds}
							onOpenLogModal={openLogModal}
						/>
					</ul>
				)}
			</div>

			<Modal
				isOpen={isOpen}
				handleClose={closeModal}
				title={modalModeConfig[modalMode].title}
				description={modalModeConfig[modalMode].description}
				containerClass="habit-form-container"
			>
				<HabitForm
					isEditMode={modalMode === "edit"}
					initialValues={initialFormValues}
					onUpdateHabit={handleUpdateHabit}
					onAddHabit={handleAddHabit}
					onCancel={closeModal}
				/>
			</Modal>

			<Modal
				isOpen={isLogModalOpen}
				handleClose={closeLogModal}
				title="Log Habit"
				description="When would you like to log this habit?"
				containerClass="habit-log-options-container"
			>
				{logOptionsHabit && (
					<HabitLogOptions
						habit={logOptionsHabit}
						onToggleHabit={(habit, date) => {
							handleToggleHabit(habit, date);
							closeLogModal();
						}}
					/>
				)}
			</Modal>
		</>
	);
};

export default HabitsView;
