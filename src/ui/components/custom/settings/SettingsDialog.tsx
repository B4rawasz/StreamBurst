import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SelectLabel } from "@radix-ui/react-select";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";

const SettingsDialog = () => {
	const [settings, setSettings] = useState<Settings | null>(null);
	const [newSettings, setNewSettings] = useState<Settings | null>(null);

	const { setTheme } = useTheme();

	const refreshSettings = async () => {
		const fetchedSettings = await window.electron.getSettings();
		setSettings(fetchedSettings);
		setNewSettings(fetchedSettings);
	};

	useEffect(() => {
		refreshSettings();
	}, []);

	return (
		<Dialog onOpenChange={(isOpen) => isOpen && refreshSettings()}>
			<DialogTrigger asChild>
				<Button size="icon" variant="ghost">
					<Settings />
				</Button>
			</DialogTrigger>
			<DialogContent
				className="max-h-[calc(100vh-2rem)] flex flex-col"
				onOpenAutoFocus={(e) => {
					e.preventDefault();
				}}
			>
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
				</DialogHeader>

				<div className="flex flex-row justify-center">
					<div className="flex flex-col gap-4 w-80">
						<div className="flex flex-row items-center justify-between">
							<span>Theme:</span>

							<Select
								value={newSettings?.theme}
								onValueChange={(value: "dark" | "light" | "system") =>
									setNewSettings({ ...newSettings, theme: value } as Settings)
								}
							>
								<SelectTrigger className="w-32">
									<SelectValue placeholder="Select theme" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Themes</SelectLabel>
										<SelectItem value="dark">Dark</SelectItem>
										<SelectItem value="light">Light</SelectItem>
										<SelectItem value="system">System</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>

						<div className="flex flex-row items-center justify-between">
							<span>Sidebar on hover:</span>
							<Switch
								checked={newSettings?.sidebarOnHover}
								onCheckedChange={(value) =>
									setNewSettings({
										...newSettings,
										sidebarOnHover: value,
									} as Settings)
								}
							/>
						</div>

						<div className="flex flex-row items-center justify-between">
							<span>Dev mode:</span>
							<Switch
								checked={newSettings?.devMode}
								onCheckedChange={(value) =>
									setNewSettings({
										...newSettings,
										devMode: value,
									} as Settings)
								}
							/>
						</div>
					</div>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button
							onClick={() => {
								if (newSettings !== null) {
									window.electron.setSettings(newSettings);

									if (settings?.theme !== newSettings.theme) {
										setTheme(newSettings.theme);
									}
								}
							}}
						>
							Save
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button variant="secondary">Cancel</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default SettingsDialog;
