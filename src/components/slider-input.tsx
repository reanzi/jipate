import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import React, { useState } from "react";

type SliderProps = React.ComponentProps<typeof Slider>;

interface SliderInputProps extends SliderProps {
	value?: number[];
	onValueChange?: (value: number[]) => void;
}

export function SliderInput({ className, ...props }: SliderInputProps) {
	// Use internal state if no value/onValueChange props are provided
	const [localValue, setLocalValue] = useState<number[]>([500]);

	// Determine the value and onValueChange handler to use
	const currentValue = props.value !== undefined ? props.value : localValue;
	const handleValueChange = props.onValueChange || setLocalValue;

	// Format the number with commas for better readability
	const formattedValue = new Intl.NumberFormat().format(currentValue[0]);

	return (
		<>
			<Slider
				value={currentValue}
				onValueChange={handleValueChange}
				max={500000}
				step={100}
				min={500}
				className={cn(
					"w-[60%] relative",
					// Use highly specific selectors to override shadcn/ui's default styling.
					// This targets the specific `div`s that make up the track, range, and thumb.
					"[&>span]:bg-blue-200 dark:[&>span]:bg-blue-900", // Styles the track background
					"[&>span>span]:bg-blue-600 dark:[&>span>span]:bg-blue-400", // Styles the range fill
					"[&>span>span>span]:bg-blue-600 dark:[&>span>span>span]:bg-blue-400 [&>span>span>span]:border-2 [&>span>span>span]:border-blue-600 dark:[&>span>span>span]:border-blue-400", // Styles the thumb
					className,
				)}
				{...props}
			/>
			<span className="absolute bottom-2 left-[25%] text-center text-blue-600 dark:text-blue-300 font-semibold">
				Default mount: {formattedValue}
			</span>
		</>
	);
}
