import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { type JSX, useState } from "react";

export const useConfirm = (
	title: string,
	message: string,
): [() => JSX.Element, () => Promise<unknown>] => {
	const [promise, setPromise] = useState<{
		resolve: (value: boolean) => void;
	} | null>(null);

	const confirm = () =>
		new Promise((resolve) => {
			setPromise({ resolve });
		});

	const handleClose = () => {
		setPromise(null);
	};

	const handleConfirm = () => {
		promise?.resolve(true);
		handleClose();
	};
	const handleCancel = () => {
		promise?.resolve(false);
		handleClose();
	};

	const ConfirmDialog = () => (
		<Dialog open={promise !== null} onOpenChange={handleClose}>
			<DialogContent className="bg-blue-50 dark:bg-neutral-800 rounded-lg border border-red-500/70 dark:border-red-500/30 shadow-2xl shadow-red-500/50 dark:shadow-red-500/30">
				<DialogHeader className="pt-2 pb-4">
					<DialogTitle className="text-2xl font-bold text-neutral-700 dark:text-neutral-200 mb-4">
						{title}
					</DialogTitle>
					<DialogDescription className="text-neutral-500 dark:text-neutral-400 font-semibold">
						{message}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="pt-2 flex space-x-4">
					<Button
						variant={"outline"}
						onClick={handleCancel}
						className="border-neutral-500/40"
					>
						Cancel
					</Button>
					<Button
						onClick={handleConfirm}
						className="text-white bg-red-500 hover:bg-red-500 dark:bg-red-600 w-2/5 hover:text-white"
					>
						Continue
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);

	return [ConfirmDialog, confirm];
};
