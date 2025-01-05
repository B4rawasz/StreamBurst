const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
	subCallback: (callback: (data: any) => void) => {
		electron.ipcRenderer.on("test", (event, data) => {
			callback(data);
		});
	},
	getData: () => electron.ipcRenderer.invoke("getData"),
});
