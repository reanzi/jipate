import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NuqsAdapter } from "nuqs/adapters/react";
import "./index.css";
import App from "./App.tsx";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ConvexProvider client={convex}>
			<NuqsAdapter>
				<App />
			</NuqsAdapter>
		</ConvexProvider>
	</StrictMode>,
);

// PWA: Service Worker Registration
if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register("/service-worker.js")
			.then((registration) => {
				console.log(
					"Service Worker registered with scope:",
					registration.scope,
				);
			})
			.catch((error) => {
				console.error("Service Worker registration failed:", error);
			});
	});
}
