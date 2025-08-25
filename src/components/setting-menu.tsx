import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import { useStoreData } from "@/hooks/use-store-data";
import {
	CogIcon,
	ReceiptTextIcon,
	SendHorizonalIcon,
	Trash2Icon,
} from "lucide-react";

export function SettingMenu() {
	const { resetStore } = useStoreData();
	const [ConfirmDialog, confirm] = useConfirm(
		"Anza upya?",
		"Hii itafuta data yote inayotumiwa na programu hii, utapoteza hata uhariri wako wote. Hili haliwezi kutenduliwa. Una uhakika?",
	);

	const handleGenerateTestData = () => {};
	const handleDataExport = () => {};
	const handleApplicationReset = async () => {
		const ok = await confirm();
		if (!ok) {
			return;
		}
		// TODO:: Handle reset
		resetStore();
	};
	return (
		<>
			<ConfirmDialog />
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost">
						<CogIcon />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end">
					<DropdownMenuLabel>Settings</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						{/* TEST MODE=TRUE */}
						<DropdownMenuItem disabled={false} onClick={handleGenerateTestData}>
							<ReceiptTextIcon />
							Generate data
							<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuItem onClick={handleDataExport}>
							<SendHorizonalIcon />
							Export data
							<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						variant="destructive"
						onClick={handleApplicationReset}
					>
						<Trash2Icon />
						Reset application
						<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
