"use client";

import { File } from "fumadocs-ui/components/files";
import Link from "next/link";

export default function InteractiveFile({ name, href }: { name: string; href: string }) {
	const isAnchorLink = href.startsWith("#");

	const handleClick = (e: React.MouseEvent) => {
		if (isAnchorLink) {
			e.preventDefault();
			const element = document.getElementById(href.slice(1));
			if (element) {
				element.scrollIntoView({ behavior: "smooth" });
			}
		}
	};

	if (isAnchorLink) {
		return (
			<div className="cursor-pointer" onClick={handleClick}>
				<File name={name} />
			</div>
		);
	}

	return (
		<Link href={href} className="cursor-pointer">
			<File name={name} />
		</Link>
	);
}
