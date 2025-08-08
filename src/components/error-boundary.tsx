// src/components/ErrorBoundary.tsx
import React, { Component, type ReactNode } from "react";

interface Props {
	children?: ReactNode;
}

interface State {
	hasError: boolean;
}

/**
 * A reusable Error Boundary component.
 * It catches JavaScript errors in its child component tree, logs them,
 * and displays a fallback UI.
 *
 * This is implemented as a class component because functional components
 * do not support error boundaries directly.
 */
class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
	};

	/**
	 * getDerivedStateFromError is called when an error is thrown.
	 * It returns a new state that will trigger a re-render with the fallback UI.
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public static getDerivedStateFromError(_: Error): State {
		return { hasError: true };
	}

	/**
	 * componentDidCatch is called after an error has been thrown.
	 * It is used for logging error information.
	 */
	public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// You can also log the error to an error reporting service
		console.error("Uncaught error:", error, errorInfo);
	}

	public render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return (
				<div className="flex flex-col items-center justify-center h-screen w-screen bg-background text-foreground p-8">
					<h1 className="text-2xl font-bold text-red-500 mb-4">
						Oops! An Error Occurred.
					</h1>
					<p className="text-lg text-muted-foreground text-center">
						It looks like there was a problem processing the data. Please check
						the file for any malformed records and try again.
					</p>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
