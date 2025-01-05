import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { isDev } from "./utils.js";
import { pathToFileURL } from "url";
import { getPreloadPath } from "./pathResolver.js";

app.on("ready", () => {
	const mainWindow = new BrowserWindow({
		webPreferences: {
			preload: getPreloadPath(),
		},
	});
	if (isDev()) {
		mainWindow.loadURL("http://localhost:5050");
	} else {
		mainWindow.loadFile(
			path.join(app.getAppPath(), "dist-react", "index.html")
		);
	}

	setInterval(() => {
		sendTest(mainWindow);
	}, 2000);

	ipcMain.handle("getData", (event) => {
		return "Hello from main process222";
	});

	if (isDev()) {
		testModules();
	}
});

function sendTest(mainWindow: BrowserWindow) {
	mainWindow.webContents.send("test", "Hello from main process");
}

async function testModules() {
	const modulePath = path.join(app.getAppPath(), "modules", "test.asar");
	console.log("modulePath", modulePath);

	const testMod = await import(
		pathToFileURL(path.join(modulePath, "index.js")).href
	)
		.then((mod) => {
			return mod.default;
		})
		.catch((err) => {
			console.log(err);
		});

	const testModData = await import(
		pathToFileURL(path.join(modulePath, "package.json")).href,
		{ assert: { type: "json" } }
	).catch((err) => {
		console.log(err);
	});

	console.log("testModData", testModData);

	testMod.on("event", (data: any) => {
		console.log("event", data);
	});

	testMod.enable();

	// Example: Disable the module after 10 seconds
	setTimeout(() => {
		testMod.disable();
	}, 10000);
}
