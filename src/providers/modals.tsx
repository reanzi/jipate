import { SetupModal } from "@/components/setup-modal";
import { FilterDialog } from "@/components/filter-dialog";
import { useEffect, useState } from "react";
import { VoterDetailsDialog } from "@/components/voter-details-dialog";
export const ModalsProvider = () => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;
	return (
		<>
			<SetupModal />
			<FilterDialog />
			<VoterDetailsDialog />
		</>
	);
};
