import Logo from "@/components/logo/Logo";
import { basePath } from "@/config/config.mjs";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
	nav: {
		title: (
			<>
				<Logo size={32} fill="currentColor" />
				Stream Burst
			</>
		),
	},
	githubUrl: "https://github.com/B4rawasz/StreamBurst",
};
