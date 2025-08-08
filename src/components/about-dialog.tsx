import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InfoIcon, XIcon } from "lucide-react";

interface MarkdownDialogProps {
	markdownContent: string;
	buttonText?: string;
	buttonIcon?: React.ReactNode;
	dialogTitle?: string;
}

/**
 * A simple utility function to convert a Markdown string to JSX.
 * It handles headings, list items, and bold text.
 * @param markdown The markdown string to render.
 * @returns JSX.Element[]
 */
const renderMarkdown = (markdown: string) => {
	return markdown.split("\n").map((line, index) => {
		// Render headings
		if (line.startsWith("# ")) {
			return (
				<h2 key={index} className="text-3xl font-bold mt-4 mb-2">
					{line.substring(2)}
				</h2>
			);
		}
		if (line.startsWith("### ")) {
			return (
				<h3 key={index} className="text-xl font-semibold mt-4 mb-2">
					{line.substring(4)}
				</h3>
			);
		}
		// Render list items
		if (line.startsWith("* ")) {
			return (
				<li key={index} className="ml-6 list-disc">
					{line.substring(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}
				</li>
			);
		}
		// Render ordered list items
		if (line.match(/^\d+\. /)) {
			return (
				<li key={index} className="ml-6 list-decimal">
					{line.substring(2)}
				</li>
			);
		}
		// Render bold text
		const boldRegex = /\*\*(.*?)\*\*/g;
		const parts = line.split(boldRegex);
		const renderedLine = parts.map((part, i) => {
			if (i % 2 === 1) {
				return <strong key={i}>{part}</strong>;
			}
			return part;
		});

		// Render paragraphs and other lines
		return (
			<p key={index} className="mb-2 leading-relaxed">
				{renderedLine}
			</p>
		);
	});
};

/**
 * A reusable component to display a markdown document in a modal dialog.
 * It includes a trigger button at the bottom-right of the screen.
 * @param markdownContent The string content to display in markdown format.
 * @param buttonText The text to display on the trigger button. Defaults to 'Open'.
 * @param buttonIcon An optional icon for the button. Defaults to InfoIcon.
 * @param dialogTitle An optional title for the dialog, which defaults to the first h1 heading in the markdown.
 */
export const MarkdownDialog: React.FC<MarkdownDialogProps> = ({
	markdownContent,
	buttonText = "Open",
	buttonIcon = <InfoIcon className="h-6 w-6" />,
	dialogTitle,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	// Extract the title from the markdown content if not provided
	const title =
		dialogTitle ||
		markdownContent
			.split("\n")
			.find((line) => line.startsWith("# "))
			?.substring(2);

	return (
		<>
			{/* Trigger Button */}
			<motion.button
				className="fixed bottom-4 right-4 z-50 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				onClick={() => setIsOpen(true)}
				aria-label={buttonText}
			>
				{buttonIcon}
			</motion.button>

			{/* The Dialog component itself */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0, y: -50 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							exit={{ scale: 0.9, opacity: 0, y: -50 }}
							transition={{ type: "spring", stiffness: 260, damping: 20 }}
							className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 rounded-xl shadow-2xl m-4"
						>
							{/* Close button */}
							<button
								className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
								onClick={() => setIsOpen(false)}
								aria-label="Close"
							>
								<XIcon className="h-5 w-5" />
							</button>

							{/* Header and Content */}
							<div className="prose dark:prose-invert">
								{title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
								{renderMarkdown(markdownContent)}
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};
