import { AnimatePresence, motion, type Variants } from "framer-motion";
import { SearchIcon, XIcon, Loader2 } from "lucide-react";
import React, {
	useEffect,
	useRef,
	useState,
	useMemo,
	useDeferredValue,
} from "react";

// Define the Voter interface
interface Voter {
	name: string;
	cardNumber: string;
	station: string;
	imageUrl: string;
}

// Define the component's props
interface SearchBarProps {
	// The voters data list
	voters: Voter[];
	// The callback function for when a user selects a suggestion
	onSelectSuggestion: (searchTerm: string) => void;
	placeholder?: string;
	isFiltering: boolean; // New prop to indicate if the parent is filtering the list
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
	voters,
	onSelectSuggestion,
	placeholder,
	isFiltering,
}) => {
	// Internal state for the input field value
	const [inputValue, setInputValue] = useState("");
	// State for the filtered suggestions displayed in the dropdown
	const [suggestions, setSuggestions] = useState<Voter[]>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const searchBarRef = useRef<HTMLDivElement>(null);

	// Defer the input value to prevent the main thread from blocking on filtering
	const deferredInputValue = useDeferredValue(inputValue);
	// A boolean to indicate if a search is pending
	const isSearching = deferredInputValue !== inputValue;

	// Filter suggestions based on the internal input value, limited to 5 results
	const filteredSuggestions = useMemo(() => {
		if (deferredInputValue.trim() === "") {
			return [];
		}
		return voters
			.filter(
				(voter) =>
					voter.name.toLowerCase().includes(deferredInputValue.toLowerCase()) ||
					voter.cardNumber
						.toLowerCase()
						.includes(deferredInputValue.toLowerCase()) ||
					voter.station
						.toLowerCase()
						.includes(deferredInputValue.toLowerCase()),
			)
			.slice(0, 5); // Limit suggestions to the top 5
	}, [deferredInputValue, voters]);

	useEffect(() => {
		setSuggestions(filteredSuggestions);
	}, [filteredSuggestions]);

	// Handle focus event to show the suggestions box
	const handleFocus = () => {
		setShowSuggestions(true);
	};

	// Handle blur event to hide the suggestions box. A small timeout allows for a click on a suggestion to register.
	const handleBlur = () => {
		setTimeout(() => {
			setShowSuggestions(false);
		}, 150);
	};

	// Handle a click on a suggestion item
	const handleSelectSuggestion = (suggestion: Voter) => {
		// Set the input value to the selected suggestion's name
		setInputValue(suggestion.name);
		// Update the parent's state to filter the main list
		onSelectSuggestion(suggestion.name);
		// Explicitly close the suggestions box
		setShowSuggestions(false);
	};

	// Handle clearing the search bar
	const handleClear = () => {
		setInputValue("");
		onSelectSuggestion(""); // Clear the parent's filter
		setShowSuggestions(false);
	};

	return (
		<div className="relative w-full max-w-lg mx-auto" ref={searchBarRef}>
			<div className="relative w-full">
				<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
					<SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
				</div>
				<input
					type="text"
					value={inputValue}
					onChange={(e) => {
						setInputValue(e.target.value);
						setShowSuggestions(true);
					}}
					onFocus={handleFocus}
					onBlur={handleBlur}
					placeholder={placeholder}
					className="w-full pl-10 pr-10 py-2 text-sm rounded-xl bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
				/>
				<AnimatePresence>
					{inputValue && (
						<motion.button
							key="clear-button"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							onClick={handleClear}
							className="absolute inset-y-0 right-0 flex items-center pr-3"
						>
							<XIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
						</motion.button>
					)}
				</AnimatePresence>
			</div>

			<AnimatePresence>
				{showSuggestions &&
					(isSearching || suggestions.length > 0 || isFiltering) && (
						<motion.ul
							variants={suggestionsVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
							className="absolute top-full left-0 z-10 w-full bg-white dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 rounded-b-xl max-h-60 overflow-y-auto"
						>
							{isSearching || isFiltering ? (
								<li className="flex justify-center items-center p-4">
									<Loader2 className="h-8 w-8 animate-spin text-primary" />
								</li>
							) : suggestions.length > 0 ? (
								suggestions.map((suggestion, index) => (
									<motion.li
										key={index}
										variants={suggestionItemVariants}
										className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
										onMouseDown={(e) => e.preventDefault()} // Prevent input blur on list item click
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
								<motion.li
									variants={suggestionItemVariants}
									className="p-4 text-center text-gray-500 dark:text-gray-400"
								>
									No matching voters found.
								</motion.li>
							)}
						</motion.ul>
					)}
			</AnimatePresence>
		</div>
	);
};

export default SearchBar;
