// // import { useQuery } from "@tanstack/react-query";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom";
// // import { Fish, Egg } from "lucide-react";
// // import { Skeleton } from "@/components/ui/skeleton";

// // const url = import.meta.env.VITE_API_BASE_URL;

// // // ── Data fetching ──────────────────────────────────────────────────────────────
// // const useFarmSummary = () =>
// //   useQuery({
// //     queryKey: ["farmSummary"],
// //     queryFn: async () => {
// //       const res = await axios.get(`${url}/api/farm-dashboard/summary`);
// //       return res.data.success ? res.data.data : null;
// //     },
// //     staleTime: 2 * 60 * 1000,
// //     refetchOnWindowFocus: false,
// //   });

// // // ── Icons ────────────────────────────────────────────────────────────────────
// // function CowIcon({ className }) {
// //   return (
// //     <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
// //       <path d="M4 8c-1.1 0-2 .9-2 2 0 .8.5 1.5 1.2 1.8L3 13c0 1.1.9 2 2 2h.3c-.2.4-.3.9-.3 1.3C5 18.4 6.6 20 8.6 20h6.8c2 0 3.6-1.6 3.6-3.7 0-.4-.1-.9-.3-1.3h.3c1.1 0 2-.9 2-2l-.2-1.2c.7-.3 1.2-1 1.2-1.8 0-1.1-.9-2-2-2h-1.3l-1-2.5c-.4-1-1.3-1.5-2.4-1.5H8.6c-1.1 0-2 .5-2.4 1.5L5.2 8H4zm3.5 3.5a1 1 0 110-2 1 1 0 010 2zm9 0a1 1 0 110-2 1 1 0 010 2z" />
// //     </svg>
// //   );
// // }

// // function ChickenIcon({ className }) {
// //   return (
// //     <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
// //       <path d="M15 3c-2 0-3.5 1.3-4 3-2.5.3-4.5 2.4-4.5 5 0 1.7.8 3.2 2 4.1L7 19h2l.7-2.3c.4.1.9.2 1.3.2v2.1H9v2h6.5c1.4 0 2.5-1.1 2.5-2.5 0-1-.6-1.9-1.5-2.3.6-.7 1-1.7 1-2.7 0-1.6-.9-3-2.3-3.7.2-.4.3-.8.3-1.3 0-1-.5-1.8-1.3-2.3.5-.4.8-1 .8-1.7C15 3.4 15 3.2 15 3zm3.5 3a1 1 0 100 2 1 1 0 000-2z" />
// //     </svg>
// //   );
// // }

// // // ── Card config — value comes from live data, everything else stays static ──
// // // `path` thakle card clickable hobe; na thakle normal (non-clickable) card thakbe
// // const buildStats = (data) => [
// //   {
// //     label: "Number of Cow",
// //     value: Number(data?.totalCows ?? 0).toLocaleString(),
// //     caption: "Total Cows",
// //     valueColor: "text-emerald-700",
// //     iconBg: "bg-emerald-100",
// //     iconColor: "text-emerald-700",
// //     Icon: CowIcon,
// //     path: "/dashboard/cow-project",
// //   },
// //   {
// //     label: "Chicken",
// //     value: Number(data?.totalChicken ?? 0).toLocaleString(),
// //     caption: "Total Chicken",
// //     valueColor: "text-orange-500",
// //     iconBg: "bg-orange-100",
// //     iconColor: "text-orange-500",
// //     Icon: ChickenIcon,
// //     path: "/dashboard/chicken-project",
// //   },
// //   {
// //     label: "Fish",
// //     value: Number(data?.totalFish ?? 0).toLocaleString(),
// //     caption: "Total Fish",
// //     valueColor: "text-sky-800",
// //     iconBg: "bg-sky-100",
// //     iconColor: "text-sky-800",
// //     Icon: Fish,
// //     path: "/dashboard/fish-project",
// //   },
// //   {
// //     label: "Egg Ratio",
// //     value: `${Number(data?.eggRatio ?? 0)}%`,
// //     caption: "Production Ratio",
// //     valueColor: "text-orange-500",
// //     iconBg: "bg-orange-100",
// //     iconColor: "text-orange-500",
// //     Icon: Egg,
// //    path: "/dashboard/chicken-project",
// //   },
// // ];

// // export default function FarmStatsCards() {
// //   const { data, isLoading, isError } = useFarmSummary();
// //   const stats = buildStats(data);
// //   const navigate = useNavigate();

