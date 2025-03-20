import { Pre, CodeBlock } from "fumadocs-ui/components/codeblock";
import { HTMLAttributes } from "react";
import React from "react";

import { FileJson } from "lucide-react";
import {
	SiTypescript,
	SiJavascript,
	SiReact,
	SiHtml5,
	SiCss3,
} from "react-icons/si";

export function BetterCodeblock(
	props: HTMLAttributes<HTMLPreElement> & { icon?: string }
) {
	const icons = new Map<string, React.ReactNode>([
		["json", <FileJson />],
		["js", <SiJavascript />],
		["ts", <SiTypescript />],
		["tsx", <SiReact />],
		["jsx", <SiReact />],
		["html", <SiHtml5 />],
		["css", <SiCss3 />],
	]);

	return (
		<CodeBlock {...props} icon={icons.get(props.icon ?? "")}>
			<Pre>{props.children}</Pre>
		</CodeBlock>
	);
}
