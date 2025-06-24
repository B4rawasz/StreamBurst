import { IpcRendererEvent } from "electron";

const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
	subCallback: (callback) => {
		electron.ipcRenderer.on("test", (_: IpcRendererEvent, data: any) => {
			callback(data);
		});
	},
	getModules: () => electron.ipcRenderer.invoke("getModules"),
	getPages: () => electron.ipcRenderer.invoke("getPages"),
	applyModuleSettings: (module) => electron.ipcRenderer.invoke("applyModuleSettings", module),
	changeModuleState: (moduleName, enabled) => electron.ipcRenderer.invoke("changeModuleState", moduleName, enabled),
	fullscreen: (fullscreen) => electron.ipcRenderer.invoke("fullscreen", fullscreen),
	getSettings: () => electron.ipcRenderer.invoke("getSettings"),
	setSettings: (settings) => electron.ipcRenderer.invoke("setSettings", settings),
	settingsChanged: (callback) => {
		electron.ipcRenderer.on("settingsChanged", (_: IpcRendererEvent, settings: any) => {
			callback(settings as Settings);
		});
	},
	sendTestPayload: (payload) => electron.ipcRenderer.invoke("sendTestPayload", payload),
} satisfies Window["electron"]);
