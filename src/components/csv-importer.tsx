// import React, { useState } from "react";
// import { useAction } from "convex/react";
// import Papa from "papaparse";
// import { api } from "../../convex/_generated/api";
// import { ConvexError } from "convex/values";
// import { useUrlState } from "@/hooks/use-url-state";
// import type { Id } from "convex/_generated/dataModel";

// export type RawVoter = {
// 	region: string;
// 	council: string;
// 	constituency: string;
// 	ward: string;
// 	voter_id: string;
// 	firstname: string;
// 	middlename: string;
// 	surname: string;
// 	date_of_birth: string;
// };
// // This is a simple client-side function to parse the uploaded CSV file using PapaParse.
// const parseCsv = (file: File): Promise<RawVoter[]> => {
// 	return new Promise((resolve, reject) => {
// 		Papa.parse(file, {
// 			header: true,
// 			skipEmptyLines: true,
// 			transformHeader: (header) => header.trim().toLowerCase(),
// 			complete: (results) => {
// 				if (results.errors.length > 0) {
// 					console.error("PapaParse errors:", results.errors);
// 					reject(new Error("Failed to parse CSV file."));
// 				} else {
// 					// Map the parsed data to match the Convex schema fields
// 					// eslint-disable-next-line @typescript-eslint/no-explicit-any
// 					const voters = results.data.map((voter: any) => ({
// 						region: voter["region"],
// 						council: voter["council"],
// 						constituency: voter["constituency"],
// 						ward: voter["ward"],
// 						voter_id: voter["voter_id"],
// 						firstname: voter["firstname"],
// 						middlename: voter["middlename"],
// 						surname: voter["surname"],
// 						date_of_birth: voter["date_of_birth"],
// 					}));
// 					resolve(voters);
// 				}
// 			},
// 			error: (error) => {
// 				reject(error);
// 			},
// 		});
// 	});
// };

// export function CSVImporter() {
// 	const [csvFile, setCsvFile] = useState<File | null>(null);
// 	const [loading, setLoading] = useState(false);
// 	const [message, setMessage] = useState("");

// 	const [{ facilityId }] = useUrlState();

// 	// Use the Convex `useAction` hook to get the bulkInsertVoters function
// 	const bulkInsertVoters = useAction(api.voters.bulkInsertVoters);

// 	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		const file = e.target.files?.[0];
// 		if (file && file.type === "text/csv") {
// 			setCsvFile(file);
// 			setMessage(`File selected: ${file.name}`);
// 		} else {
// 			setCsvFile(null);
// 			setMessage("Please select a valid CSV file.");
// 		}
// 	};

// 	const handleImport = async () => {
// 		if (!csvFile) {
// 			setMessage("Please select a file to import.");
// 			return;
// 		}

// 		setLoading(true);
// 		setMessage(`Importing file: ${csvFile.name}. This may take a few moments.`);

// 		try {
// 			const votersToSave = await parseCsv(csvFile);

// 			if (votersToSave.length === 0) {
// 				setMessage("No valid data to import.");
// 				setLoading(false);
// 				return;
// 			}

// 			await bulkInsertVoters({
// 				voters: votersToSave,
// 				facilityId: facilityId as Id<"facilities">,
// 			});

// 			setMessage(
// 				`Successfully started the import of ${votersToSave.length} voters. This may take a few moments.`,
// 			);
// 			setCsvFile(null); // Clear the selected file after successful import
// 		} catch (error) {
// 			const errorMessage =
// 				error instanceof ConvexError
// 					? (error.data as { message: string }).message
// 					: "Unexpected error occured.";
// 			console.error("Failed to import voters:", error);
// 			setMessage(`Error importing data: ${errorMessage}`);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return (
// 		<div className="p-8 max-w-2xl mx-auto font-sans bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-50">
// 			<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
// 			<h1 className="text-3xl font-bold text-center mb-6">
// 				Import Voter Data to Convex
// 			</h1>
// 			<p className="text-center mb-6 text-gray-600 dark:text-gray-400">
// 				Upload your CSV file below to save it to your Convex database.
// 			</p>

// 			<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
// 				<div className="flex flex-col items-center justify-center p-4 mb-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
// 					<label htmlFor="file-upload" className="cursor-pointer">
// 						<svg
// 							xmlns="http://www.w3.org/2000/svg"
// 							className="h-12 w-12 text-gray-400 dark:text-gray-500"
// 							fill="none"
// 							viewBox="0 0 24 24"
// 							stroke="currentColor"
// 							strokeWidth="2"
// 						>
// 							<path
// 								strokeLinecap="round"
// 								strokeLinejoin="round"
// 								d="M7 16a4 4 0 01-4-4V5a4 4 0 014-4h10a4 4 0 014 4v7a4 4 0 01-4 4m-8-8l-4 4m0-4l4 4m4-4h.01m4 4h.01M9 13v6m0 0l-3-3m3 3l3-3"
// 							/>
// 						</svg>
// 						<span className="mt-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
// 							Click to select a CSV file
// 						</span>
// 					</label>
// 					<input
// 						id="file-upload"
// 						type="file"
// 						className="sr-only"
// 						accept=".csv"
// 						onChange={handleFileChange}
// 					/>
// 					{csvFile && (
// 						<p className="mt-2 text-sm text-center font-semibold text-gray-900 dark:text-gray-50">
// 							Selected: {csvFile.name}
// 						</p>
// 					)}
// 				</div>

// 				<button
// 					onClick={handleImport}
// 					disabled={!csvFile || loading}
// 					className="w-full flex justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl shadow-md transition duration-200"
// 				>
// 					{loading ? (
// 						<>
// 							<svg
// 								className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
// 								xmlns="http://www.w3.org/2000/svg"
// 								fill="none"
// 								viewBox="0 0 24 24"
// 							>
// 								<circle
// 									className="opacity-25"
// 									cx="12"
// 									cy="12"
// 									r="10"
// 									stroke="currentColor"
// 									strokeWidth="4"
// 								></circle>
// 								<path
// 									className="opacity-75"
// 									fill="currentColor"
// 									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
// 								></path>
// 							</svg>
// 							Importing...
// 						</>
// 					) : (
// 						"Import Data to Convex"
// 					)}
// 				</button>

// 				{message && (
// 					<div className="mt-4 p-4 rounded-xl text-center text-sm font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
// 						{message}
// 					</div>
// 				)}
// 			</div>
// 		</div>
// 	);
// }
