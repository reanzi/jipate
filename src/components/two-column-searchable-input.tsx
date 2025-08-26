"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useUrlState } from "@/hooks/use-url-state";
// import { useFilterModal } from "@/features/setup/state/use-filter-modal";

const frameworks = [
	{
		value: "next.js",
		label: "Next.js",
	},
	{
		value: "sveltekit",
		label: "SvelteKit",
	},
	{
		value: "nuxt.js",
		label: "Nuxt.js",
	},
	{
		value: "remix",
		label: "Remix",
	},
	{
		value: "astro",
		label: "Astro",
	},
];

export function TwoColumnSearchableInput({
	onSelect,
	options = frameworks,
}: {
	onSelect: (name: string) => void;
	options?: { value: string; label: string }[];
}) {
	// const onClose = useFilterModal((state) => state.onClose);
	const [{ centers: value }] = useUrlState();
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="relative w-full flex justify-start items-center z-20"
				>
					<span className="text-muted-foreground text-sm tracking-tight">
						Chaguo:
					</span>
					{value.toUpperCase()
						? options.find((option) => option.value === value.toUpperCase())
								?.label
						: "Kata zote"}
					{value ? (
						<span
							className="absolute right-0.5 h-7 ml-0 w-12 z-30 px-2 py-[5px] bg-destructive rounded-sm text-white"
							onClick={(e) => {
								// Stop the click event from propagating up to the parent PopoverTrigger
								e.stopPropagation();
								onSelect("");
								setOpen((prev) => !prev);
							}}
						>
							Futa
						</span>
					) : (
						<ChevronsUpDownIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="-ml-[20%] w-[140%] p-0">
				<Command>
					<CommandInput placeholder="Tafuta kata..." className="" />
					<CommandList>
						<CommandEmpty>Hakuna kata iliyopatikana</CommandEmpty>
						<CommandGroup>
							<div className="w-[100%] grid grid-cols-2 gap-1.5">
								{options.map((option) => (
									<CommandItem
										key={option.value}
										value={option.value}
										onSelect={(currentValue) => {
											const isSame = currentValue.toLowerCase() === value;
											onSelect(isSame ? "" : currentValue.toLowerCase());
											setOpen(false);
											// onClose();
										}}
									>
										<CheckIcon
											className={cn(
												"mr-2 h-4 w-4",
												value === option.value.toLowerCase()
													? "opacity-100"
													: "opacity-0",
											)}
										/>
										{option.label}
									</CommandItem>
								))}
								{/* <h2>option 1</h2>
								<h2>option 2</h2> */}
							</div>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
