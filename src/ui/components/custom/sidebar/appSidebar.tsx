import Logo from "@/assets/Logo";
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
	useSidebar,
} from "@/components/ui/sidebar";
import { MonitorCog, PencilRuler, Puzzle } from "lucide-react";
import SettingsDialog from "../settings/SettingsDialog";
import { useEffect, useState } from "react";

const AppSidebar = ({
	page,
	setPage,
	setOpen,
}: {
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { toggleSidebar } = useSidebar();
	const [hover, setHover] = useState<null | boolean>();

	useEffect(() => {
		(async () => {
			setHover(await (await window.electron.getSettings()).sidebarOnHover);
		})();
	}, []);

	useEffect(() => {
		window.electron.settingsChanged((settings) => {
			setHover(settings.sidebarOnHover);
		});
	});

	return (
		<Sidebar
			collapsible="icon"
			onMouseEnter={() => hover && setOpen(true)}
			onMouseLeave={() => hover && setOpen(false)}
		>
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
								<SidebarMenuButton
									onClick={() => {
										setPage(2);
									}}
								>
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
						<SettingsDialog />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};

export default AppSidebar;
