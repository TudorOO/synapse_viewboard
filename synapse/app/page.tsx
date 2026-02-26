import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "@/components/theme-button";
import { Button } from "@/components/ui/button";
import { addDatapoint, getDatapoints, getPackets } from "@/app/actions";
import MapWrapper from "@/components/MapWrapper";
import DialogWrapper from "@/components/DialogWrapper";
import PacketDisplay from "@/components/PacketDisplay";
import { Activity, RotateCcw, Camera, Layers, Zap, Cpu, Radio } from "lucide-react";

export default async function Home() {
    const data = await getDatapoints();

    return (
        <div
            className="flex min-h-screen bg-zinc-950 font-mono p-4 text-zinc-100"
            style={{
                backgroundImage: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.012) 2px,
            rgba(255,255,255,0.012) 4px
          )
        `,
            }}
        >
            {/* Header Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 h-10 bg-zinc-950/90 border-b border-amber-500/30 flex items-center px-4 gap-4 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs tracking-[0.25em] text-green-400 font-bold uppercase">LIVE</span>
                </div>
                <div className="h-4 w-px bg-zinc-700" />
                <span className="text-xs text-zinc-500 tracking-widest uppercase">Ground Control Interface</span>
                <div className="ml-auto flex items-center gap-3">
                    <Radio size={12} className="text-amber-400 animate-pulse" />
                    <span className="text-xs text-amber-400 tracking-widest">UPLINK ACTIVE</span>
                    <div className="h-4 w-px bg-zinc-700" />
                    <ModeToggle />
                </div>
            </div>

            {/* Main grid - offset for fixed header */}
            <div className="mt-12 w-full grid grid-cols-12 gap-3 auto-rows-min">

                {/* Map Panel - 8 cols */}
                <div className="col-span-8">
                    <Panel
                        label="TELEMETRY MAP"
                        icon={<Activity size={12} className="text-amber-400" />}
                        accent="amber"
                        id="SYS-001"
                    >
                        <div className="h-[520px] w-full rounded overflow-hidden border border-zinc-800">
                            <MapWrapper initialData={data} />
                        </div>
                    </Panel>
                </div>

                {/* Commands Panel - 4 cols */}
                <div className="col-span-4">
                    <Panel
                        label="COMMAND BUS"
                        icon={<Cpu size={12} className="text-green-400" />}
                        accent="green"
                        id="SYS-002"
                    >
                        <div className="flex flex-col gap-2 h-[520px]">
                            <div className="text-[10px] text-zinc-600 tracking-widest uppercase border-b border-zinc-800 pb-2 mb-1">
                                Uplink Commands
                            </div>

                            <DialogWrapper />

                            <CommandButton
                                icon={<RotateCcw size={13} />}
                                label="OBC RESET"
                                sublabel="On-Board Computer"
                                variant="warning"
                            />
                            <CommandButton
                                icon={<Layers size={13} />}
                                label="IMU RESET"
                                sublabel="Inertial Measurement Unit"
                                variant="neutral"
                            />
                            <CommandButton
                                icon={<Camera size={13} />}
                                label="CAM TAKE"
                                sublabel="Capture Frame"
                                variant="warning"
                            />
                            <CommandButton
                                icon={<Zap size={13} />}
                                label="SET MODE"
                                sublabel="Mode Override"
                                variant="neutral"
                            />

                            <div className="mt-auto">
                                <div className="text-[10px] text-zinc-600 tracking-widest uppercase border-b border-red-900/40 pb-2 mb-2">
                                    ⚠ Restricted
                                </div>
                                <CommandButton
                                    icon={<Zap size={13} />}
                                    label="SELF-DESTRUCT"
                                    sublabel="Irreversible"
                                    variant="danger"
                                />
                            </div>
                        </div>
                    </Panel>
                </div>

                {/* Packet Panel - full width */}
                <div className="col-span-12">
                    <Panel
                        label="PACKET STREAM"
                        icon={<Radio size={12} className="text-blue-400" />}
                        accent="blue"
                        id="SYS-003"
                    >
                        <PacketDisplay />
                    </Panel>
                </div>
            </div>
        </div>
    );
}

/* ── Sub-components ─────────────────────────────────────── */

function Panel({
    label,
    icon,
    accent = "amber",
    id,
    children,
}: {
    label: string;
    icon?: React.ReactNode;
    accent?: "amber" | "green" | "blue";
    id?: string;
    children: React.ReactNode;
}) {
    const accentClasses = {
        amber: "border-amber-500/40 text-amber-400",
        green: "border-green-500/40 text-green-400",
        blue: "border-blue-500/40 text-blue-400",
    };
    const barClasses = {
        amber: "bg-amber-500",
        green: "bg-green-500",
        blue: "bg-blue-500",
    };

    return (
        <div className={`relative border ${accentClasses[accent]} bg-zinc-900/60 rounded-sm overflow-hidden`}>
            {/* Top accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] ${barClasses[accent]} opacity-70`} />

            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                    {icon}
                    <span className={`text-[11px] font-bold tracking-[0.2em] uppercase ${accentClasses[accent]}`}>
                        {label}
                    </span>
                </div>
                {id && (
                    <span className="text-[10px] text-zinc-600 tracking-widest">{id}</span>
                )}
            </div>

            <div className="p-4">{children}</div>
        </div>
    );
}

function CommandButton({
    icon,
    label,
    sublabel,
    variant = "neutral",
}: {
    icon: React.ReactNode;
    label: string;
    sublabel?: string;
    variant?: "neutral" | "warning" | "danger";
}) {
    const styles = {
        neutral:
            "border-zinc-700 bg-zinc-800/60 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800 hover:text-zinc-100",
        warning:
            "border-amber-700/50 bg-amber-950/30 text-amber-300 hover:border-amber-500 hover:bg-amber-950/60 hover:text-amber-100",
        danger:
            "border-red-700/50 bg-red-950/30 text-red-400 hover:border-red-500 hover:bg-red-950/60 hover:text-red-200",
    };

    return (
        <button
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm border text-left transition-all duration-150 group ${styles[variant]}`}
        >
            <span className="opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>
            <div>
                <div className="text-[11px] font-bold tracking-[0.15em] uppercase">{label}</div>
                {sublabel && (
                    <div className="text-[9px] opacity-40 tracking-wider mt-0.5">{sublabel}</div>
                )}
            </div>
            <span className="ml-auto text-[9px] opacity-20 group-hover:opacity-60 tracking-widest">SEND →</span>
        </button>
    );
}