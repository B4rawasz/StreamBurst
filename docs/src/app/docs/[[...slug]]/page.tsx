import { /*openapi,*/ source } from "@/lib/source";
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from "@/components/layouts/page";
import { notFound } from "next/navigation";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { MDXComponents } from "mdx/types";
import { footerEnabled } from "@/config/config.mjs";
import { HTMLAttributes } from "react";
import { BetterCodeblock } from "@/components/ui/BetterCodeBlock";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	const MDX = page.data.body;

	const isFooterEnabled = page.data.footer ?? footerEnabled(params.slug?.[0] ?? "");

	return (
		<DocsPage toc={page.data.toc} full={page.data.full} footer={{ enabled: isFooterEnabled }}>
			<DocsTitle>{page.data.title}</DocsTitle>
			<DocsDescription>{page.data.description}</DocsDescription>
			<DocsBody>
				<MDX
					components={
						{
							...defaultMdxComponents /*APIPage: openapi.APIPage*/,
							pre: (props: HTMLAttributes<HTMLPreElement>) => <BetterCodeblock {...props} />,
						} as MDXComponents
					}
				/>

				<Button asChild variant="link">
					<a
						href={`https://github.com/B4rawasz/StreamBurst/blob/main/docs/src/content/docs/${page.path}`}
						rel="noreferrer noopener"
						target="_blank"
						className="no-underline"
					>
						<SquarePen />
						Edit on GitHub
					</a>
				</Button>
			</DocsBody>
		</DocsPage>
	);
}

export async function generateStaticParams() {
	return source.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	return {
		title: page.data.title,
		description: page.data.description,
	};
}
