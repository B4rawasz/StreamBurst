import type { ReactNode } from "react";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/app/layout.config";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<HomeLayout
			{...baseOptions}
			links={[
				/*{
					text: "Documentation",
					url: "/docs/app",
					active: "nested-url",
				},*/
				{
					type: "custom",
					on: "nav",
					children: (
						<NavigationMenu>
							<NavigationMenuList>
								<NavigationMenuItem>
									<NavigationMenuTrigger>
										<Link href="/docs/app">Documentation</Link>
									</NavigationMenuTrigger>
									<NavigationMenuContent>
										<div className="grid grid-cols-2 w-[300px] gap-2">
											<NavigationMenuLink className="row-span-2" asChild>
												<Link href="/docs/app">App</Link>
											</NavigationMenuLink>
											<NavigationMenuLink asChild>
												<Link href="/docs/app/installation">Installation</Link>
											</NavigationMenuLink>
											<NavigationMenuLink asChild>
												<Link href="/docs/modules">Modules</Link>
											</NavigationMenuLink>
										</div>
									</NavigationMenuContent>
								</NavigationMenuItem>
							</NavigationMenuList>
						</NavigationMenu>
					),
				},
			]}
		>
			{children}
		</HomeLayout>
	);
}
