import { Fish, Egg } from "lucide-react";

function CowIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4 8c-1.1 0-2 .9-2 2 0 .8.5 1.5 1.2 1.8L3 13c0 1.1.9 2 2 2h.3c-.2.4-.3.9-.3 1.3C5 18.4 6.6 20 8.6 20h6.8c2 0 3.6-1.6 3.6-3.7 0-.4-.1-.9-.3-1.3h.3c1.1 0 2-.9 2-2l-.2-1.2c.7-.3 1.2-1 1.2-1.8 0-1.1-.9-2-2-2h-1.3l-1-2.5c-.4-1-1.3-1.5-2.4-1.5H8.6c-1.1 0-2 .5-2.4 1.5L5.2 8H4zm3.5 3.5a1 1 0 110-2 1 1 0 010 2zm9 0a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  );
}

function ChickenIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M15 3c-2 0-3.5 1.3-4 3-2.5.3-4.5 2.4-4.5 5 0 1.7.8 3.2 2 4.1L7 19h2l.7-2.3c.4.1.9.2 1.3.2v2.1H9v2h6.5c1.4 0 2.5-1.1 2.5-2.5 0-1-.6-1.9-1.5-2.3.6-.7 1-1.7 1-2.7 0-1.6-.9-3-2.3-3.7.2-.4.3-.8.3-1.3 0-1-.5-1.8-1.3-2.3.5-.4.8-1 .8-1.7C15 3.4 15 3.2 15 3zm3.5 3a1 1 0 100 2 1 1 0 000-2z" />
    </svg>
  );
}



const stats = [
  {
    label: "Number of Cow",
    value: "5",
    caption: "Total Cows",
    valueColor: "text-emerald-700",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
    Icon: CowIcon,
  },
  {
    label: "Chicken",
    value: "1,322",
    caption: "Total Chicken",
    valueColor: "text-orange-500",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    Icon: ChickenIcon,
  },
  {
    label: "Fish",
    value: "0",
    caption: "Total Fish",
    valueColor: "text-sky-800",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-800",
    Icon: Fish,
  },
  {
    label: "Egg Ratio",
    value: "90%",
    caption: "Production Ratio",
    valueColor: "text-orange-500",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    Icon: Egg,
  },
];

export default function FarmStatsCards() {
  return (
    <div className="bg-neutral-100 py-5">
        
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ label, value, caption, valueColor, iconBg, iconColor, Icon }) => (
          <div
            key={label}
            className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-5"
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
              <Icon className={`w-10 h-10 ${iconColor}`} />
            </div>
            <div>
              <p className="text-base font-semibold text-neutral-800">{label}</p>
              <p className={`text-4xl font-bold leading-tight ${valueColor}`}>{value}</p>
              <p className="text-sm text-neutral-400">{caption}</p>
            </div>
          </div>
        ))}
      </div>
     
    </div>
  );
}