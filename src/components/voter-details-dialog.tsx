import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { useVoterDetailsDialog } from "@/features/setup/state/use-voter-details-dialog";
import { useStoreData } from "@/hooks/use-store-data";
import { useUrlState } from "@/hooks/use-url-state";
import { useMemo } from "react";

export const VoterDetailsDialog = () => {
	const isOpen = useVoterDetailsDialog((state) => state.isOpen);
	const onClose = useVoterDetailsDialog((state) => state.onClose);

	const [{ voterId }, setState] = useUrlState();
	const appState = useStoreData((state) => state.appState);
	const selectedVoter = useMemo(
		() => appState?.data.find((voter) => voter.cardNumber === voterId),
		[appState, voterId],
	);

	const handleOpenChange = () => {
		setState({ voterId: "" });
		onClose();
	};
	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Voter Details</DialogTitle>
					<DialogDescription>
						Details for{" "}
						<span className="font-semibold capitalize">
							{selectedVoter?.firstName} {selectedVoter?.surname}
						</span>
					</DialogDescription>
				</DialogHeader>
				{selectedVoter && (
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
							<p className="col-span-3 font-medium">{`${selectedVoter.firstName} ${selectedVoter.middleName} ${selectedVoter.surname}`}</p>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Card No.
							</p>
							<p className="col-span-3 font-medium">
								{selectedVoter.cardNumber}
							</p>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<p className="text-sm text-gray-500 dark:text-gray-400">DOB</p>
							<p className="col-span-3 font-medium">{selectedVoter.dob}</p>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Station
							</p>
							<p className="col-span-3 font-medium">{selectedVoter.station}</p>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<p className="text-sm text-gray-500 dark:text-gray-400">Agent</p>
							<p className="col-span-3 font-medium">
								{selectedVoter.isAgent ? "Yes" : "No"}
							</p>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Referee
							</p>
							<p className="col-span-3 font-medium">
								{selectedVoter.isReferee ? "Yes" : "No"}
							</p>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};
