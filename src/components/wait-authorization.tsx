"use client";

// import { z } from 'zod';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
// import { useCurrentMember } from '../api/use-current-member';
// import VerificationInput from 'react-verification-input';

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

export const WaitAuthorization = () => {
	return (
		<Dialog open={true} onOpenChange={() => {}}>
			<DialogContent>
				<DialogHeader className=" pb-3 mb-4">
					<DialogTitle className="cursor-default select-none font-extrabold text-3xl">
						Tafadhali subiri.
					</DialogTitle>
					<DialogDescription className="text-lg text-muted-foreground cursor-default select-none py-4">
						Tunasubiri baadhi ya vitu vichache vikae sawa, muda si mrefu itakuwa
						sawa,
					</DialogDescription>
				</DialogHeader>
				{/* <div className="w-full flex flex-row items-center rounded-lg border-none p-3 shadow-sm"></div> */}
			</DialogContent>
		</Dialog>
	);
};
