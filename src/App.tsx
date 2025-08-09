// src/App.tsx
import { AnimatePresence } from "framer-motion";
import React, { useDeferredValue, useEffect, useMemo, useState } from "react";
import List from "./components/list";
import SearchBar from "./components/search-bar";
import { SettingMenu } from "./components/setting-menu";
import { ThemeToggle } from "./components/theme-toggle";
// import { useSetupModal } from "./features/setup/state/use-setup-modal";
import { MarkdownDialog } from "./components/about-dialog";
import { InitialData } from "./components/initial-data";
import { LoadingUI } from "./components/loading-ui";
import { useInitializeData, useStoreData } from "./hooks/use-store-data"; // Updated import
import { capitalizeFirstLetter } from "./lib/utils";
import { ModalsProvider } from "./providers/modals";
import { ThemeProvider } from "./providers/theme";

// This is how you import a raw text file in most modern build systems like Vite.
// The ?raw suffix tells the bundler to load the file content as a string.
// You would replace './README.md' with the correct path to your file.
import { Toaster } from "sonner";
import readmeContent from "../README.md?raw";

const App: React.FC = () => {
	// Destructure the new state and setter functions
	const { isInitializing } = useInitializeData();
	const appState = useStoreData((state) => state.appState);
	const isDataLoaded = useStoreData((state) => state.isDataLoaded);

	// Get voters and isDataLoaded status from the new appState
	const voters = useMemo(() => appState?.data || [], [appState?.data]);
	// const onOpen = useSetupModal((state) => state.onOpen);

	// State for the search term
	const [searchTerm, setSearchTerm] = useState("");
	// Use useDeferredValue to defer the search term, preventing UI freezes on large lists
	const deferredSearchTerm = useDeferredValue(searchTerm);

	// // A state to manage a custom search input for the `SearchableInput` component.
	// const [customSearchTerm, setCustomSearchTerm] = useState("");

	const [theme] = useState<"light" | "dark">(() => {
		// Initialize theme from local storage or default to 'light'
		if (typeof window !== "undefined") {
			return localStorage.getItem("theme") === "dark" ? "dark" : "light";
		}
		return "light";
	});

	// const [lastScrollY, setLastScrollY] = useState(0);

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
	// Memoize the filtered voters list. This is a CPU-intensive operation.
	const filteredVoters = useMemo(() => {
		// If the deferredSearchTerm is empty, return the full list of voters
		if (!deferredSearchTerm.trim()) {
			return voters;
		}

		// Filter the list based on the deferred search term
		return voters.filter(
			(voter) =>
				voter.name
					.toLowerCase()
					.includes(deferredSearchTerm.toLowerCase().trim()) ||
				voter.cardNumber
					.toLowerCase()
					.includes(deferredSearchTerm.toLowerCase().trim()) ||
				voter.station
					.toLowerCase()
					.includes(deferredSearchTerm.toLowerCase().trim()),
		);
	}, [voters, deferredSearchTerm]);
	// // Filter the voters based on the search term
	// const filteredVoters = useMemo(() => {
	// 	if (!appState || !appState.data) {
	// 		return [];
	// 	}

	// 	console.log("LOADED DATA: ", JSON.stringify(appState.data, null, 2));
	// 	const lowercasedSearchTerm = searchTerm.toLowerCase();
	// 	return appState.data.filter(
	// 		(voter: Voter) =>
	// 			voter.name.toLowerCase().includes(lowercasedSearchTerm) ||
	// 			voter.cardNumber.toLowerCase().includes(lowercasedSearchTerm),
	// 	);
	// }, [appState, searchTerm]);

	if (isInitializing) {
		return <LoadingUI />;
	}

	// Determine if the filter is currently being applied
	const isFiltering = searchTerm !== deferredSearchTerm;
	return (
		<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
			<div className="min-w-screen min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-50 flex flex-col overflow-hidden">
				<header className="sticky top-0 left-0 right-0 z-20 bg-white dark:bg-gray-800 shadow-lg">
					<div className="flex items-center justify-betweenpx-6 pl-2 py-2 max-w-4xl mx-auto">
						{!isDataLoaded ? (
							<h2 className="text-sm md:text-xl font-bold text-gray-800 dark:text-white truncate">
								Voters Scanning System (VSS)
							</h2>
						) : (
							<div className="flex flex-col">
								<h2 className="text-2xl font-bold text-gray-800 dark:text-white truncate">
									VSS
									<span className="hidden md:inline ml-2 md:text-md font-mono tracking-wide bg-blue-100 text-blue-700 dark:bg-blue-800/50 dark:text-blue-100 px-4 pt-[1.5px] pb-0.5 rounded-md">
										{appState?.mode === "TEST"
											? "Testing"
											: capitalizeFirstLetter(
													appState?.facility ?? "No facility",
											  )}
									</span>
								</h2>
								<span className="md:hidden text-xs font-mono tracking-wide  text-blue-700  dark:text-blue-100 rounded-md leading-0">
									{appState?.mode === "TEST"
										? "Testing"
										: capitalizeFirstLetter(
												appState?.facility ?? "No facility",
										  )}
								</span>
								{/* <p className="text-sm text-muted-foreground font-mono">
									Counts: {filteredVoters.length}
								</p> */}
							</div>
						)}
						{isDataLoaded && (
							<div className="relative flex flex-1 z-10 header pl-2 md:px-6 py-2 max-w-4xl mx-auto">
								<SearchBar
									isFiltering={isFiltering}
									onSelectSuggestion={setSearchTerm}
									voters={voters}
									placeholder="Search..."
								/>
							</div>
						)}
						<div className="ml-auto flex items-center">
							{isDataLoaded && <SettingMenu />}
							<ThemeToggle />
						</div>
					</div>
				</header>

				<div className="flex-1 w-full  xpt-[180px] max-w-4xl mx-auto p-1 ">
					{appState && appState.data.length > 0 ? (
						<>
							<AnimatePresence>
								<List voters={filteredVoters} onMarkUsed={() => {}} />
							</AnimatePresence>
							{filteredVoters.length > 0 && (
								<div className="text-start  pl-3 py-1.5 text-sm dark:text-neutral-50 text-neutral-800 font-mono dark:bg-gray-800 bg-neutral-200 rounded-b-lg">
									Found {new Intl.NumberFormat().format(filteredVoters.length)}{" "}
									records
								</div>
							)}
						</>
					) : (
						<InitialData />
					)}
				</div>
				{/* It will be rendered with the content from your README.md file */}
				<MarkdownDialog
					markdownContent={readmeContent}
					buttonText="View README"
					dialogTitle="Project Documentation"
				/>
			</div>
			<Toaster richColors />
			<ModalsProvider />
		</ThemeProvider>
	);
};

export default App;
