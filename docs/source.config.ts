import { RehypeCodeOptions } from "fumadocs-core/mdx-plugins";
import {
	defineDocs,
	defineConfig,
	metaSchema,
	frontmatterSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";
import { ShikiTransformer } from "@shikijs/types";

export const docs = defineDocs({
	dir: "src/content/docs",
	meta: {
		schema: metaSchema.extend({
			iconColor: z.string().optional(),
		}),
	},
	docs: {
		schema: frontmatterSchema.extend({
			footer: z.boolean().optional(),
		}),
	},
});

export default defineConfig({
	mdxOptions: {
		// MDX options
		rehypeCodeOptions: {
			icon: false,
			transformers: [
				{
					transformer: "icon",
					pre(hast) {
						hast.properties.icon = this.options.lang;
						return hast;
					},
				} as ShikiTransformer,
			],
		} as RehypeCodeOptions,
	},
});
