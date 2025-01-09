import Logo from "@/assets/Logo";
import { Separator } from "@/components/ui/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar";
import { MonitorCog, PencilRuler, Puzzle, Settings } from "lucide-react";

const AppSidebar = ({
	page,
	setPage,
}: {
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
	const { toggleSidebar } = useSidebar();
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							className="hover:bg-sidebar active:bg-sidebar"
							onClick={toggleSidebar}
						>
							<div className="flex aspect-square size-8 items-center justify-center">
								<Logo className="stroke-sidebar-foreground size-8" />
							</div>
							<span className="text-2xl">StreamBurst</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton onClick={() => setPage(0)}>
									<Puzzle className={page == 0 ? "stroke-primary" : ""} />
									Modules
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton onClick={() => setPage(1)}>
									<MonitorCog className={page == 1 ? "stroke-primary" : ""} />
									Output
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton onClick={() => setPage(2)}>
									<PencilRuler className={page == 2 ? "stroke-primary" : ""} />
									Edit
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<SidebarTrigger />
						</SidebarMenuButton>
						<Separator className="my-1" />
						<SidebarMenuButton>
							<Settings />
							Settings
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};

export default AppSidebar;
