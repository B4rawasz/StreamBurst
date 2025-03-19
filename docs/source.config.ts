import {
	defineDocs,
	defineConfig,
	metaSchema,
	frontmatterSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";

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
	},
});
