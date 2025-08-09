import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NuqsAdapter } from "nuqs/adapters/react";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<NuqsAdapter>
			<App />
		</NuqsAdapter>
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
