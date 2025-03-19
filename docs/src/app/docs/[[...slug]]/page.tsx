import { /*openapi,*/ source } from "@/lib/source";
import {
	DocsPage,
	DocsBody,
	DocsDescription,
	DocsTitle,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { MDXComponents } from "mdx/types";
import { footerEnabled } from "@/config/config.mjs";

export default async function Page(props: {
	params: Promise<{ slug?: string[] }>;
}) {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	const MDX = page.data.body;

	const isFooterEnabled =
		page.data.footer ?? footerEnabled(params.slug?.[0] ?? "");

	return (
		<DocsPage
			toc={page.data.toc}
			full={page.data.full}
			editOnGithub={{
				owner: "B4rawasz",
				repo: "StreamBurst",
				sha: "main",
				// file path, make sure it's valid
				path: `docs/src/content/docs/${page.file.path}`,
				className: isFooterEnabled ? "" : "mb-4",
			}}
			footer={{ enabled: isFooterEnabled }}
		>
			<DocsTitle>{page.data.title}</DocsTitle>
			<DocsDescription>{page.data.description}</DocsDescription>
			<DocsBody>
				<MDX
					components={
						{
							...defaultMdxComponents /*APIPage: openapi.APIPage*/,
						} as MDXComponents
					}
				/>
			</DocsBody>
		</DocsPage>
	);
}

export async function generateStaticParams() {
	return source.generateParams();
}

export async function generateMetadata(props: {
	params: Promise<{ slug?: string[] }>;
}) {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	return {
		title: page.data.title,
		description: page.data.description,
	};
}
