import { useEffect, useState } from "react";
import { ThemeProvider } from "./components/theme-provider";
import ModulesPage from "./components/custom/pages/modules/ModulesPage";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import AppSidebar from "./components/custom/sidebar/appSidebar";

function App() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [page, setPage] = useState(0);

	useEffect(() => {
		// @ts-ignore
		window.electron.subCallback((data) => {
			//console.log(data);
		});
	}, []);

	return (
		<>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
					<AppSidebar page={page} setPage={setPage} />
					<SidebarInset className="w-full h-screen">
						{page === 0 && <ModulesPage />}
						{page === 1 && <h1 className="text-4xl">MonitorCog</h1>}
						{page === 2 && <h1 className="text-4xl">PencilRuler</h1>}
					</SidebarInset>
				</SidebarProvider>
			</ThemeProvider>
		</>
	);
}

/*
<div className="w-full h-screen flex flex-row bg-background">
					<Sidebar state={page} setState={setPage} />
					<div className="flex-1 flex items-center justify-center">
						{page === 0 && <ModulesPage />}
						{page === 1 && <h1 className="text-4xl">MonitorCog</h1>}
						{page === 2 && <h1 className="text-4xl">PencilRuler</h1>}
					</div>
				</div>
				*/

export default App;
