import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { DialogClose } from "@radix-ui/react-dialog";
import { Puzzle, Settings } from "lucide-react";
import { useEffect, useState } from "react";

const Test = () => {
	return (
		<Card className=" flex-grow flex flex-col">
			<CardHeader>
				<CardTitle>CS2</CardTitle>
				<CardDescription>Lorem ipsum.</CardDescription>
			</CardHeader>
			<CardContent className="flex-grow flex">
				<ScrollArea className="max-h-24 shrink">
					<span>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at
						condimentum est. Curabitur varius ligula nibh, scelerisque feugiat
						risus mattis quis. Vivamus consectetur condimentum eleifend. Aliquam
						iaculis velit quis ligula varius, sed placerat nisl interdum.
						Suspendisse potenti. Nulla ornare magna libero, ac maximus tellus
						dictum sit amet.
					</span>
				</ScrollArea>
			</CardContent>
			<CardFooter className="flex justify-end">
				<Switch id="cs2" />
			</CardFooter>
		</Card>
	);
};

const ModulesPage = () => {
	const modules = getModules();

	console.log(modules);

	return (
		<div className="h-full w-full flex flex-col">
			<span className="text-4xl font-bold flex items-center gap-4 p-4">
				<Puzzle className="stroke-foreground h-12 w-12" />
				Modules
			</span>

			<ScrollArea>
				<div className="grid grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))] gap-4 px-4 pb-4">
					{modules?.map((module) => (
						<ModuleCard module={module} key={module.package.name} />
					))}
				</div>
			</ScrollArea>
		</div>
	);
};

const ModuleCard = ({ module }: { module: ModuleInfo }) => {
	const [enabled, setEnabled] = useState(module.enabled);
	return (
		<Card className="flex-grow flex flex-col">
			<CardHeader>
				<CardTitle>{module.package.name}</CardTitle>
				<CardDescription className="flex flex-row justify-between">
					<span>{module.package.version}</span>
					<span>{module.package.author}</span>
				</CardDescription>
			</CardHeader>
			<CardContent className="flex-grow flex">
				<ScrollArea className="max-h-24 shrink">
					<span>{module.package.description}</span>
				</ScrollArea>
			</CardContent>
			<CardFooter className="flex justify-between">
				<ModuleSettings module={module} />
				<Switch
					checked={enabled}
					onCheckedChange={(e) => {
						setEnabled(e);
						window.electron.changeModuleState(module.package.name, e);
					}}
				/>
			</CardFooter>
		</Card>
	);
};

const ModuleSettings = ({ module }: { module: ModuleInfo }) => {
	const [newSettings, setNewSettings] = useState<{
		[key: string]: ModuleSettingsProperty;
	}>(module.settings.settings);

	return (
		<Dialog>
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
					<DialogTitle>{module.package.name}</DialogTitle>
					<DialogDescription className="flex flex-row justify-between">
						<span>{module.package.version}</span>
						<span>{module.package.author}</span>
					</DialogDescription>
				</DialogHeader>
				<ScrollArea className="flex-1 h-1 overflow-y-auto">
					<div className="flex flex-col gap-4">
						{Object.entries(newSettings).map(([key, value]) => {
							return (
								<ModuleSettingsInput
									valueKey={key}
									value={value}
									setNewSettings={setNewSettings}
									key={key}
								/>
							);
						})}
					</div>
				</ScrollArea>
				<DialogFooter>
					<DialogClose asChild>
						<Button
							type="submit"
							onClick={() => {
								module.settings.settings = newSettings;
								window.electron.applySettings(module);
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

const ModuleSettingsInput = ({
	valueKey,
	value,
	setNewSettings,
}: {
	valueKey: string;
	value: ModuleSettingsProperty;
	setNewSettings: React.Dispatch<
		React.SetStateAction<{ [key: string]: ModuleSettingsProperty }>
	>;
}) => {
	return (
		<div className="flex flex-row gap-2 items-center justify-between px-1">
			<div className="text-md font-bold">{valueKey}:</div>
			<HoverCard>
				<HoverCardTrigger>
					{typeof value.value === "string" && (
						<Input
							type="text"
							value={value.value}
							onChange={(e) =>
								setNewSettings((prev) => ({
									...prev,
									[valueKey]: { ...value, value: e.target.value },
								}))
							}
						/>
					)}
					{typeof value.value === "number" && (
						<Input
							type="number"
							value={value.value}
							onChange={(e) =>
								setNewSettings((prev) => ({
									...prev,
									[valueKey]: { ...value, value: e.target.value },
								}))
							}
						/>
					)}
					{typeof value.value === "boolean" && (
						<Switch
							checked={value.value}
							onCheckedChange={(e) =>
								setNewSettings((prev) => ({
									...prev,
									[valueKey]: { ...value, value: e },
								}))
							}
						/>
					)}
				</HoverCardTrigger>
				<HoverCardContent side="left">{value.description}</HoverCardContent>
			</HoverCard>
		</div>
	);
};

function getModules() {
	const [modules, setModules] = useState<ModuleInfo[] | null>(null);

	useEffect(() => {
		(async () => {
			setModules(await window.electron.getModules());
		})();
	}, []);

	return modules;
}

export default ModulesPage;
