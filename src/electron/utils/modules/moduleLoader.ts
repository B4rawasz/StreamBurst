import { app } from "electron";
import path from "path";
import fs from "fs/promises";
import fss from "fs";
import { pathToFileURL } from "url";
import { mainLogger } from "../logger.js";

const logger = mainLogger.createModuleLogger("ModuleLoader");

export async function loadModules(): Promise<Module[]> {
	const modulesPath = path.join(app.getPath("userData"), "modules");

	let asarFiles: string[];

	try {
		const fileList = await fs.readdir(modulesPath);
		logger.debug("Found files in modules directory", fileList);

		asarFiles = fileList.filter((file) => file.endsWith(".asar"));
	} catch (err) {
		logger.error("Error reading modules directory", err);
		asarFiles = [];
	}

	let modules: Module[] = [];

	for (const asar of asarFiles) {
		try {
			const modulePath = path.join(modulesPath, asar);
			const module = await import(pathToFileURL(path.join(modulePath, "index.js")).href).then((mod) => {
				return mod.default as ModuleMain;
			});

			const modulePackageJSON = await fs.readFile(path.join(modulePath, "package.json"), { encoding: "utf-8" });
			const modulePackage = JSON.parse(modulePackageJSON) as ModulePackage;

			const moduleSettingsTemplateJSON = await fs.readFile(path.join(modulePath, "settings_template.json"), {
				encoding: "utf-8",
			});

			const moduleSettingsTemplate = JSON.parse(moduleSettingsTemplateJSON) as ModuleSettings;

			let moduleSettings: ModuleSettings;

			if (!fss.existsSync(path.join(modulesPath, "config", modulePackage.name + ".json"))) {
				await fs.writeFile(
					path.join(modulesPath, "config", modulePackage.name + ".json"),
					JSON.stringify(moduleSettingsTemplate, null, 4),
					{ encoding: "utf-8" }
				);

				moduleSettings = moduleSettingsTemplate;
			} else {
				const moduleSettingsJSON = await fs.readFile(path.join(modulesPath, "config", modulePackage.name + ".json"), {
					encoding: "utf-8",
				});
				const moduleSettingsExisting = JSON.parse(moduleSettingsJSON) as ModuleSettings;

				if (moduleSettingsExisting.version !== moduleSettingsTemplate.version) {
					await fs.writeFile(
						path.join(modulesPath, "config", modulePackage.name + ".json"),
						JSON.stringify(moduleSettingsTemplate, null, 4),
						{ encoding: "utf-8" }
					);

					moduleSettings = moduleSettingsTemplate;
				} else {
					moduleSettings = moduleSettingsExisting;
				}
			}

			const moduleEventsJSON = await fs.readFile(path.join(modulePath, "events.json"), { encoding: "utf-8" });

			const moduleEvents = JSON.parse(moduleEventsJSON) as ModuleEvents;

			modules.push({
				main: module,
				package: modulePackage,
				settings: moduleSettings,
				settingsPath: path.join(modulesPath, "config", modulePackage.name + ".json"),
				events: moduleEvents,
			});

			module.setSettingsPath(path.join(modulesPath, "config", modulePackage.name + ".json"));
		} catch (err) {
			logger.error(`Error loading module ${asar}`, err);
			continue; // Skip this module if there's an error
		}
	}

	return modules;
}

export function prepareModulesInfo(modules: Module[], settings: Settings): ModuleInfo[] {
	return modules.map((module) => {
		return {
			package: module.package,
			settings: module.settings,
			events: module.events,
			enabled: settings.enabledModules.includes(module.package.name),
		};
	});
}
