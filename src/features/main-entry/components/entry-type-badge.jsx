import { User, Zap, RotateCcw } from "lucide-react";

const CONFIG = {
  MANUAL:  { label: "Manual",  icon: User,      cls: "text-slate-600 bg-slate-100 border-slate-200" },
  AUTO:    { label: "Auto",    icon: Zap,       cls: "text-blue-600 bg-blue-100 border-blue-200" },
  REVERSE: { label: "Reverse", icon: RotateCcw, cls: "text-orange-600 bg-orange-100 border-orange-200" },
};

export function EntryTypeBadge({ type }) {
  const key = String(type || "MANUAL").toUpperCase();
  const cfg = CONFIG[key] || CONFIG.MANUAL;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.cls}`}>
      <Icon size={10} /> {cfg.label}
    </span>
  );
}