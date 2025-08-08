import { SetupModal } from "@/components/setup-modal";
import { useEffect, useState } from "react";
export const ModalsProvider = () => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;
	return (
		<>
			<SetupModal />
		</>
	);
};
