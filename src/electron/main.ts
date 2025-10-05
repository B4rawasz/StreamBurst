import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import { isDev, loadSettings, setupFiles } from "./utils/utils.js";
import { getPreloadPath } from "./utils/pathResolver.js";
import { loadModules, prepareModulesInfo } from "./utils/modules/moduleLoader.js";
import Server from "./utils/server/server.js";
import { loadPages } from "./utils/pages/pageLoader.js";
import { mainLogger } from "./utils/logger.js";

let modules: Module[] = [];
let modulesInfo: ModuleInfo[] = [];
let settings: Settings;
let pages: string[] = [];
let server: Server;

const logger = mainLogger.createModuleLogger("Main");

app.on("ready", () => {
	const mainWindow = new BrowserWindow({
		webPreferences: {
			preload: getPreloadPath(),
		},
	});
	if (isDev()) {
		mainWindow.loadURL("http://localhost:5050");
	} else {
		mainWindow.loadFile(path.join(app.getAppPath(), "dist-react", "index.html"));
	}

	setup(mainWindow);
});

async function setup(mainWindow: BrowserWindow) {
	await setupFiles();

	modules = await loadModules();
	settings = loadSettings();
	modulesInfo = prepareModulesInfo(modules, settings);
	pages = loadPages();

	modulesInfo.forEach((module) => {
		logger.debug(`${module.package.name}`, module.events);
	});

	server = new Server();
	server.start(settings.servicePort);
	mainLogger.setServer(server);

	modules.forEach((module) => {
		const moduleLogger = mainLogger.createModuleLogger(module.package.name);

		const isModuleEvent = (obj: any): obj is ModuleEvent => {
			if (!obj || typeof obj !== "object") return false;
			if (typeof obj.name !== "string") return false;
			if (typeof obj.version !== "string") return false;
			if (typeof obj.eventId !== "string") return false;
			if (typeof obj.params !== "object" || obj.params === null) return false;
			return true;
		};

		module.main.on("event", (data) => {
			let parsed: any = data;

			if (isModuleEvent(parsed)) {
				server.emit("event", parsed);
				moduleLogger.event("Object", parsed);
			} else {
				moduleLogger.warn("Invalid module event", { data });
			}
		});

		module.main.on("error", (data) => {
			server.emit("error", data);

			try {
				data = JSON.parse(data);
				moduleLogger.error("Object", data);
			} catch (e) {
				moduleLogger.error(data);
			}
		});

		module.main.on("debug", (data) => {
			server.emit("debug", data);

			try {
				data = JSON.parse(data);
				moduleLogger.debug("Object", data);
			} catch (e) {
				moduleLogger.debug(data);
			}
		});

		if (settings.enabledModules.includes(module.package.name)) {
			module.main.enable();
		}
	});

	setInterval(() => {
		//sendTest(mainWindow);
	}, 2000);

	ipcMain.handle("fullscreen", (_, fullscreen: boolean) => {
		const mainWindow = BrowserWindow.getFocusedWindow();
		if (!mainWindow) return;
		mainWindow.setFullScreen(fullscreen);
	});

	ipcMain.handle("getModules", (_) => {
		return modulesInfo;
	});

	ipcMain.handle("getPages", (_) => {
		return pages;
	});

	ipcMain.handle("applyModuleSettings", (_, newModule: ModuleInfo) => {
		let moduleInfo = modulesInfo.find((module) => module.package.name === newModule.package.name);

		if (!moduleInfo) return;
		moduleInfo.settings = newModule.settings;

		const module = modules.find((module) => module.package.name === newModule.package.name);

		if (!module) return;
		module.settings = newModule.settings;

		fs.writeFileSync(module.settingsPath, JSON.stringify(newModule.settings, null, 2));

		if (module.main.enabled) {
			module.main.disable();
			module.main.enable();
		}

		logger.debug(`Module settings applied to ${newModule.package.name}`, { module: newModule });
	});

	ipcMain.handle("changeModuleState", (_, moduleName: string, enabled: boolean) => {
		const module = modules.find((module) => module.package.name === moduleName);

		if (!module) return;
		if (enabled) {
			module.main.enable();
			if (!settings.enabledModules.includes(module.package.name)) {
				settings.enabledModules.push(module.package.name);
			}
		} else {
			module.main.disable();
			settings.enabledModules = settings.enabledModules.filter((name) => name !== module.package.name);
		}

		fs.writeFileSync(path.join(app.getPath("userData"), "settings.json"), JSON.stringify(settings, null, 4));
	});

	ipcMain.handle("getSettings", (_) => {
		return settings;
	});

	ipcMain.handle("setSettings", (_, newSettings: Settings) => {
		if (newSettings.servicePort !== settings.servicePort) {
			server.stop();
			server.start(newSettings.servicePort);
		}
		settings = newSettings;
		fs.writeFileSync(path.join(app.getPath("userData"), "settings.json"), JSON.stringify(settings, null, 4));
		mainWindow.webContents.send("settingsChanged", settings);
		logger.debug("Settings updated", { settings: newSettings });
	});

	ipcMain.handle("sendTestPayload", (_, payload: string) => {
		const obj = JSON.parse(payload);

		switch (obj.type) {
			case "event":
				server.emit("event", payload);
				try {
					const data = JSON.parse(payload);
					logger.event("Object", data);
				} catch (e) {
					logger.event(payload);
				}
				break;
			case "error":
				server.emit("error", payload);
				try {
					const data = JSON.parse(payload);
					logger.error("Object", data);
				} catch (e) {
					logger.error(payload);
				}
				break;
			case "debug":
				server.emit("debug", payload);
				try {
					const data = JSON.parse(payload);
					logger.debug("Object", data);
				} catch (e) {
					logger.debug(payload);
				}
				break;
		}
	});

	logger.info("Starting StreamBurst Electron App", {
		version: app.getVersion(),
		isDev: isDev(),
	});
}

/*function sendTest(mainWindow: BrowserWindow) {
	mainWindow.webContents.send("test", "Hello from main process");
}*/
