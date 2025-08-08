import { AnimatePresence, motion, type Variants } from "framer-motion";
import { SearchIcon, XIcon, Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState, useMemo } from "react";

interface Voter {
	name: string;
	cardNumber: string;
	station: string;
	imageUrl: string;
}

interface SearchBarProps {
	searchTerm: string;
	onSearchChange: (term: string) => void;
	voters: Voter[];
	placeholder?: string;
}

// Variants for the suggestions container animation
const suggestionsVariants: Variants = {
	hidden: {
		opacity: 0,
		scaleY: 0,
		originY: "top",
	},
	visible: {
		opacity: 1,
		scaleY: 1,
		transition: {
			type: "spring",
			stiffness: 150,
			damping: 20,
			staggerChildren: 0.05,
		},
	},
	exit: {
		opacity: 0,
		scaleY: 0,
		transition: {
			duration: 0.15,
		},
	},
};

// Variants for individual suggestion items
const suggestionItemVariants: Variants = {
	hidden: { opacity: 0, y: -10 },
	visible: { opacity: 1, y: 0 },
};

const SearchBar: React.FC<SearchBarProps> = ({
	searchTerm,
	onSearchChange,
	voters,
	placeholder,
}) => {
	const [suggestions, setSuggestions] = useState<Voter[]>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const searchBarRef = useRef<HTMLDivElement>(null);
	const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Create a Web Worker instance using a memoized hook
	const searchWorker = useMemo(() => {
		// This is a simple inline worker. For a more complex app,
		// you might put this in a separate file.
		const workerCode = () => {
			self.onmessage = (e) => {
				const { voters, searchTerm } = e.data;
				const lowercasedSearchTerm = searchTerm.toLowerCase();
				const filteredVoters = voters.filter(
					(voter: Voter) =>
						voter.name.toLowerCase().includes(lowercasedSearchTerm) ||
						voter.cardNumber.toLowerCase().includes(lowercasedSearchTerm),
				);
				self.postMessage(filteredVoters);
			};
		};
		const code = `(${workerCode.toString()})()`;
		const blob = new Blob([code], { type: "application/javascript" });
		return new Worker(URL.createObjectURL(blob));
	}, []);

	// Effect to handle click outside the search bar to close suggestions
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchBarRef.current &&
				!searchBarRef.current.contains(event.target as Node)
			) {
				setShowSuggestions(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [searchBarRef]);

	// Effect to handle the search logic with debouncing and the web worker
	useEffect(() => {
		// Set up the message listener for the worker
		searchWorker.onmessage = (e) => {
			setSuggestions(e.data);
			setShowSuggestions(true);
			setIsSearching(false);
		};

		if (debounceTimeout.current) {
			clearTimeout(debounceTimeout.current);
		}

		if (searchTerm.length > 1) {
			setIsSearching(true);
			debounceTimeout.current = setTimeout(() => {
				// Post the data to the worker for filtering
				searchWorker.postMessage({ voters, searchTerm });
			}, 300); // Debounce delay
		} else {
			setSuggestions([]);
			setShowSuggestions(false);
			setIsSearching(false);
		}

		// Clean up the debounce timer and terminate the worker on unmount
		return () => {
			if (debounceTimeout.current) {
				clearTimeout(debounceTimeout.current);
			}
			searchWorker.terminate();
		};
	}, [searchTerm, voters, searchWorker]);

	// Handler for input change
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onSearchChange(event.target.value);
	};

	// Handler for clearing the search term
	const handleClearSearch = () => {
		onSearchChange("");
	};

	// Handler for selecting a suggestion
	const handleSelectSuggestion = (suggestion: Voter) => {
		onSearchChange(suggestion.name);
		setShowSuggestions(false); // Close suggestions on select
	};

	// Conditional classes for the main container to manage rounded corners and borders
	const containerClasses = `
		relative w-3/5 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300
		${showSuggestions ? "rounded-t-xl" : "rounded-xl"}
	`;

	return (
		<div className={containerClasses} ref={searchBarRef}>
			<div className="flex items-center px-4 py-1 shadow-neutral-100 dark:shadow-neutral-600 dark:bg-neutral-700 dark:rounded-lg">
				<SearchIcon className="h-5 w-5 z-30 text-muted-foreground focus:text-primary" />

				<input
					type="text"
					value={searchTerm}
					onChange={handleInputChange}
					placeholder={placeholder}
					className="flex-1 py-1 px-4 bg-transparent focus:outline-none focus:ring-0 placeholder:text-muted-foreground"
				/>
				<AnimatePresence>
					{searchTerm && (
						<motion.button
							key="clear-button"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.15 }}
							onClick={handleClearSearch}
							className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none ml-2"
							aria-label="Clear search"
						>
							<XIcon className="h-5 w-5" />
						</motion.button>
					)}
				</AnimatePresence>
			</div>

			<AnimatePresence>
				{showSuggestions && (
					<motion.ul
						variants={suggestionsVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						className="absolute top-full left-0 z-10 w-full bg-white dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 rounded-b-xl max-h-60 overflow-y-auto"
					>
						{isSearching ? (
							<li className="flex justify-center items-center p-4">
								<Loader2 className="h-8 w-8 animate-spin text-primary" />
							</li>
						) : suggestions.length > 0 ? (
							suggestions.map((suggestion, index) => (
								<motion.li
									key={index}
									variants={suggestionItemVariants}
									className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
									onClick={() => handleSelectSuggestion(suggestion)}
								>
									<img
										src={suggestion.imageUrl}
										alt={suggestion.name}
										className="w-8 h-8 rounded-full mr-3"
									/>
									<div>
										<div className="text-sm font-semibold">
											{suggestion.name}
										</div>
										<div className="text-xs text-gray-500 dark:text-gray-400">
											{suggestion.cardNumber}
										</div>
									</div>
								</motion.li>
							))
						) : (
							<li className="flex justify-center items-center p-4 text-sm text-gray-500 dark:text-gray-400">
								No results found.
							</li>
						)}
					</motion.ul>
				)}
			</AnimatePresence>
		</div>
	);
};

export default SearchBar;