// //   return (
// //     <div className="bg-neutral-100 py-5">
// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
// //         {isLoading &&
// //           Array.from({ length: 4 }).map((_, i) => (
// //             <div
// //               key={i}
// //               className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-5"
// //             >
// //               <Skeleton className="w-20 h-20 rounded-full shrink-0" />
// //               <div className="flex-1 space-y-2">
// //                 <Skeleton className="h-4 w-24" />
// //                 <Skeleton className="h-8 w-16" />
// //                 <Skeleton className="h-3 w-20" />
// //               </div>
// //             </div>
// //           ))}

// //         {!isLoading && isError && (
// //           <div className="col-span-full bg-white rounded-2xl shadow-sm p-5 text-center text-sm text-destructive">
// //             Failed to load farm summary.
// //           </div>
// //         )}

// //         {!isLoading &&
// //           !isError &&
// //           stats.map(({ label, value, caption, valueColor, iconBg, iconColor, Icon, path }) => (
// //             <div
// //               key={label}
// //               role={path ? "button" : undefined}
// //               tabIndex={path ? 0 : undefined}
// //               onClick={path ? () => navigate(path) : undefined}
// //               onKeyDown={
// //                 path
// //                   ? (e) => {
// //                       if (e.key === "Enter" || e.key === " ") navigate(path);
// //                     }
// //                   : undefined
// //               }
// //               className={`bg-white rounded-2xl shadow-sm p-5 flex items-center gap-5 transition-all ${
// //                 path
// //                   ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm"
// //                   : ""
// //               }`}
// //             >
// //               <div className={`w-20 h-20 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
// //                 <Icon className={`w-10 h-10 ${iconColor}`} />
// //               </div>
// //               <div>
// //                 <p className="text-base font-semibold text-neutral-800">{label}</p>
// //                 <p className={`text-4xl font-bold leading-tight ${valueColor}`}>{value}</p>
// //                 <p className="text-sm text-neutral-400">{caption}</p>
// //               </div>
// //             </div>
// //           ))}
// //       </div>
// //     </div>
// //   );
// // }

// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Fish, Egg } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";

// const url = import.meta.env.VITE_API_BASE_URL;

// // ── Data fetching ──────────────────────────────────────────────────────────────
// const useFarmSummary = () =>
//   useQuery({
//     queryKey: ["farmSummary"],
//     queryFn: async () => {
//       const res = await axios.get(`${url}/api/farm-dashboard/summary`);
//       return res.data.success ? res.data.data : null;
//     },
//     staleTime: 2 * 60 * 1000,
//     refetchOnWindowFocus: false,
//   });

// // ── Icons ──────────────────────────────────────────────────────────────────────
// function CowIcon({ className }) {
//   return (
//     <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
//       <path d="M4 8c-1.1 0-2 .9-2 2 0 .8.5 1.5 1.2 1.8L3 13c0 1.1.9 2 2 2h.3c-.2.4-.3.9-.3 1.3C5 18.4 6.6 20 8.6 20h6.8c2 0 3.6-1.6 3.6-3.7 0-.4-.1-.9-.3-1.3h.3c1.1 0 2-.9 2-2l-.2-1.2c.7-.3 1.2-1 1.2-1.8 0-1.1-.9-2-2-2h-1.3l-1-2.5c-.4-1-1.3-1.5-2.4-1.5H8.6c-1.1 0-2 .5-2.4 1.5L5.2 8H4zm3.5 3.5a1 1 0 110-2 1 1 0 010 2zm9 0a1 1 0 110-2 1 1 0 010 2z" />
//     </svg>
//   );
// }

// function ChickenIcon({ className }) {
//   return (
//     <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
//       <path d="M15 3c-2 0-3.5 1.3-4 3-2.5.3-4.5 2.4-4.5 5 0 1.7.8 3.2 2 4.1L7 19h2l.7-2.3c.4.1.9.2 1.3.2v2.1H9v2h6.5c1.4 0 2.5-1.1 2.5-2.5 0-1-.6-1.9-1.5-2.3.6-.7 1-1.7 1-2.7 0-1.6-.9-3-2.3-3.7.2-.4.3-.8.3-1.3 0-1-.5-1.8-1.3-2.3.5-.4.8-1 .8-1.7C15 3.4 15 3.2 15 3zm3.5 3a1 1 0 100 2 1 1 0 000-2z" />
//     </svg>
//   );
// }

