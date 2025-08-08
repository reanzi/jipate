"use client";

// import { z } from 'zod';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
// import { useCurrentMember } from '../api/use-current-member';
// import VerificationInput from 'react-verification-input';
import { useSetupModal } from "@/features/setup/state/use-setup-modal";
import { SliderInput } from "./slider-input";
import { Button } from "./ui/button";
import { useState } from "react";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { ResizablePanel } from "./resizable-panel";

// const FormSchema = z.object({
//   // code: z.number({required_error: "Please enter the code"}),
//   code: z.string().min(4, 'Please enter the code'),
// });

/**
 *  a) Enable Test mode
 *      1: Generate test data
 *  b) Reset application
 *
 *
 * Application inapoanza, itafunguka setup-dialog kuuliza kama anaingia kwa kutumia test data au anatumia data zake;
 * Kama anatumia test data -> Application itahifadhi kuwa 'Test mode => true' laah sivyo itakuwa false;
 * Kama test-mode ni true;
 * Setup -< Cog /> itakuwa option ya 'Reset Application' na 'generate test data'
 * otherwise itakuwa na Reset Application;
 * Mtumiaji aki-reset application atarudishwa mwanzon kabisa, yaan kwenye setup-diaglog
 */

export const SetupModal = () => {
	//  const {data: member} = useCurrentMember()
	const [value, setValue] = useState<number[]>([5000]);
	const onClose = useSetupModal((state) => state.onClose);
	const isOpen = useSetupModal((state) => state.isOpen);
	const [isTest, setIsTest] = useState(true);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader className="border-b pb-3 mb-4">
					<DialogTitle className="cursor-default select-none font-extrabold">
						Setup
					</DialogTitle>
					<p className="text-sm text-muted-foreground cursor-default select-none">
						Manage resources used by the this application. Remember resources
						will only be available locally in this application on this device,
						even
						<strong className="text-md text-indigo-700 underline underline-offset-4">
							{" "}
							Jipate
						</strong>{" "}
						have no access to them.
					</p>
				</DialogHeader>
				<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
					<Label
						htmlFor="test-mode"
						className="space-y-0.5 flex flex-col items-start"
					>
						<h2>Test mode</h2>
						<p className="text-muted-foreground">
							Work with test data, for demostration purposes.
						</p>
					</Label>
					<Switch id="test-mode" checked={isTest} onCheckedChange={setIsTest} />
				</div>
				<ResizablePanel>
					<div className="w-full flex items-center py-8">
						{isTest && (
							<div className="w-full flex items-center gap-3 p-2">
								<SliderInput value={value} onValueChange={setValue} />
								<Button
									className="ml-auto"
									onClick={() => alert(JSON.stringify(value[0], null, 2))}
								>
									Generate resources
								</Button>
							</div>
						)}
					</div>
				</ResizablePanel>
			</DialogContent>
		</Dialog>
	);
};
