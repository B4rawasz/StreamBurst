import { app } from "electron";
import path from "path";
import fs from "fs";

export function loadPages(): string[] {
	const pagesPath = path.join(app.getPath("userData"), "public");
	const pages = fs.readdirSync(pagesPath);
	return pages;
}
