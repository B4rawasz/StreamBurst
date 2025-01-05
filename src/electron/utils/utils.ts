import { app } from "electron";
import path from "path";
import fs from "fs";

export function isDev(): boolean {
	return process.env.NODE_ENV === "development";
}

export function setupFiles(): void {
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

	fs.readdir(preinstaledModulesPath, (err, files) => {
		if (err) {
			console.log(err);
		}

		files.forEach((file) => {
			if (!fs.existsSync(path.join(modulesPath, file))) {
				asarCoppy(
					path.join(preinstaledModulesPath, file),
					path.join(modulesPath, file)
				);
			}
		});
	});
}

/* Copy asar file
stupid but works. fs has some wird behavior with asar files
so we need to rename it to txt, copy it and then rename it back to asar
Also remember to set watcher exclude in VSCode settings to exclude asar files
or it will crash the app becouse VScode also has some wird behavior with asar files
*/
function asarCoppy(src: string, dest: string) {
	const tempName = src.slice(0, -5) + ".txt";

	fs.rename(src, tempName, (err) => {
		if (err) {
			console.log(err);
		} else {
			fs.copyFile(tempName, dest, (err) => {
				if (err) {
					console.log(err);
				} else {
					fs.rename(tempName, src, (err) => {
						if (err) {
							console.log(err);
						}
					});
				}
			});
		}
	});
}
