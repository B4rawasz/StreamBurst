type ModuleMain = {
	enable: () => void;
	disable: () => void;
	setSettingsPath: (path: string) => void;
	enabled: boolean;
	on: (
		event: "event" | "error" | "debug",
		callback: (data: any) => void
	) => void;
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

type ModuleEvents = {
	[key: string]: {
		description: string;
		parmas: {
			[key: string]: {
				type: "string" | "number" | "boolean";
				description: string;
			};
		};
	};
};

type Module = {
	main: ModuleMain;
	package: ModulePackage;
	settings: ModuleSettings;
	settingsPath: string;
	events: ModuleEvents;
};

type ModuleInfo = {
	package: ModulePackage;
	settings: ModuleSettings;
	events: ModuleEvents;
	enabled: boolean;
};

interface Window {
	electron: {
		subCallback: (callback: (data: any) => void) => void;
		getModules: () => Promise<ModuleInfo[]>;
		getPages: () => Promise<string[]>;
		applyModuleSettings: (settings: ModuleInfo) => void;
		changeModuleState: (moduleName: string, enabled: boolean) => void;
		fullscreen: (fullscreen: boolean) => void;
		getSettings: () => Promise<Settings>;
		setSettings: (settings: Settings) => void;
		sendTestPayload: (payload: string) => void;
	};
}

type Settings = {
	sidebarOnHover: boolean;
	devMode: boolean;
	servicePort: number;
	enabledModules: string[];
};
