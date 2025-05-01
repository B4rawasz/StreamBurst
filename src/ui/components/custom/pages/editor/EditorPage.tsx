import { PencilRuler } from "lucide-react";

const EditorPage = () => {
	return (
		<div className="h-full w-full flex flex-col">
			<span className="text-4xl font-bold flex items-center gap-4 p-4">
				<PencilRuler className="stroke-foreground h-12 w-12" />
				Edit
			</span>

			{/*
			<ScrollArea>
				<div className="flex flex-col gap-4 px-4 pb-4">
					{pages?.map((page) => (
						<PageCard pageName={page} key={page} />
					))}
				</div>
			</ScrollArea>
			*/}

			<div className="w-full h-full flex items-center justify-center">
				Comming soon...
			</div>
		</div>
	);
};

export default EditorPage;
