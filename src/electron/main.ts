import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./utils.js";
import { pathToFileURL } from "url";

app.on("ready", () => {
	const mainWindow = new BrowserWindow({});
	if (isDev()) {
		mainWindow.loadURL("http://localhost:5050");
	} else {
		mainWindow.loadFile(
			path.join(app.getAppPath(), "dist-react", "index.html")
		);
	}

	if (isDev()) {
		testModules();
	}
});

async function testModules() {
	const modulePath = path.join(
		app.getAppPath(),
		"modules",
		"test.asar",
		"index.js"
	);
	console.log("modulePath", modulePath);

	const testMod = await import(pathToFileURL(modulePath).href)
		.then((mod) => {
			return mod.default;
		})
		.catch((err) => {
			console.log(err);
		});

	testMod.on("event", (data: any) => {
		console.log("event", data);
	});

	testMod.enable();

	// Example: Disable the module after 10 seconds
	setTimeout(() => {
		testMod.disable();
	}, 10000);
}
