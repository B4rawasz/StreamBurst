import { docs } from "@/.source";
import { loader, Source } from "fumadocs-core/source";
import { icons } from "lucide-react";
import { createElement } from "react";
//import { attachFile, createOpenAPI } from "fumadocs-openapi/server";

export const source = loader({
	icon(icon) {
		if (!icon) {
			// You may set a default icon
			return;
		}

		if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
	},

	pageTree: {
		//attachFile,
	},
	baseUrl: "/docs",
	source: docs.toFumadocsSource(),
});
//export const openapi = createOpenAPI();
