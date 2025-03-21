import { useEffect, useState } from "react";
import { ThemeProvider } from "./components/theme-provider";
import ModulesPage from "./components/custom/pages/modules/ModulesPage";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import AppSidebar from "./components/custom/sidebar/appSidebar";
import EditorPage from "./components/custom/pages/editor/EditorPage";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OutputPage from "./components/custom/pages/output/OutputPage";
import { useMonaco } from "@monaco-editor/react";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Main />} />
			</Routes>
		</Router>
	);
}

const Main = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [page, setPage] = useState(0);

	const monaco = useMonaco();

	useEffect(() => {
		monaco?.editor.defineTheme("myDark", {
			base: "vs-dark",
			inherit: true,
			rules: [],
			colors: {
				"editor.background": "#00000000",
				"editor.border": "#00000000",
				focusBorder: "#27272A",
			},
		});
	}, [monaco]);

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
					<AppSidebar page={page} setPage={setPage} setOpen={setSidebarOpen} />
					<SidebarInset className="w-full h-screen">
						{page === 0 && <ModulesPage />}
						{page === 1 && <OutputPage />}
						{page === 2 && <EditorPage />}
					</SidebarInset>
				</SidebarProvider>
			</ThemeProvider>
		</>
	);
};

export default App;
