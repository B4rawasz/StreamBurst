import Logo from "@/assets/Logo";
import { Button } from "@/components/ui/button";
import { Settings, Puzzle, MonitorCog, PencilRuler } from "lucide-react";

interface SidebarProps {
	state: number;
	setState: React.Dispatch<React.SetStateAction<number>>;
}

const Sidebar = ({ state, setState }: SidebarProps) => {
	return (
		<div className="h-full w-16 pt-2 pb-4 gap-3 bg-accent flex flex-col items-center justify-center">
			<Logo className="stroke-foreground w-12 h-12" />
			<SidebarPocket state={state} setState={setState} />
			<Button variant="default" size="iconMd" className="min-h-10">
				<Settings className="stroke-foreground" />
			</Button>
		</div>
	);
};

const SidebarPocket = ({ state, setState }: SidebarProps) => {
	return (
		<div className="h-full w-full flex flex-col justify-center items-center gap-4">
			<Button
				variant="ghostInverse"
				size="iconMd"
				onClick={() => setState(0)}
				className={state === 0 ? "bg-primary" : ""}
			>
				<Puzzle className="stroke-foreground" />
			</Button>
			<Button
				variant="ghostInverse"
				size="iconMd"
				onClick={() => setState(1)}
				className={state === 1 ? "bg-primary" : ""}
			>
				<MonitorCog className="stroke-foreground" />
			</Button>
			<Button
				variant="ghostInverse"
				size="iconMd"
				onClick={() => setState(2)}
				className={state === 2 ? "bg-primary" : ""}
			>
				<PencilRuler className="stroke-foreground" />
			</Button>
		</div>
	);
};

export default Sidebar;
