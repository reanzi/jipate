// --- enter-verification-code.tsx ---
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

// declare type for the props

type InputProps = {
	onComplete: (pin: string) => void;
	isChecking?: boolean;
	length?: number;
	reset: boolean;
};

export const OTPInput = ({
	isChecking,
	length = 6,
	onComplete,
	reset,
}: InputProps) => {
	// if you're not using Typescript, simply do const inputRef = useRef()

	const inputRef = useRef<HTMLInputElement[]>(Array(length).fill(null));

	// if you're not using Typescript, do useState()
	const [OTP, setOTP] = useState<string[]>(Array(length).fill(""));

	const handleTextChange = (input: string, index: number) => {
		const newPin = [...OTP];
		const uppercaseInput = input.toUpperCase(); // Convert input to uppercase
		newPin[index] = uppercaseInput;
		setOTP(newPin);

		// check if the user has entered a character and if the previous input is not empty before focusing on the next one
		if (
			uppercaseInput.length === 1 &&
			index < length - 1 &&
			newPin[index - 1] !== ""
		) {
			inputRef.current[index + 1]?.focus();
		}

		if (uppercaseInput.length === 0 && index > 0) {
			inputRef.current[index - 1]?.focus();
		}

		// if the user has entered all the digits, grab the digits and set as an argument to the onComplete function.

		if (newPin.every((digit) => digit !== "")) {
			onComplete(newPin.join(""));
		}
	};

	// New function to handle manual clicks on the input fields
	const handleInputClick = (index: number) => {
		// Find the first empty input field before the clicked index
		const firstEmptyIndex = OTP.findIndex(
			(digit, i) => i < index && digit === "",
		);

		// If an empty field is found, focus on it. Otherwise, do nothing.
		if (firstEmptyIndex !== -1) {
			inputRef.current[firstEmptyIndex]?.focus();
		}
	};

	useEffect(() => {
		setOTP(Array(length).fill(""));
	}, [reset, length]);
	return (
		<div
			className={cn(
				"flex items-center space-x-1 sm:space-x-2",
				length === 6 ? "space-x-1" : "space-x-2",
			)}
		>
			{Array.from({ length }, (_, index) => (
				<div className="relative " key={index}>
					<input
						type="text"
						maxLength={1}
						value={OTP[index]}
						onChange={(e) => handleTextChange(e.target.value, index)}
						onClick={() => handleInputClick(index)} // Add the new onClick handler
						ref={(ref) => {
							if (ref) {
								inputRef.current[index] = ref as HTMLInputElement;
							}
						}}
						className={cn(
							`h-12 w-10 sm:h-16 sm:w-16 bg-transparent border border-primary/30 focus:border-primary sm:p-5 outline-none text-center font-extrabold rounded-md transition-all duration-300 ease-in-out`,
							isChecking && "text-transparent",
						)}
					/>
					{isChecking && (
						<div
							className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground`}
						>
							<RandomInt />
						</div>
					)}
				</div>
			))}
		</div>
	);
};

const RandomInt = () => {
	const [number, setNumber] = useState<string>("0");
	function logNumberEvery10ms() {
		const intervalId = setInterval(() => {
			// const randomNumber = Math.floor(Math.random() * 10);
			const randomString = Math.random()
				.toString(36)
				.substring(5, 6)
				.toUpperCase();
			setNumber(randomString);
		}, 50); // Execute every 10 milliseconds

		// Return a function to clear the interval when needed
		return () => clearInterval(intervalId);
	}

	useEffect(() => {
		const stopLogging = logNumberEvery10ms();

		// Cleanup function to stop logging when component unmounts
		return () => stopLogging();
	}, []);
	return <>{number}</>;
};
