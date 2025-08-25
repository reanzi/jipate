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
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

export const VoterDetailsDialog = () => {
	const isOpen = useVoterDetailsDialog((state) => state.isOpen);
	const onClose = useVoterDetailsDialog((state) => state.onClose);

	const { updateVoter: onUpdateVoter } = useStoreData();

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
	const handleMark = (identifier: "agent" | "sponsor") => {
		if (!selectedVoter) return;
		if (identifier === "agent") {
			// Call the new onUpdateVoter prop with the voter's card number and the specific update
			onUpdateVoter(selectedVoter.cardNumber, {
				isAgent: !selectedVoter.isAgent,
			});
		} else if (identifier === "sponsor") {
			// Call the new onUpdateVoter prop with the voter's card number and the specific update
			onUpdateVoter(selectedVoter.cardNumber, {
				isReferee: !selectedVoter.isReferee,
			});
		}
	};

	// Define the colors for each checkbox
	const sponsorColorClasses = selectedVoter?.isReferee
		? "bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500"
		: "border-gray-400 dark:border-gray-500";

	const presenterColorClasses = selectedVoter?.isAgent
		? "bg-green-600 border-green-600 dark:bg-green-500 dark:border-green-500"
		: "border-gray-400 dark:border-gray-500";
	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Mpiga kura</DialogTitle>
					<DialogDescription>
						Taarifa kwa ufupi za{" "}
						<span className="font-semibold capitalize">
							{selectedVoter?.firstName} {selectedVoter?.surname}
						</span>
					</DialogDescription>
				</DialogHeader>
				{selectedVoter && (
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<p className="text-sm text-gray-500 dark:text-gray-400">Jina</p>
							<p className="col-span-3 font-medium">{`${selectedVoter.firstName} ${selectedVoter.middleName} ${selectedVoter.surname}`}</p>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Kadi Na.
							</p>
							<p className="col-span-3 font-medium">
								{selectedVoter.cardNumber}
							</p>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Kuzaliwa
							</p>
							<p className="col-span-3 font-medium">{selectedVoter.dob}</p>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<p className="text-sm text-gray-500 dark:text-gray-400">Kata</p>
							<p className="col-span-3 font-medium">{selectedVoter.station}</p>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Ni wakala
							</p>
							<p className="col-span-3 font-medium">
								{selectedVoter.isAgent ? "NDIO" : "HAPANA"}
							</p>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Amedhamini
							</p>
							<p className="col-span-3 font-medium">
								{selectedVoter.isReferee ? "NDIO" : "HAPANA"}
							</p>
						</div>
					</div>
				)}
				{selectedVoter && (
					<div className="py-4 px-4 flex justify-around items-center w-full  border-t border-muted-foreground">
						<div className="flex items-center gap-3">
							<Checkbox
								id="sponsor"
								checked={selectedVoter.isReferee}
								onCheckedChange={() => handleMark("sponsor")}
								className={`h-5 w-5 rounded-sm transition-colors duration-200 ease-in-out ${sponsorColorClasses}`}
							/>
							<Label htmlFor="sponsor">Amedhamini</Label>
						</div>
						<div className="flex items-center gap-3">
							<Checkbox
								id="agent"
								checked={selectedVoter.isAgent}
								onCheckedChange={() => handleMark("agent")}
								className={`h-5 w-5 rounded-sm transition-colors duration-200 ease-in-out ${presenterColorClasses}`}
							/>
							<Label htmlFor="agent">Ni wakala</Label>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};
