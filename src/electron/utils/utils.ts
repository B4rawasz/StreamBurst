import { app } from "electron";
import path from "path";
import fs from "fs";
import fsa from "fs/promises";

export function isDev(): boolean {
	return process.env.NODE_ENV === "development";
}

export async function setupFiles(): Promise<void> {
	const modulesPath = path.join(app.getPath("userData"), "modules");

	let preinstaledModulesPath: string;

	if (isDev()) {
		preinstaledModulesPath = path.join(app.getAppPath(), "modules");
	} else {
		preinstaledModulesPath = path.join(app.getAppPath(), "..", "..", "modules");
	}

	if (!fs.existsSync(modulesPath)) {
		fs.mkdirSync(modulesPath);
	}

	if (!fs.existsSync(path.join(modulesPath, "config"))) {
		fs.mkdirSync(path.join(modulesPath, "config"));
	}

	const files = fs.readdirSync(preinstaledModulesPath);

	for (const file of files) {
		if (!fs.existsSync(path.join(modulesPath, file))) {
			await asarCoppy(
				path.join(preinstaledModulesPath, file),
				path.join(modulesPath, file)
			);
		}
	}

	const publicPath = path.join(app.getPath("userData"), "public");

	let preinstaledPublicPath: string;

	if (isDev()) {
		preinstaledPublicPath = path.join(app.getAppPath(), "public");
	} else {
		preinstaledPublicPath = path.join(app.getAppPath(), "..", "..", "public");
	}

	if (!fs.existsSync(publicPath)) {
		fs.mkdirSync(publicPath);
	}

	if (!fs.existsSync(path.join(publicPath, "example"))) {
		fs.mkdirSync(path.join(publicPath, "example"));
		await fsa.copyFile(
			path.join(preinstaledPublicPath, "index.html"),
			path.join(publicPath, "example", "index.html")
		);
	}
}

/* Copy asar file
stupid but works. fs has some wird behavior with asar files
so we need to rename it to txt, copy it and then rename it back to asar
Also remember to set watcher exclude in VSCode settings to exclude asar files
or it will crash the app becouse VScode also has some wird behavior with asar files
*/
async function asarCoppy(src: string, dest: string): Promise<void> {
	const tempName = src.slice(0, -5) + ".txt";

	try {
		await fsa.rename(src, tempName);
		await fsa.copyFile(tempName, dest);
		await fsa.rename(tempName, src);
	} catch (err) {
		console.log(err);
	}
}

export function loadSettings(): Settings {
	const settingsPath = path.join(app.getPath("userData"), "settings.json");

	if (!fs.existsSync(settingsPath)) {
		const settingsDefault: Settings = {
			sidebarOnHover: true,
			devMode: false,
			enabledModules: [],
		};
		fs.writeFileSync(settingsPath, JSON.stringify(settingsDefault, null, 4));
		return settingsDefault;
	}

	const settings = fs.readFileSync(settingsPath, { encoding: "utf-8" });
	return JSON.parse(settings) as Settings;
}
