type ModuleMain = {
	enable: () => void;
	disable: () => void;
	setSettingsPath: (path: string) => void;
	enabled: boolean;
};

type ModulePackage = {
	name: string;
	version: string;
	author: string;
	description: string;
	main: string;
};

type ModuleSettingsProperty = {
	value: string | number | boolean;
	description: string;
};

type ModuleSettings = {
	name: string;
	version: string;
	settings: {
		[key: string]: ModuleSettingsProperty;
	};
};

type Module = {
	main: ModuleMain;
	package: ModulePackage;
	settings: ModuleSettings;
	settingsPath: string;
};

type ModuleInfo = {
	package: ModulePackage;
	settings: ModuleSettings;
	enabled: boolean;
};

interface Window {
	electron: {
		subCallback: (callback: (data: any) => void) => void;
		getModules: () => Promise<ModuleInfo[]>;
		applySettings: (settings: ModuleInfo) => void;
		changeModuleState: (moduleName: string, enabled: boolean) => void;
	};
}
