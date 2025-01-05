import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Puzzle } from "lucide-react";

const Test = () => {
	return (
		<Card className=" flex-grow">
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
	return (
		<div className="h-full w-full flex flex-col">
			<span className="text-4xl font-bold flex items-center gap-4 p-4">
				<Puzzle className="stroke-foreground h-12 w-12" />
				Modules
			</span>

			<ScrollArea>
				<div className="grid grid-cols-[repeat(auto-fill,_minmax(320px,_1fr))] gap-4 px-4 pb-4">
					<Test />
					<Card className="flex-grow flex flex-col">
						<CardHeader>
							<CardTitle>CS2</CardTitle>
							<CardDescription>Lorem ipsum.</CardDescription>
						</CardHeader>
						<CardContent className="flex-grow flex">
							<ScrollArea className="max-h-24 shrink">
								<span>Lorem ipsum dolor</span>
							</ScrollArea>
						</CardContent>
						<CardFooter className="flex justify-end">
							<Switch id="cs2" />
						</CardFooter>
					</Card>
				</div>
			</ScrollArea>
		</div>
	);
};

export default ModulesPage;
