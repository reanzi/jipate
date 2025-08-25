import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Voter } from "@/types";
import { FixedSizeList } from "react-window"; // Import a windowing library
import { useVoterDetailsDialog } from "@/features/setup/state/use-voter-details-dialog";
import { useUrlState } from "@/hooks/use-url-state";
import { Checkbox } from "./ui/checkbox";
import { useStoreData } from "@/hooks/use-store-data";

interface VoterListProps {
	voters: Voter[];
	// Renamed the prop to avoid confusion and match the new function name
	// onUpdateVoter: (voterId: string, updates: Partial<Voter>) => void;
}

// A simple hook to track the window size for responsive container height
const useWindowSize = () => {
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return windowSize;
};

// Define the Row component for react-window
const Row = ({
	index,
	style,
	data,
}: // onUpdateVoter, // Add the new prop to the Row component
{
	index: number;
	style: React.CSSProperties;
	data: Voter[];
	// onUpdateVoter: (voterId: string, updates: Partial<Voter>) => void; // Define the prop type
}) => {
	const onOpen = useVoterDetailsDialog((state) => state.onOpen);
	const { updateVoter: onUpdateVoter } = useStoreData();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, setState] = useUrlState();
	const voter = data[index];
	if (!voter) return null;

	// Determine if the row index is even or odd
	const isEven = index % 2 === 0;

	// Apply different background colors based on even/odd index
	const rowClasses = `
        border-b dark:border-gray-700 hover:bg-gray-100/50 dark:hover:bg-gray-700/20 cursor-pointer
        ${isEven ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-900"}
        flex items-center
    `;

	const handleOnClick = () => {
		setState({ voterId: voter.cardNumber });
		onOpen();
	};

	const handleMark = (identifier: "agent" | "sponsor") => {
		if (identifier === "agent") {
			// Call the new onUpdateVoter prop with the voter's card number and the specific update
			onUpdateVoter(voter.cardNumber, { isAgent: !voter.isAgent });
		} else if (identifier === "sponsor") {
			// Call the new onUpdateVoter prop with the voter's card number and the specific update
			onUpdateVoter(voter.cardNumber, { isReferee: !voter.isReferee });
		}
	};

	// This function will be called when the action div is clicked
	const handleActionClick = (e: React.MouseEvent) => {
		// This is the key step: stop the click event from propagating to the parent
		e.stopPropagation();
	};

	// Define the colors for each checkbox
	const sponsorColorClasses = voter.isReferee
		? "bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500"
		: "border-gray-400 dark:border-gray-500";

	const presenterColorClasses = voter.isAgent
		? "bg-green-600 border-green-600 dark:bg-green-500 dark:border-green-500"
		: "border-gray-400 dark:border-gray-500";
	return (
		<motion.div style={style} className={rowClasses} onClick={handleOnClick}>
			{/* Hide on mobile, show on sm and up */}
			{/* <div className="hidden sm:flex py-1 px-4 w-[10%]">
                <img
                    src={voter.imageUrl}
                    alt={`${voter.name}'s profile`}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-500"
                />
            </div> */}
			<div className="py-1 px-4 w-1/2 sm:w-[33%] font-medium text-gray-900 whitespace-nowrap dark:text-white truncate">
				{`${voter.firstName} ${voter.middleName} ${voter.surname}`}
			</div>
			<div className="py-1 px-4 w-1/2 sm:w-[25%] truncate">
				{voter.cardNumber}
			</div>
			{/* Hide on mobile, show on sm and up */}
			<div className="hidden sm:flex py-1 px-4 w-[20%] truncate">
				{voter.station}
			</div>
			{/* Hide on mobile, show on sm and up */}
			<div
				className="hidden sm:flex justify-around py-1 px-4 w-[16%] border0l border-amber-300"
				onClick={handleActionClick}
			>
				<div className="flex flex-col items-center">
					<Checkbox
						checked={voter.isReferee}
						onCheckedChange={() => handleMark("sponsor")}
						className={`h-5 w-5 rounded-sm transition-colors duration-200 ease-in-out ${sponsorColorClasses}`}
					/>
					<span className="text-[10px] uppercase pt-0.5">sponsor</span>
				</div>
				<div className="flex flex-col">
					<Checkbox
						checked={voter.isAgent}
						onCheckedChange={() => handleMark("agent")}
						className={`h-5 w-5 rounded-sm transition-colors duration-200 ease-in-out ${presenterColorClasses}`}
					/>
					<span className="text-[10px] uppercase pt-0.5">Agent</span>
				</div>
			</div>
		</motion.div>
	);
};

const List = React.memo(({ voters }: VoterListProps) => {
	// const windowSize = useWindowSize();
	// // The height of the header, adjust as needed
	// const headerHeight = 50;
	// // Calculate the height of the list container based on the window height and header height
	// const containerHeight =
	// 	windowSize.height > headerHeight ? windowSize.height - headerHeight : 0;

	const windowSize = useWindowSize();
	const headerHeight = 150; // This value is derived from the pt-[180px] on the main content div in App.tsx
	const rowHeight = 50;
	const containerHeight =
		windowSize.height > headerHeight ? windowSize.height - headerHeight : 0;

	if (voters.length === 0) {
		return (
			<div className="py-8 text-center text-gray-500 dark:text-gray-400">
				No voters found.
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="relative shadow-md rounded-t-lg overflow-hidden"
		>
			<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
					<tr>
						{/* Hide on mobile, show on sm and up */}
						{/* <th scope="col" className="hidden sm:table-cell py-3 px-6 w-[10%]">
                            Image
                        </th> */}
						<th scope="col" className="py-3 px-6 w-1/2 sm:w-[33%]">
							Full name
						</th>
						<th scope="col" className="py-3 px-6 w-1/2 sm:w-[25%]">
							Card Number
						</th>
						{/* Hide on mobile, show on sm and up */}
						<th scope="col" className="hidden sm:table-cell py-3  w-[20%]">
							Ward
						</th>
						{/* Hide on mobile, show on sm and up */}
						<th scope="col" className="hidden sm:table-cell py-3 w-[15%]">
							Action
						</th>
					</tr>
				</thead>
			</table>
			{/* The main scrollable list container */}
			<FixedSizeList
				height={containerHeight}
				itemCount={voters.length}
				itemSize={rowHeight} // Adjust based on row height
				width="100%"
				itemData={voters}
			>
				{/* The Row component now receives onUpdateVoter as a prop */}
				{({ index, style }) => (
					<Row index={index} style={style} data={voters} />
				)}
			</FixedSizeList>
		</motion.div>
	);
});

export default List;
