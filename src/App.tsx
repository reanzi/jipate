// src/App.tsx
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import List from "./components/list";
import SearchBar from "./components/search-bar";
import { SettingMenu } from "./components/setting-menu";
import { ThemeToggle } from "./components/theme-toggle";
// import { useSetupModal } from "./features/setup/state/use-setup-modal";
import { InitialData } from "./components/initial-data";
import { LoadingUI } from "./components/loading-ui";
import { useInitializeData, useStoreData } from "./hooks/use-store-data"; // Updated import
import { capitalizeFirstLetter } from "./lib/utils";
import { ModalsProvider } from "./providers/modals";
import { ThemeProvider } from "./providers/theme";
import { type Voter } from "./types"; // Import types

const App: React.FC = () => {
	// Destructure the new state and setter functions
	const { isInitializing } = useInitializeData();
	const appState = useStoreData((state) => state.appState);
	const isDataLoaded = useStoreData((state) => state.isDataLoaded);
	const [searchTerm, setSearchTerm] = useState("");
	// const onOpen = useSetupModal((state) => state.onOpen);

	const [theme] = useState<"light" | "dark">(() => {
		// Initialize theme from local storage or default to 'light'
		if (typeof window !== "undefined") {
			return localStorage.getItem("theme") === "dark" ? "dark" : "light";
		}
		return "light";
	});

	// const [lastScrollY, setLastScrollY] = useState(0);

	// Get voters and isDataLoaded status from the new appState
	const voters = appState?.data || [];

	// Apply the theme class to the document's html element
	useEffect(() => {
		if (typeof document !== "undefined") {
			const htmlElement = document.documentElement;
			if (theme === "dark") {
				htmlElement.classList.add("dark");
				localStorage.setItem("theme", "dark");
			} else {
				htmlElement.classList.remove("dark");
				localStorage.setItem("theme", "light");
			}
		}
	}, [theme]);
	// Filter the voters based on the search term
	const filteredVoters = useMemo(() => {
		if (!appState || !appState.data) {
			return [];
		}

		console.log("LOADED DATA: ", JSON.stringify(appState.data, null, 2));
		const lowercasedSearchTerm = searchTerm.toLowerCase();
		return appState.data.filter(
			(voter: Voter) =>
				voter.name.toLowerCase().includes(lowercasedSearchTerm) ||
				voter.cardNumber.toLowerCase().includes(lowercasedSearchTerm),
		);
	}, [appState, searchTerm]);

	if (isInitializing) {
		return <LoadingUI />;
	}
	return (
		<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
			<div className="min-w-screen min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-50 flex flex-col overflow-hidden">
				<header className="sticky top-0 left-0 right-0 z-20 bg-white dark:bg-gray-800 shadow-lg">
					<div className="flex items-center justify-betweenpx-6 py-2 max-w-4xl mx-auto">
						{!isDataLoaded ? (
							<h2 className="text-xl font-bold text-gray-800 dark:text-white truncate">
								Voters Searching System (VSS)
							</h2>
						) : (
							<div className="flex flex-col">
								<h2 className="text-2xl font-bold text-gray-800 dark:text-white truncate">
									VSS
									<span className="ml-2 text-md font-mono tracking-wide bg-blue-100 text-blue-700 dark:bg-blue-800/50 dark:text-blue-100 px-4 pt-[1.5px] pb-0.5 rounded-md">
										{appState?.mode === "TEST"
											? "Testing"
											: capitalizeFirstLetter(
													appState?.facility ?? "No facility",
											  )}
									</span>
								</h2>
								{/* <p className="text-sm text-muted-foreground font-mono">
									Counts: {filteredVoters.length}
								</p> */}
							</div>
						)}
						{isDataLoaded && (
							<div className="relative flex flex-1 z-10 header px-6 py-2 max-w-4xl mx-auto">
								<SearchBar
									searchTerm={searchTerm}
									onSearchChange={setSearchTerm}
									voters={voters}
									placeholder="Search..."
								/>
							</div>
						)}
						<div className="ml-auto flex items-center gap-2">
							{isDataLoaded && <SettingMenu />}
							<ThemeToggle />
						</div>
					</div>
				</header>

				<div className="flex-1 w-full  xpt-[180px] max-w-4xl mx-auto p-2 bg-neutral-100 dark:bg-neutral-900">
					{appState && appState.data.length > 0 ? (
						<>
							<AnimatePresence>
								<List voters={filteredVoters} onMarkUsed={() => {}} />
							</AnimatePresence>
							{filteredVoters.length > 0 && (
								<div className="text-start  pl-3 py-1.5 text-sm text-neutral-200 dark:text-neutral-800 font-mono bg-gray-700 dark:bg-gray-200 rounded-b-lg">
									Counts: {filteredVoters.length}
								</div>
							)}
						</>
					) : (
						<InitialData />
					)}
				</div>
			</div>
			<ModalsProvider />
		</ThemeProvider>
	);
};

export default App;
