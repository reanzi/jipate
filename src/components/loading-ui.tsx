import { Loader2 } from "lucide-react";

/**
 * A full-screen loading component with a spinner and a message.
 * It uses the color variables defined in the provided index.css file.
 */
export const LoadingUI = () => {
	return (
		<div className="flex flex-col items-center justify-center h-screen w-screen bg-background text-foreground">
			<Loader2 className="h-16 w-16 animate-spin text-primary" />
			<p className="mt-4 text-xl font-medium text-muted-foreground">
				Loading data...
			</p>
		</div>
	);
};
