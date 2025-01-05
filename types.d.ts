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

type ModuleSettings = {
	name: string;
	version: string;
	settings: {
		[key: string]: {
			value: string | number | boolean;
			description: string;
		};
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
};

interface Window {
	electron: {
		subCallback: (callback: (data: any) => void) => void;
		getModules: () => Promise<ModuleInfo[]>;
	};
}
