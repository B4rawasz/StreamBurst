import { basePath } from "@/config/config.mjs";
import { source } from "@/lib/source";
import { createFromSource, createSearchAPI } from "fumadocs-core/search/server";

export const revalidate = false;

export const { staticGET: GET } = createSearchAPI("advanced", {
	indexes: source.getPages().map((page) => ({
		title: page.data.title,
		description: page.data.description,
		url: page.url.startsWith(basePath)
			? page.url.slice(basePath.length)
			: page.url,
		id: page.url,
		structuredData: page.data.structuredData,
	})),
});
