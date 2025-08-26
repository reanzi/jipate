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
import { useFilterModal } from "@/features/setup/state/use-filter-modal";
import { useStoreData } from "@/hooks/use-store-data";
import { useUrlState } from "@/hooks/use-url-state";
import type { Voter } from "@/types";
import { useMemo } from "react";
import { TwoColumnSearchableInput } from "./two-column-searchable-input";

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

export const FilterDialog = () => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, setUralState] = useUrlState();
	const onClose = useFilterModal((state) => state.onClose);
	const isOpen = useFilterModal((state) => state.isOpen);
	const handleOnSelect = (value: string) => {
		setUralState({ centers: value });
	};

	const appState = useStoreData((state) => state.appState);

	type FilterOption = {
		value: string;
		label: string;
	};
	const getStations = (records: Voter[]): FilterOption[] => {
		const stations = new Set<string>();

		// Iterate through the records and add each station to the Set.
		// The Set will automatically handle duplicates.
		records.forEach((record) => {
			const stationName = record.station ?? "";
			if (stationName) {
				stations.add(record.station);
			}
		});

		// Convert the Set back to an array and map each unique station
		// to an object with 'value' and 'label' properties.
		return Array.from(stations).map((station) => ({
			value: station,
			label: station,
		}));
	};

	const options = useMemo(() => {
		return getStations(appState?.data ?? []);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [appState]);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader className="border-b pb-3 mb-4">
					<DialogTitle className="cursor-default select-none font-extrabold">
						Chuja
					</DialogTitle>
					<DialogDescription className="text-sm text-muted-foreground cursor-default select-none">
						Angalia wapiga kurawa kata unayoihitaji.
					</DialogDescription>
				</DialogHeader>
				<div className="w-full flex flex-row items-center rounded-lg border-none p-3 shadow-sm">
					<TwoColumnSearchableInput
						onSelect={handleOnSelect}
						options={options}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};
