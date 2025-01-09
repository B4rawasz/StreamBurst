import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import { isDev, setupFiles } from "./utils/utils.js";
import { getPreloadPath } from "./utils/pathResolver.js";
import {
	loadModules,
	prepareModulesInfo,
} from "./utils/modules/moduleLoader.js";

let modules: Module[] = [];
let modulesInfo: ModuleInfo[] = [];

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

	setup();
});

async function setup() {
	await setupFiles();

	modules = await loadModules();
	modulesInfo = prepareModulesInfo(modules);

	setInterval(() => {
		//sendTest(mainWindow);
	}, 2000);

	ipcMain.handle("getModules", (_) => {
		return modulesInfo;
	});

	ipcMain.handle("applySettings", (_, newModule: ModuleInfo) => {
		let moduleInfo = modulesInfo.find(
			(module) => module.package.name === newModule.package.name
		);

		if (!moduleInfo) return;
		moduleInfo.settings = newModule.settings;

		const module = modules.find(
			(module) => module.package.name === newModule.package.name
		);

		if (!module) return;
		module.settings = newModule.settings;

		fs.writeFileSync(
			module.settingsPath,
			JSON.stringify(newModule.settings, null, 2)
		);

		if (module.main.enabled) {
			module.main.disable();
			module.main.enable();
		}
	});

	ipcMain.handle(
		"changeModuleState",
		(_, moduleName: string, enabled: boolean) => {
			const module = modules.find(
				(module) => module.package.name === moduleName
			);

			if (!module) return;
			if (enabled) module.main.enable();
			else module.main.disable();
		}
	);
}

/*function sendTest(mainWindow: BrowserWindow) {
	mainWindow.webContents.send("test", "Hello from main process");
}*/
