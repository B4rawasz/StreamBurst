"use client";

import { useParams } from "next/navigation";
import { ReactNode } from "react";

export default function DocsThemeProvider({
	children,
}: {
	children: ReactNode;
}) {
	const { slug } = useParams();

	return <span className={slug && slug[0]}>{children}</span>;
}
