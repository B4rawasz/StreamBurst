import Link from "next/link";
import { Button } from "./button";
import React from "react";

export function LinkCards({
	children,
}: {
	children: React.ReactNode;
}): React.ReactNode {
	return (
		<span className="grid grid-cols-2 auto-rows-fr gap-2 w-full *:h-auto *:py-4">
			{children}
		</span>
	);
}

export function LinkCard({
	children,
	href,
}: {
	children: React.ReactNode;
	href: URL;
}): React.ReactNode {
	return (
		<Button variant="outline" asChild>
			<Link href={href} className="no-underline">
				{children}
			</Link>
		</Button>
	);
}

export function LinkCardComplex({
	children,
	href,
}: {
	children: React.ReactNode;
	href: URL;
}): React.ReactNode {
	return (
		<Button variant="outline" asChild>
			<Link href={href} className="no-underline">
				<div className="grid grid-rows-[1fr,auto] h-full items-start gap-2 font-normal w-full text-wrap ">
					{children}
				</div>
			</Link>
		</Button>
	);
}

export function LinkCardTitle({
	children,
}: {
	children: React.ReactNode;
}): React.ReactNode {
	return (
		<div className="flex flex-row items-center gap-2 font-medium text-base">
			{children}
		</div>
	);
}
