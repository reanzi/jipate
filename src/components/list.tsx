import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Voter } from "@/types";
import { FixedSizeList } from "react-window"; // Import a windowing library

interface VoterListProps {
	voters: Voter[];
	onMarkUsed: (cardNumber: string, designation: string) => void;
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
			{/* Hide on mobile, show on sm and up */}
			{/* <div className="hidden sm:flex py-1 px-4 w-[10%]">
				<img
					src={voter.imageUrl}
					alt={`${voter.name}'s profile`}
					className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-500"
				/>
			</div> */}
			<div className="py-1 px-4 w-1/2 sm:w-[35%] font-medium text-gray-900 whitespace-nowrap dark:text-white truncate">
				{voter.name}
			</div>
			<div className="py-1 px-4 w-1/2 sm:w-[20%] truncate">
				{voter.cardNumber}
			</div>
			{/* Hide on mobile, show on sm and up */}
			<div className="hidden sm:flex py-1 px-4 w-[25%] truncate">
				{voter.station}
			</div>
			{/* Hide on mobile, show on sm and up */}
			<div className="hidden sm:flex py-1 px-4 w-[20%] border0l border-amber-300">
				<label className="flex items-center space-x-2">
					{/*
          <Checkbox
            checked={voter.used}
            onCheckedChange={() => onMarkUsed(voter.cardNumber, voter.station)}
            className="h-5 w-5"
          />
          */}
					{/* <input
						type="checkbox"
						checked={voter.used}
						onChange={() => onMarkUsed(voter.cardNumber, voter.station)}
						className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
					/> */}
				</label>
			</div>
		</div>
	);
};

const List: React.FC<VoterListProps> = ({ voters }) => {
	const windowSize = useWindowSize();
	const headerHeight = 168; // This value is derived from the pt-[180px] on the main content div in App.tsx
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
						<th scope="col" className="py-3 px-6 w-1/2 sm:w-[35%]">
							Full name
						</th>
						<th scope="col" className="py-3 px-6 w-1/2 sm:w-[20%]">
							Card Number
						</th>
						{/* Hide on mobile, show on sm and up */}
						<th scope="col" className="hidden sm:table-cell py-3 px-6 w-[25%]">
							Ward
						</th>
						{/* Hide on mobile, show on sm and up */}
						<th scope="col" className="hidden sm:table-cell py-3 px-6 w-[20%] ">
							Role
						</th>
					</tr>
				</thead>
			</table>
			<div style={{ height: containerHeight, overflow: "auto" }}>
				<FixedSizeList
					height={containerHeight}
					itemCount={voters.length}
					itemSize={rowHeight}
					width="100%"
					itemData={voters}
				>
					{Row}
				</FixedSizeList>
			</div>
		</motion.div>
	);
};

export default List;
