import { defineDocs, defineConfig, metaSchema } from "fumadocs-mdx/config";
import { z } from "zod";

export const docs = defineDocs({
	dir: "src/content/docs",
	meta: {
		schema: metaSchema.extend({
			iconColor: z.string().optional(),
		}),
	},
});

export default defineConfig({
	mdxOptions: {
		// MDX options
	},
});
