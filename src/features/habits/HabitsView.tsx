import { useClickOutside } from "@/hooks/useClickOutside";
import { useUserIdRequired } from "@/hooks/useUserIdRequired";
import LoadingSpinner from "@/ui/LoadingSpinner";
import Modal from "@/ui/Modal";
import HabitsForm from "./components/HabitsForm";
import HabitsListItem from "./components/HabitsListItem";
import { modalModeConfig } from "./config/modalModeConfig";
import { useHabitAdherence } from "./hooks/derived/useHabitAdherence";
import { useHabitActions } from "./hooks/useHabitActions";
import { useHabitModal } from "./hooks/useHabitModal";
import { useHabitsQuery } from "./hooks/queries/useHabitsQuery";
import HabitsControlPanel from "./components/HabitsControlPanel";
import { useState } from "react";
import type { Habit } from "@/types/habit.types";

const HabitsView = () => {
	const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
	const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

	const userId = useUserIdRequired();

	// Data fetching
	const { data: habits, isLoading, isError, error } = useHabitsQuery(userId);
	const adherenceMap = useHabitAdherence(habits || []);

	// Modal management
	const { isOpen, modalMode, openModal, closeModal, initialFormValues } = useHabitModal(selectedHabit);

	// Habit actions
	const { handleAddHabit, handleUpdateHabit, handleDeleteHabit, handleToggleHabit, isMutating } =
		useHabitActions(userId, selectedHabit, setSelectedHabit, closeModal);

	// Click outside to deselect habit
	useClickOutside([".habits-list", ".habits-control-panel", ".modal-content-container"], () =>
		setSelectedHabit(null)
	);

	if (isLoading) return <LoadingSpinner />;
	if (isError) return <p>{error?.message}</p>;

	return (
		<>
			<div className="habits-container">
				<HabitsControlPanel
					selectedHabit={selectedHabit}
					onAdd={() => openModal("add")}
					onEdit={() => openModal("edit")}
					onDelete={() => handleDeleteHabit()}
				/>

				{habits && habits.length > 0 && (
					<ul className="habits-list">
						<HabitsListItem
							habits={habits}
							selectedHabit={selectedHabit}
							onSelect={setSelectedHabit}
							onToggleHabit={handleToggleHabit}
							isMutating={isMutating}
							adherenceMap={adherenceMap}
							expandedIds={expandedIds}
							setExpandedIds={setExpandedIds}
						/>
					</ul>
				)}
			</div>

			<Modal
				isOpen={isOpen}
				handleClose={closeModal}
				title={modalModeConfig[modalMode].title}
				description={modalModeConfig[modalMode].description}
				containerClass="habits-form-container"
			>
				<HabitsForm
					isEditMode={modalMode === "edit"}
					initialValues={initialFormValues}
					onUpdateHabit={handleUpdateHabit}
					onAddHabit={handleAddHabit}
					onCancel={closeModal}
				/>
			</Modal>
		</>
	);
};

export default HabitsView;
