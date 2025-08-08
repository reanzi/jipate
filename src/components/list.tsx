import React from "react";
import { motion } from "framer-motion";
import type { Voter } from "@/types";
import { FixedSizeList } from "react-window"; // Import a windowing library

interface VoterListProps {
	voters: Voter[];
	onMarkUsed: (cardNumber: string, designation: string) => void;
}

// Define the Row component for react-window
const Row = ({
	index,
	style,
	data,
}: {
	index: number;
	style: React.CSSProperties;
	data: Voter[];
}) => {
	const voter = data[index];
	if (!voter) return null;

	return (
		<div
			style={style}
			className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center"
		>
			<div className="py-1 px-4 w-[10%]">
				<img
					src={voter.imageUrl}
					alt={`${voter.name}'s profile`}
					className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-500"
				/>
			</div>
			<div className="py-1 px-4 w-[25%] font-medium text-gray-900 whitespace-nowrap dark:text-white truncate">
				{voter.name}
			</div>
			<div className="py-1 px-4 w-[20%] truncate">{voter.cardNumber}</div>
			<div className="py-1 px-4 w-[25%] truncate">{voter.station}</div>
			<div className="py-1 px-4 w-[20%] flex justify-center items-center">
				{/* Checkbox or status indicator */}
			</div>
		</div>
	);
};

const List: React.FC<VoterListProps> = ({ voters }) => {
	// Determine the row height and a container height for the virtualizer
	const rowHeight = 50; // Approximate height of a row
	const containerHeight = 500; // Fixed height for the list container

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
						<th scope="col" className="py-3 px-6 w-[10%]">
							Image
						</th>
						<th scope="col" className="py-3 px-6 w-[25%]">
							Name
						</th>
						<th scope="col" className="py-3 px-6 w-[20%]">
							Card Number
						</th>
						<th scope="col" className="py-3 px-6 w-[25%]">
							Station
						</th>
						<th scope="col" className="py-3 px-6 text-center w-[20%]">
							Status
						</th>
					</tr>
				</thead>
			</table>
			<FixedSizeList
				height={containerHeight}
				itemCount={voters.length}
				itemSize={rowHeight}
				width="100%"
				itemData={voters}
				className="overflow-x-hidden" // Hide horizontal scrollbar
			>
				{Row}
			</FixedSizeList>
		</motion.div>
	);
};

export default List;
