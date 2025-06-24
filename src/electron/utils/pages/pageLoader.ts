import { app } from "electron";
import path from "path";
import fs from "fs";
import { mainLogger } from "../logger.js";
import { log } from "console";

const logger = mainLogger.createModuleLogger("PageLoader");

export function loadPages(): string[] {
	const pagesPath = path.join(app.getPath("userData"), "public");
	const pages = fs.readdirSync(pagesPath);
	if (pages.length === 0) {
		logger.warn("No pages found in public directory");
		return [];
	}
	logger.debug("Found pages in public directory:", pages);
	return pages;
}
