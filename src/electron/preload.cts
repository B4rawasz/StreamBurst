const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
	subCallback: (callback) => {
		electron.ipcRenderer.on("test", (_, data) => {
			callback(data);
		});
	},
	getModules: () => electron.ipcRenderer.invoke("getModules"),
	getPages: () => electron.ipcRenderer.invoke("getPages"),
	applyModuleSettings: (module) =>
		electron.ipcRenderer.invoke("applyModuleSettings", module),
	changeModuleState: (moduleName, enabled) =>
		electron.ipcRenderer.invoke("changeModuleState", moduleName, enabled),
	fullscreen: (fullscreen) =>
		electron.ipcRenderer.invoke("fullscreen", fullscreen),
	getSettings: () => electron.ipcRenderer.invoke("getSettings"),
	setSettings: (settings) =>
		electron.ipcRenderer.invoke("setSettings", settings),
	settingsChanged: (callback) => {
		electron.ipcRenderer.on("settingsChanged", (_, settings) => {
			callback(settings);
		});
	},
	sendTestPayload: (payload) =>
		electron.ipcRenderer.invoke("sendTestPayload", payload),
} satisfies Window["electron"]);
