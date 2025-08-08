"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import useMeasure from "react-use-measure";

export function ResizablePanel({
	children,
}: {
	children: React.ReactNode;
	id?: string;
}) {
	const [ref, { height }] = useMeasure();

	return (
		<motion.div
			animate={{ height: height || "auto" }}
			className="relative overflow-hidden w-full"
		>
			<AnimatePresence initial={false}>
				<motion.div
					// layout={'preserve-aspect'}
					key={JSON.stringify(children, ignoreCircularReferences())}
					initial={{
						// x: 384,
						opacity: 0,
					}}
					animate={{
						// x: 0,
						opacity: 1,
						// transition: { duration: duration / 2, delay: duration / 2 },
					}}
					exit={{
						// x: -384,
						opacity: 0,
						// transition: { duration: duration / 2 },
					}}
					className={cn("w-full", height ? "absolute" : "relative")}
				>
					<div ref={ref} className="w-full ">
						{children}
					</div>
				</motion.div>
			</AnimatePresence>
		</motion.div>
	);
}

const ignoreCircularReferences = () => {
	const seen = new WeakSet();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (key: any, value: any) => {
		if (key.startsWith("_")) return; // Don't compare React's internal props.
		if (typeof value === "object" && value !== null) {
			if (seen.has(value)) return;
			seen.add(value);
		}
		return value;
	};
};
