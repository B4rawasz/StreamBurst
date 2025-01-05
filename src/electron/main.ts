import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { isDev, setupFiles } from "./utils/utils.js";
import { getPreloadPath } from "./utils/pathResolver.js";
import {
	loadModules,
	prepareModulesInfo,
} from "./utils/modules/moduleLoader.js";

let modules: Module[] = [];
let modulesInfo: ModuleInfo[] = [];

app.on("ready", async () => {
	setupFiles();

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

	modules = await loadModules();
	modulesInfo = prepareModulesInfo(modules);

	setInterval(() => {
		sendTest(mainWindow);
	}, 2000);

	ipcMain.handle("getModules", (_) => {
		return modulesInfo;
	});
});

function sendTest(mainWindow: BrowserWindow) {
	mainWindow.webContents.send("test", "Hello from main process");
}
