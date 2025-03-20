"use client";

import { File } from "fumadocs-ui/components/files";
import { useRouter } from "next/navigation";

export default function InteractiveFile({
	name,
	href,
}: {
	name: string;
	href: string;
}) {
	const router = useRouter();
	return (
		<File
			className="cursor-pointer"
			name={name}
			onClick={() => {
				router.push(href);
			}}
		/>
	);
}
