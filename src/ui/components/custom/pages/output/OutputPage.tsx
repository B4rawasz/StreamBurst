import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MonitorCog } from "lucide-react";
import { useEffect, useState } from "react";

const OutputPage = () => {
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

			<div className="w-full h-full grid grid-cols-2 px-4 pb-4 gap-4 grid-rows-[auto_1fr]">
				<Card className="flex flex-col">
					<CardHeader>
						<CardTitle>Settings</CardTitle>
					</CardHeader>
					<CardContent className="grow grid grid-cols-[1fr_2fr] items-center gap-2">
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
						<Button
							variant="secondary"
							onClick={() => {
								if (settings !== null) {
									setNewSettings(settings);
								}
							}}
						>
							Cancel
						</Button>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button>Save</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you sure?</AlertDialogTitle>
									<AlertDialogDescription>
										You will have to update all your overlays manually!
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => {
											if (newSettings !== null) {
												window.electron.setSettings(newSettings);
											}
										}}
									>
										Continue
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</CardFooter>
				</Card>
				<Card className="row-span-2">
					<CardHeader>
						<CardTitle>Test payload</CardTitle>
					</CardHeader>
					<CardContent>ccc</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Tools</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-2 items-center">
						<Input
							className="w-full"
							value={
								'<script src="http://localhost/stream_burst.js:' +
								newSettings?.servicePort +
								'" defer></script>'
							}
						></Input>
						<Button
							variant="secondary"
							onClick={() => {
								navigator.clipboard.writeText(
									'<script src="http://localhost/stream_burst.js:' +
										newSettings?.servicePort +
										'" defer></script>'
								);
							}}
						>
							Copy snippet
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

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
