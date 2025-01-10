const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
	subCallback: (callback) => {
		electron.ipcRenderer.on("test", (_, data) => {
			callback(data);
		});
	},
	getModules: () => electron.ipcRenderer.invoke("getModules"),
	applyModuleSettings: (module) =>
		electron.ipcRenderer.invoke("applyModuleSettings", module),
	changeModuleState: (moduleName, enabled) =>
		electron.ipcRenderer.invoke("changeModuleState", moduleName, enabled),
} satisfies Window["electron"]);
