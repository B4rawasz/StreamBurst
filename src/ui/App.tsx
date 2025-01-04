import { ThemeProvider } from "./components/theme-provider";
import { Button } from "./components/ui/button";

function App() {
	return (
		<>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<div className="w-full h-screen flex flex-col items-center justify-center bg-background">
					<Button>Click me</Button>
				</div>
			</ThemeProvider>
		</>
	);
}

export default App;
