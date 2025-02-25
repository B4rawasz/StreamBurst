import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { MonitorCog } from "lucide-react";
import { useEffect, useState } from "react";

const OutputPage = () => {
	const pages = getPages();

	const settings = getSettings();
	const [newSettings, setNewSettings] = useState(settings);

	useEffect(() => {
		if (settings !== null) {
			setNewSettings(settings);
		}
	}, [settings]);

	return (
		<div className="h-full w-full flex flex-col">
			<span className="text-4xl font-bold flex items-center gap-4 p-4">
				<MonitorCog className="stroke-foreground h-12 w-12" />
				Output
			</span>

			<div className="w-full h-full grid grid-cols-2 px-4 pb-4 gap-4">
				<Card className="flex flex-col">
					<CardHeader>
						<CardTitle>Settings</CardTitle>
					</CardHeader>
					<CardContent className="grow grid grid-cols-[1fr_2fr] items-center gap-2">
						<div className="text-md font-bold">Profile:</div>
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Profile" />
							</SelectTrigger>
							<SelectContent>
								{pages?.map((page) => (
									<SelectItem key={page} value={page}>
										{page}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<div className="text-md font-bold">Port:</div>
						<Input
							type="number"
							placeholder="0000"
							value={newSettings?.servicePort}
							onChange={(e) => {
								setNewSettings(
									newSettings && {
										...newSettings,
										servicePort: Number(e.target.value),
									}
								);
							}}
						/>
					</CardContent>
					<CardFooter className="flex flex-row justify-end gap-4 ">
						<Button variant="secondary">Copy URL</Button>
						<Button>Save</Button>
					</CardFooter>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Preview</CardTitle>
					</CardHeader>
					<CardContent>bbb</CardContent>
				</Card>
				<Card className="col-span-2">
					<CardHeader>
						<CardTitle>Test payload</CardTitle>
					</CardHeader>
					<CardContent>ccc</CardContent>
				</Card>
			</div>
		</div>
	);
};

function getPages() {
	const [pages, setPages] = useState<string[] | null>(null);

	useEffect(() => {
		(async () => {
			setPages(await window.electron.getPages());
		})();
	}, []);

	return pages;
}

function getSettings() {
	const [settings, setSettings] = useState<Settings | null>(null);

	useEffect(() => {
		(async () => {
			setSettings(await window.electron.getSettings());
		})();
	}, []);

	return settings;
}

export default OutputPage;