// // ── Helpers ────────────────────────────────────────────────────────────────────
// const fmt = (n) => Number(n ?? 0).toLocaleString();

// // Egg ratio er level onujayi color (bar + text)
// const ratioTone = (ratio) => {
//   if (ratio >= 70) return { text: "text-emerald-600", bar: "bg-emerald-500", label: "Good" };
//   if (ratio >= 40) return { text: "text-amber-600", bar: "bg-amber-500", label: "Average" };
//   return { text: "text-rose-600", bar: "bg-rose-500", label: "Low" };
// };

// // ── Reusable pieces ────────────────────────────────────────────────────────────
// function Section({ title, badge, children }) {
//   return (
//     <section>
//       <div className="mb-3 flex items-center justify-between">
//         <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
//           {title}
//         </h2>
//         {badge && (
//           <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-600 shadow-sm ring-1 ring-neutral-200">
//             {badge}
//           </span>
//         )}
//       </div>
//       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
//     </section>
//   );
// }

// function StatCard({ label, value, caption, accent, iconBg, iconColor, valueColor, Icon, path, children }) {
//   const navigate = useNavigate();
//   const clickable = Boolean(path);

//   return (
//     <div
//       role={clickable ? "button" : undefined}
//       tabIndex={clickable ? 0 : undefined}
//       onClick={clickable ? () => navigate(path) : undefined}
//       onKeyDown={
//         clickable
//           ? (e) => {
//               if (e.key === "Enter" || e.key === " ") navigate(path);
//             }
//           : undefined
//       }
//       className={`relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200/70 transition-all ${
//         clickable
//           ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm"
//           : ""
//       }`}
//     >
//       {/* left accent strip */}
//       <span className={`absolute inset-y-0 left-0 w-1.5 ${accent}`} />

//       <div className="flex items-center gap-4 pl-2">
//         <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
//           <Icon className={`h-8 w-8 ${iconColor}`} />
//         </div>
//         <div className="min-w-0">
//           <p className="truncate text-sm font-semibold text-neutral-700">{label}</p>
//           <p className={`text-3xl font-bold leading-tight ${valueColor}`}>{value}</p>
//           <p className="text-xs text-neutral-400">{caption}</p>
//         </div>
//       </div>

//       {children}
//     </div>
//   );
// }

// function RatioBar({ ratio }) {
//   const tone = ratioTone(ratio);
//   return (
//     <div className="mt-4 pl-2">
//       <div className="mb-1 flex items-center justify-between text-xs">
//         <span className={`font-semibold ${tone.text}`}>{tone.label}</span>
//         <span className="text-neutral-400">{Math.min(ratio, 100)}% of 100%</span>
//       </div>
//       <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
//         <div
//           className={`h-full rounded-full transition-all duration-500 ${tone.bar}`}
//           style={{ width: `${Math.min(Math.max(ratio, 0), 100)}%` }}
//         />
//       </div>
//     </div>
//   );
// }

// function SkeletonCard() {
//   return (
//     <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200/70">
//       <Skeleton className="h-16 w-16 shrink-0 rounded-2xl" />
//       <div className="flex-1 space-y-2">
//         <Skeleton className="h-4 w-24" />
//         <Skeleton className="h-8 w-16" />
//         <Skeleton className="h-3 w-20" />
//       </div>
//     </div>
//   );
// }

// // ── Main ───────────────────────────────────────────────────────────────────────
// export default function FarmStatsCards() {
//   const { data, isLoading, isError } = useFarmSummary();
//   const sheds = data?.sheds ?? [];

