import Papa from "papaparse";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useStoreData } from "@/hooks/use-store-data";
import { Button } from "./ui/button";
import { SliderInput } from "@/components/slider-input";
import { generateData, transformData } from "@/utils/generate-data";
import { Loader2Icon } from "lucide-react"; // Import a loading icon
import { toast } from "sonner";
import { useVerificationModal } from "@/hooks/use-verification";

export const InitialData = () => {
	// Get the state setter from the Zustand store
	const { setAppState } = useStoreData();
	// State for the slider value, initialized to 500 records
	const [amount, setAmount] = useState<number[]>([500]);
	// New state to manage the loading status
	const [isGenerating, setIsGenerating] = useState(false);
	const isOpen = useVerificationModal((state) => state.isOpen);
	const onClose = useVerificationModal((state) => state.onClose);

	useEffect(() => {
		if (isOpen) {
			onClose();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	// Handle file upload and parsing
	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		// if (!facilityName) {
		// 	toast("Missing field", {
		// 		description: "Please provide your facility's name.",
		// 		action: {
		// 			label: "Undo",
		// 			onClick: () => console.log("Undo"),
		// 		},
		// 	});
		// 	return;
		// }
		if (!file) {
			toast("Missing field", {
				description: "Please provide your facility's name.",
				action: {
					label: "Undo",
					onClick: () => console.log("Undo"),
				},
			});
			return;
		}
		Papa.parse(file, {
			header: true,
			complete: (results) => {
				// Cast results data to the Voter array type
				const parsedData = transformData(results.data);
				// Set the app state with the parsed data in "DRIVE" mode
				// console.log("UPLOADED DATA: ", JSON.stringify(parsedData, null, 2));
				setAppState({
					mode: "DRIVE",
					data: parsedData,
					facility: "bagamoyo",
				});
			},
			error: (error) => {
				console.error("Error parsing file:", error);
			},
		});
	};

	// Optimized function to handle generating mock data
	const handleGenerateData = () => {
		// Set the loading state to true immediately
		setIsGenerating(true);

		// Use setTimeout to defer the heavy data generation to a microtask,
		// which prevents the UI from freezing. This allows the loading spinner
		// to render before the generation starts.
		setTimeout(() => {
			try {
				// Generate mock data using the current slider value
				const mockData = generateData(amount[0]);
				// Set the app state with the generated data in "TEST" mode
				setAppState({
					mode: "TEST",
					data: mockData,
					facility: "bagamoyo",
				});
			} catch (error) {
				console.error("Error generating mock data:", error);
			} finally {
				// Ensure the loading state is turned off, regardless of success or failure
				setIsGenerating(false);
			}
		}, 0);
	};

	return (
		<motion.div
			initial={{ scale: 0.8, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ type: "spring", stiffness: 120 }}
			className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-xl min-h-[400px]"
		>
			<p className="mb-4 text-center">
				Please upload an Excel/CSV file or generate test data to begin.
			</p>

			{/* Conditionally render the loading UI or the main content */}
			{isGenerating ? (
				<div className="flex flex-col items-center justify-center space-y-4">
					<motion.div
						initial={{ rotate: 0 }}
						animate={{ rotate: 360 }}
						transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
					>
						<Loader2Icon className="w-10 h-10 text-blue-500 animate-spin" />
					</motion.div>
					<p className="text-lg">
						Generating {new Intl.NumberFormat().format(amount[0])} records...
					</p>
				</div>
			) : (
				<>
					<div className="flex flex-col space-y-8 mx-auto">
						<input
							type="file"
							onChange={handleFileUpload}
							accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
							className="mx-auto file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-700 dark:file:text-blue-50 dark:hover:file:bg-blue-600"
						/>
					</div>
					<div className="relative w-full h-px my-8 bg-gray-300 dark:bg-gray-700">
						<span className="text-sm bg-gray-300 dark:bg-gray-700 p-2 rounded-full absolute left-1/2 -translate-x-1/2 -top-4 text-muted-foreground dark:text-gray-300">
							OR
						</span>
					</div>
					<div className="text-center w-full max-w-sm mx-auto space-y-4">
						<p>Generate mock data for testing</p>
						<SliderInput
							defaultValue={[500]}
							max={500000}
							min={500}
							step={100}
							value={amount}
							onValueChange={setAmount}
						/>
						<Button
							onClick={handleGenerateData}
							className="w-full"
							disabled={!amount.length || amount[0] < 500}
						>
							Generate {new Intl.NumberFormat().format(amount[0])} Records
						</Button>
					</div>
				</>
			)}
		</motion.div>
	);
};
