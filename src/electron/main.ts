import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import { isDev, loadSettings, setupFiles } from "./utils/utils.js";
import { getPreloadPath } from "./utils/pathResolver.js";
import {
	loadModules,
	prepareModulesInfo,
} from "./utils/modules/moduleLoader.js";

let modules: Module[] = [];
let modulesInfo: ModuleInfo[] = [];
let settings: Settings;

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
	settings = loadSettings();
	modulesInfo = prepareModulesInfo(modules, settings);

	modules.forEach((module) => {
		module.main.on("event", (data) => {
			console.log(data);
		});
		module.main.on("error", (data) => {
			console.error(data);
		});
		module.main.on("debug", (data) => {
			console.debug(data);
		});

		if (settings.enabledModules.includes(module.package.name)) {
			module.main.enable();
		}
	});

	setInterval(() => {
		//sendTest(mainWindow);
	}, 2000);

	ipcMain.handle("getModules", (_) => {
		return modulesInfo;
	});

	ipcMain.handle("applyModuleSettings", (_, newModule: ModuleInfo) => {
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
			if (enabled) {
				module.main.enable();
				if (!settings.enabledModules.includes(module.package.name)) {
					settings.enabledModules.push(module.package.name);
				}
			} else {
				module.main.disable();
				settings.enabledModules = settings.enabledModules.filter(
					(name) => name !== module.package.name
				);
			}

			fs.writeFileSync(
				path.join(app.getPath("userData"), "settings.json"),
				JSON.stringify(settings, null, 4)
			);
		}
	);
}

/*function sendTest(mainWindow: BrowserWindow) {
	mainWindow.webContents.send("test", "Hello from main process");
}*/