//   if (isLoading) {
//     return (
//       <div className="space-y-8 bg-neutral-100 py-5">
//         {[2, 2, 2].map((count, s) => (
//           <div key={s} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
//             {Array.from({ length: count }).map((_, i) => (
//               <SkeletonCard key={i} />
//             ))}
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (isError || !data) {
//     return (
//       <div className="bg-neutral-100 py-5">
//         <div className="rounded-2xl bg-white p-5 text-center text-sm text-destructive shadow-sm">
//           Failed to load farm summary.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8 bg-neutral-100 py-5">
//       {/* ── Cow + Fish ── */}
//       <Section title="Livestock & Fisheries">
//         <StatCard
//           label="Number of Cow"
//           value={fmt(data.totalCows)}
//           caption="Total Cows"
//           accent="bg-emerald-600"
//           iconBg="bg-emerald-100"
//           iconColor="text-emerald-700"
//           valueColor="text-emerald-700"
//           Icon={CowIcon}
//           path="/dashboard/cow-project"
//         />
//         <StatCard
//           label="Fish"
//           value={fmt(data.totalFish)}
//           caption="Total Fish"
//           accent="bg-sky-700"
//           iconBg="bg-sky-100"
//           iconColor="text-sky-800"
//           valueColor="text-sky-800"
//           Icon={Fish}
//           path="/dashboard/fish-project"
//         />
//       </Section>

//       {/* ── Chicken per shed ── */}
//       <Section title="Chicken by Shed" badge={`Total: ${fmt(data.totalChicken)}`}>
//         {sheds.length === 0 && (
//           <p className="col-span-full text-sm text-neutral-400">No active chicken batch found.</p>
//         )}
//         {sheds.map((s) => (
//           <StatCard
//             key={`chicken-${s.shed}`}
//             label={`Chicken · ${s.shed}`}
//             value={fmt(s.totalChicken)}
//             caption={`Total Chicken (${s.shed})`}
//             accent="bg-orange-500"
//             iconBg="bg-orange-100"
//             iconColor="text-orange-500"
//             valueColor="text-orange-500"
//             Icon={ChickenIcon}
//             path="/dashboard/chicken-project"
//           />
//         ))}
//       </Section>

//       {/* ── Egg ratio per shed ── */}
//       <Section title="Egg Production Ratio by Shed" badge={`Overall: ${Number(data.eggRatio ?? 0)}%`}>
//         {sheds.length === 0 && (
//           <p className="col-span-full text-sm text-neutral-400">No production data found.</p>
//         )}
//         {sheds.map((s) => {
//           const tone = ratioTone(Number(s.eggRatio ?? 0));
//           return (
//             <StatCard
//               key={`egg-${s.shed}`}
//               label={`Egg Ratio · ${s.shed}`}
//               value={`${Number(s.eggRatio ?? 0)}%`}
//               caption={`${fmt(s.eggQty)} eggs / ${fmt(s.totalChicken)} chicken`}
//               accent={tone.bar}
//               iconBg="bg-amber-100"
//               iconColor="text-amber-600"
//               valueColor={tone.text}
//               Icon={Egg}
//               path="/dashboard/chicken-project"
//             >
//               <RatioBar ratio={Number(s.eggRatio ?? 0)} />
//             </StatCard>
//           );
//         })}
//       </Section>
//     </div>
//   );
// }

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Fish, Egg } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const url = import.meta.env.VITE_API_BASE_URL;

