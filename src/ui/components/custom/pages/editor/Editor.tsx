import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { v4 as uuid } from "uuid";

const Editor = () => {
	const [elements, setElements] = useState<Array<{ uuid: string }>>([]);
	return (
		<>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<div className="w-screen h-screen flex flex-row bg-background">
					<div className="w-1/6 h-full bg-sidebar flex flex-col items-center py-8">
						<Button
							onClick={() => {
								setElements([...elements, { uuid: uuid() }]);
							}}
						>
							Add element
						</Button>
					</div>
					<div className="w-5/6 h-full flex items-center justify-center">
						<div className="w-[90%] aspect-video bg-accent/70 rounded-md">
							{elements.map((element) => (
								<div
									key={element.uuid}
									className="absolute w-10 h-10 bg-primary"
								></div>
							))}
						</div>
					</div>
				</div>
			</ThemeProvider>
		</>
	);
};

export default Editor;
