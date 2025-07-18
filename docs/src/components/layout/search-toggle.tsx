"use client";
import type { ComponentProps } from "react";
import { Search } from "lucide-react";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import { useI18n } from "fumadocs-ui/contexts/i18n";
import { cn } from "../../lib/cn";
import { buttonVariants } from "../ui/button";

interface SearchToggleProps extends Omit<ComponentProps<"button">, "color"> {
	hideIfDisabled?: boolean;
}

export function SearchToggle({ hideIfDisabled, ...props }: SearchToggleProps) {
	const { setOpenSearch, enabled } = useSearchContext();
	if (hideIfDisabled && !enabled) return null;

	return (
		<button
			type="button"
			className={cn(
				buttonVariants({
					size: "sm",
					variant: "ghost",
				}),
				props.className
			)}
			data-search=""
			aria-label="Open Search"
			onClick={() => {
				setOpenSearch(true);
			}}
		>
			<Search />
		</button>
	);
}

export function LargeSearchToggle({
	hideIfDisabled,
	...props
}: ComponentProps<"button"> & {
	hideIfDisabled?: boolean;
}) {
	const { enabled, hotKey, setOpenSearch } = useSearchContext();
	const { text } = useI18n();
	if (hideIfDisabled && !enabled) return null;

	return (
		<button
			type="button"
			data-search-full=""
			{...props}
			className={cn(
				"inline-flex items-center gap-2 rounded-lg border bg-fd-secondary/50 p-1.5 ps-2 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground",
				props.className
			)}
			onClick={() => {
				setOpenSearch(true);
			}}
		>
			<Search className="size-4" />
			{text.search}
			<div className="ms-auto inline-flex gap-0.5">
				{hotKey.map((k, i) => (
					<kbd key={i} className="rounded-md border bg-fd-background px-1.5">
						{k.display}
					</kbd>
				))}
			</div>
		</button>
	);
}
