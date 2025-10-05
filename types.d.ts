type ModuleMain = {
	enable: () => void;
	disable: () => void;
	setSettingsPath: (path: string) => void;
	enabled: boolean;
	on: (event: "event" | "error" | "debug", callback: (data: any) => void) => void;
};

type ModulePackage = {
	name: string;
	productName: string;
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

type ModulesEventsEventProperty = {
	type: string;
	description: string;
};

type ModuleEventsEvent = {
	description: string;
	params: {
		[key: string]: ModulesEventsEventProperty;
	};
};

type ModuleEvents = {
	[key: string]: ModuleEventsEvent;
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

type ModuleEvent = {
	name: string;
	version: string;
	eventId: string;
	params: {
		[key: string]: string | number | boolean | object;
	};
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
		settingsChanged: (callback: (settings: Settings) => void) => void;
		sendTestPayload: (payload: string) => void;
	};
}

type Settings = {
	theme: "dark" | "light" | "system";
	sidebarOnHover: boolean;
	devMode: boolean;
	servicePort: number;
	enabledModules: string[];
};
