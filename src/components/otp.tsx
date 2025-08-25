import { useEffect, useState } from "react";

// Shadcn UI Components (assuming you have them installed and configured)
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useStoreData } from "@/hooks/use-store-data";
import { useVerificationModal } from "@/hooks/use-verification";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { OTPInput } from "./enter-verification-code";

export const OTPDialog = () => {
	const { setAuthId, authId } = useStoreData();
	const onClose = useVerificationModal((state) => state.onClose);
	const onOpen = useVerificationModal((state) => state.onOpen);
	const isOpen = useVerificationModal((state) => state.isOpen);
	const [checking, setChecking] = useState(false);
	const [canReset, setCanReset] = useState(false);
	const verify = useMutation(api.access.checkPin);

	const { signIn } = useAuthActions();

	async function onComplete(data: string) {
		setChecking(true);
		const promise = await verify({ pin: data });

		if (promise) {
			setChecking(false);

			handleAnonymousSignIn();
			setAuthId();
			setCanReset(true);
			onClose();
		}
		if (!promise) {
			setChecking(false);
			toast.error("No your luck.", {
				description: "Invalid or expired Invitation code.",
			});
		}
	}

	// A handler to perform the sign-in action with toasts
	const handleAnonymousSignIn = async () => {
		// We'll wrap the sign-in promise in sonner's toast.promise()
		// eslint-disable-next-line no-async-promise-executor
		const signInPromise = new Promise(async (resolve, reject) => {
			try {
				signIn("anonymous");

				resolve("Sign-in successful!");
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (error) {
				reject(new Error("Failed to sign in. Please try again."));
			}
		});
		toast.promise(signInPromise, {
			loading: "Signing in... ⏳",
			description: "We are setting your tables right 🫣",
			success: () => {
				toast.success("Congratulations! 🎉", {
					description: "You are all set. Have fun. 🤟",
				});
				return "Done"; // A simple return value to resolve the promise
			},
			error: () => {
				toast.error("Login Failed 😢", {
					description: "Something went wrong while signing you in.",
				});
				return "Done"; // A simple return value to resolve the promise
			},
		});

		await signInPromise.finally(() => {});
	};

	useEffect(() => {
		if (!authId && !isOpen) {
			onOpen();
		}
	}, [authId, isOpen, onOpen]);
	return (
		<>
			{/* OTP Verification Dialog */}
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="bg-card text-card-foreground p-6 rounded-lg shadow-lg">
					<DialogHeader className="text-start">
						<DialogTitle className="text-left text-2xl font-bold text-foreground">
							Invite Code
						</DialogTitle>
						<DialogDescription className="text-muted-foreground">
							Please enter one-time 6-digit code you got.
						</DialogDescription>
					</DialogHeader>
					<div className="flex items-center justify-center py-8">
						<OTPInput
							onComplete={onComplete}
							isChecking={checking}
							reset={canReset}
						/>
					</div>
					<div className="text-center text-sm text-muted-foreground mt-4">
						Didn&apos;t receive the code?
						<span className=" block sm:inline sm:ml-4 text-primary hover:text-accent-foreground p-0 h-auto">
							Ask for help.
						</span>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};
