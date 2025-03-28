import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";
import { source } from "@/lib/source";
import { RootToggle } from "fumadocs-ui/components/layout/root-toggle";
import { GithubInfo } from "fumadocs-ui/components/github-info";
import { MetaData } from "fumadocs-core/source";
import DocsThemeProvider from "@/components/theme/DocsThemeProvider";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<DocsThemeProvider>
			<DocsLayout
				tree={source.pageTree}
				sidebar={{
					tabs: {
						transform(option, node) {
							const meta = source.getNodeMeta(node);
							if (!meta) return option;

							return {
								...option,
								icon: meta.data.icon && (
									<div
										style={{
											color: meta.data.iconColor
												? "var(--color-fd-primary)"
												: "currentColor",
											//borderColor: meta.data.iconColor,
											borderImageSlice: 1,
											borderImageSource: `linear-gradient(to right, transparent 10%, ${
												meta.data.iconColor
													? "var(--color-fd-primary)"
													: "currentColor"
											} 50%, transparent 90%)`,
										}}
										className={cn(
											meta.data.iconColor,
											"aspect-square p-0.5 border-b-2"
										)}
									>
										{node.icon}
									</div>
								),
							};
						},
					},
				}}
				{...baseOptions}
			>
				{children}
			</DocsLayout>
		</DocsThemeProvider>
	);
}
