import { useEffect, useState } from "react";
import Sidebar from "./components/custom/sidebar/sidebar";
import { ThemeProvider } from "./components/theme-provider";
import ModulesPage from "./components/custom/pages/modules/ModulesPage";

function App() {
	const [page, setPage] = useState(0);

	useEffect(() => {
		// @ts-ignore
		window.electron.subCallback((data) => {
			console.log(data);
		});
	}, []);

	return (
		<>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<div className="w-full h-screen flex flex-row bg-background">
					<Sidebar state={page} setState={setPage} />
					<div className="flex-1 flex items-center justify-center">
						{page === 0 && <ModulesPage />}
						{page === 1 && <h1 className="text-4xl">MonitorCog</h1>}
						{page === 2 && <h1 className="text-4xl">PencilRuler</h1>}
					</div>
				</div>
			</ThemeProvider>
		</>
	);
}

export default App;