// ── Data fetching ──────────────────────────────────────────────────────────────
const useFarmSummary = () =>
  useQuery({
    queryKey: ["farmSummary"],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/farm-dashboard/summary`);
      return res.data.success ? res.data.data : null;
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

// ── Icons ──────────────────────────────────────────────────────────────────────
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

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmt = (n) => Number(n ?? 0).toLocaleString();

// Egg ratio er level onujayi color (bar + text)
const ratioTone = (ratio) => {
  if (ratio >= 70) return { text: "text-emerald-600", bar: "bg-emerald-500", label: "Good" };
  if (ratio >= 40) return { text: "text-amber-600", bar: "bg-amber-500", label: "Average" };
  return { text: "text-rose-600", bar: "bg-rose-500", label: "Low" };
};

// ── Reusable pieces ────────────────────────────────────────────────────────────
// cols = lg screen e koyta column hobe (shed sonkha onujayi, max 4)
function Section({ title, subtitle, cols = 4, children }) {
  const c = Math.min(Math.max(cols, 1), 4);
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          {title}
        </h2>
        {subtitle && <p className="text-xs text-neutral-400">{subtitle}</p>}
      </div>
      <div
        style={{ "--cols": c }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
      >
        {children}
      </div>
    </section>
  );
}

function StatCard({
  label, value, caption, accent, iconBg, iconColor, valueColor, Icon, path, children,
}) {
  const navigate = useNavigate();
  const clickable = Boolean(path);

  return (
    <div
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? () => navigate(path) : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") navigate(path);
            }
          : undefined
      }
      className={`relative flex h-full flex-col justify-center overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200/70 transition-all ${
        clickable
          ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm"
          : ""
      }`}
    >
      {/* left accent strip */}
      <span className={`absolute inset-y-0 left-0 w-1.5 ${accent}`} />

      <div className="flex items-center gap-4 pl-2">
        <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
          <Icon className={`h-8 w-8 ${iconColor}`} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-neutral-700">{label}</p>
          <p className={`text-3xl font-bold leading-tight ${valueColor}`}>{value}</p>
          <p className="text-xs text-neutral-400">{caption}</p>
        </div>
      </div>

      {children}
    </div>
  );
}

function RatioBar({ ratio }) {
  const tone = ratioTone(ratio);
  return (
    <div className="mt-4 pl-2">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className={`font-semibold ${tone.text}`}>{tone.label}</span>
        <span className="text-neutral-400">100%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${tone.bar}`}
          style={{ width: `${Math.min(Math.max(ratio, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200/70">
      <Skeleton className="h-16 w-16 shrink-0 rounded-2xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function FarmStatsCards() {
  const { data, isLoading, isError } = useFarmSummary();
  const sheds = data?.sheds ?? [];
  const shedCols = Math.max(sheds.length, 1);

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[4, 2, 2].map((count, s) => (
          <div key={s} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: count }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl bg-white p-5 text-center text-sm text-destructive shadow-sm">
        Failed to load farm summary.
      </div>
    );
  }

  const overallRatio = Number(data.eggRatio ?? 0);
  const overallTone = ratioTone(overallRatio);

  return (
    <div className="space-y-8">
      {/* ── Overview: Cow, Fish, Total Chicken, Overall Egg Ratio ── */}
      <Section title="Farm Overview" cols={4}>
        <StatCard
          label="Number of Cow"
          value={fmt(data.totalCows)}
          caption="Total Cows"
          accent="bg-emerald-600"
          iconBg="bg-emerald-100"
          iconColor="text-emerald-700"
          valueColor="text-emerald-700"
          Icon={CowIcon}
          path="/dashboard/cow-project"
        />
        <StatCard
          label="Fish"
          value={fmt(data.totalFish)}
          caption="Total Fish"
          accent="bg-sky-700"
          iconBg="bg-sky-100"
          iconColor="text-sky-800"
          valueColor="text-sky-800"
          Icon={Fish}
          path="/dashboard/fish-project"
        />
        <StatCard
          label="Total Chicken"
          value={fmt(data.totalChicken)}
          caption={`All sheds (${sheds.length})`}
          accent="bg-orange-500"
          iconBg="bg-orange-100"
          iconColor="text-orange-500"
          valueColor="text-orange-500"
          Icon={ChickenIcon}
          path="/dashboard/chicken-project"
        />
        <StatCard
          label="Overall Egg Ratio"
          value={`${overallRatio}%`}
          caption="All sheds combined"
          accent={overallTone.bar}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          valueColor={overallTone.text}
          Icon={Egg}
          path="/dashboard/chicken-project"
        >
          <RatioBar ratio={overallRatio} />
        </StatCard>
      </Section>

      {/* ── Chicken per shed ── */}
      <Section title="Chicken by Shed" subtitle="Currently active batch" cols={shedCols}>
        {sheds.length === 0 && (
          <p className="col-span-full text-sm text-neutral-400">No active chicken batch found.</p>
        )}
        {sheds.map((s) => (
          <StatCard
            key={`chicken-${s.shed}`}
            label={`Chicken · ${s.shed}`}
            value={fmt(s.totalChicken)}
            caption={`Total Chicken (${s.shed})`}
            accent="bg-orange-500"
            iconBg="bg-orange-100"
            iconColor="text-orange-500"
            valueColor="text-orange-500"
            Icon={ChickenIcon}
            path="/dashboard/chicken-project"
          />
        ))}
      </Section>

      {/* ── Egg ratio per shed ── */}
      <Section title="Egg Production Ratio by Shed" subtitle="Based on latest production date" cols={shedCols}>
        {sheds.length === 0 && (
          <p className="col-span-full text-sm text-neutral-400">No production data found.</p>
        )}
        {sheds.map((s) => {
          const ratio = Number(s.eggRatio ?? 0);
          const tone = ratioTone(ratio);
          return (
            <StatCard
              key={`egg-${s.shed}`}
              label={`Egg Ratio · ${s.shed}`}
              value={`${ratio}%`}
              // caption={`${fmt(s.eggQty)} eggs / ${fmt(s.totalChicken)} chicken`}
              accent={tone.bar}
              iconBg="bg-amber-100"
              iconColor="text-amber-600"
              valueColor={tone.text}
              Icon={Egg}
              path="/dashboard/chicken-project"
            >
              <RatioBar ratio={ratio} />
            </StatCard>
          );
        })}
      </Section>
    </div>
  );
}