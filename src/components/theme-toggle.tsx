import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/theme";

export function ThemeToggle() {
	const { setTheme, theme } = useTheme();
	const toggleTheme = () => {
		setTheme(theme === "light" || theme === "system" ? "dark" : "light");
	};

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggleTheme}
			className="h-10 w-10"
		>
			<Sun className="h-[1.2rem] w-[1.2rem] scale-0  dark:scale-100 rotate-0 transition-all dark:-rotate-90 " />
			<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-100 dark:scale-0 rotate-0 transition-all  dark:rotate-90" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
