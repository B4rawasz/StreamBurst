const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
	subCallback: (callback) => {
		electron.ipcRenderer.on("test", (_, data) => {
			callback(data);
		});
	},
	getModules: () => electron.ipcRenderer.invoke("getModules"),
} satisfies Window["electron"]);
