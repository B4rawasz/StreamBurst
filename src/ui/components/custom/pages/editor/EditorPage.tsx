import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PencilRuler } from "lucide-react";
import { useEffect, useState } from "react";

const EditorPage = () => {
	const pages = getPages();

	return (
		<div className="h-full w-full flex flex-col">
			<span className="text-4xl font-bold flex items-center gap-4 p-4">
				<PencilRuler className="stroke-foreground h-12 w-12" />
				Edit
			</span>

			<ScrollArea>
				<div className="flex flex-col gap-4 px-4 pb-4">
					{pages?.map((page) => (
						<PageCard pageName={page} key={page} />
					))}
				</div>
			</ScrollArea>
		</div>
	);
};

const PageCard = ({ pageName }: { pageName: string }) => {
	return (
		<Card>
			<CardHeader className="py-2 pr-2">
				<CardTitle className="flex flex-row justify-between items-center">
					{pageName}
					<Button className="m-0 mt-0">Edit</Button>
				</CardTitle>
			</CardHeader>
		</Card>
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

export default EditorPage;
