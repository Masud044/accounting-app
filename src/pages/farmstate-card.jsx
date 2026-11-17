

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

// // // ── Icons ──────────────────────────────────────────────────────────────────────
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

// // // ── Helpers ────────────────────────────────────────────────────────────────────
// // const fmt = (n) => Number(n ?? 0).toLocaleString();

// // // Egg ratio er level onujayi color (bar + text)
// // const ratioTone = (ratio) => {
// //   if (ratio >= 70) return { text: "text-emerald-600", bar: "bg-emerald-500", label: "Good" };
// //   if (ratio >= 40) return { text: "text-amber-600", bar: "bg-amber-500", label: "Average" };
// //   return { text: "text-rose-600", bar: "bg-rose-500", label: "Low" };
// // };

// // // ── Reusable pieces ────────────────────────────────────────────────────────────
// // function Section({ title, badge, children }) {
// //   return (
// //     <section>
// //       <div className="mb-3 flex items-center justify-between">
// //         <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
// //           {title}
// //         </h2>
// //         {badge && (
// //           <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-600 shadow-sm ring-1 ring-neutral-200">
// //             {badge}
// //           </span>
// //         )}
// //       </div>
// //       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
// //     </section>
// //   );
// // }

// // function StatCard({ label, value, caption, accent, iconBg, iconColor, valueColor, Icon, path, children }) {
// //   const navigate = useNavigate();
// //   const clickable = Boolean(path);

// //   return (
// //     <div
// //       role={clickable ? "button" : undefined}
// //       tabIndex={clickable ? 0 : undefined}
// //       onClick={clickable ? () => navigate(path) : undefined}
// //       onKeyDown={
// //         clickable
// //           ? (e) => {
// //               if (e.key === "Enter" || e.key === " ") navigate(path);
// //             }
// //           : undefined
// //       }
// //       className={`relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200/70 transition-all ${
// //         clickable
// //           ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm"
// //           : ""
// //       }`}
// //     >
// //       {/* left accent strip */}
// //       <span className={`absolute inset-y-0 left-0 w-1.5 ${accent}`} />

// //       <div className="flex items-center gap-4 pl-2">
// //         <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
// //           <Icon className={`h-8 w-8 ${iconColor}`} />
// //         </div>
// //         <div className="min-w-0">
// //           <p className="truncate text-sm font-semibold text-neutral-700">{label}</p>
// //           <p className={`text-3xl font-bold leading-tight ${valueColor}`}>{value}</p>
// //           <p className="text-xs text-neutral-400">{caption}</p>
// //         </div>
// //       </div>

// //       {children}
// //     </div>
// //   );
// // }

// // function RatioBar({ ratio }) {
// //   const tone = ratioTone(ratio);
// //   return (
// //     <div className="mt-4 pl-2">
// //       <div className="mb-1 flex items-center justify-between text-xs">
// //         <span className={`font-semibold ${tone.text}`}>{tone.label}</span>
// //         <span className="text-neutral-400">{Math.min(ratio, 100)}% of 100%</span>
// //       </div>
// //       <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
// //         <div
// //           className={`h-full rounded-full transition-all duration-500 ${tone.bar}`}
// //           style={{ width: `${Math.min(Math.max(ratio, 0), 100)}%` }}
// //         />
// //       </div>
// //     </div>
// //   );
// // }

// // function SkeletonCard() {
// //   return (
// //     <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200/70">
// //       <Skeleton className="h-16 w-16 shrink-0 rounded-2xl" />
// //       <div className="flex-1 space-y-2">
// //         <Skeleton className="h-4 w-24" />
// //         <Skeleton className="h-8 w-16" />
// //         <Skeleton className="h-3 w-20" />
// //       </div>
// //     </div>
// //   );
// // }

// // // ── Main ───────────────────────────────────────────────────────────────────────
// // export default function FarmStatsCards() {
// //   const { data, isLoading, isError } = useFarmSummary();
// //   const sheds = data?.sheds ?? [];

// //   if (isLoading) {
// //     return (
// //       <div className="space-y-8 bg-neutral-100 py-5">
// //         {[2, 2, 2].map((count, s) => (
// //           <div key={s} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
// //             {Array.from({ length: count }).map((_, i) => (
// //               <SkeletonCard key={i} />
// //             ))}
// //           </div>
// //         ))}
// //       </div>
// //     );
// //   }

// //   if (isError || !data) {
// //     return (
// //       <div className="bg-neutral-100 py-5">
// //         <div className="rounded-2xl bg-white p-5 text-center text-sm text-destructive shadow-sm">
// //           Failed to load farm summary.
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="space-y-8 bg-neutral-100 py-5">
// //       {/* ── Cow + Fish ── */}
// //       <Section title="Livestock & Fisheries">
// //         <StatCard
// //           label="Number of Cow"
// //           value={fmt(data.totalCows)}
// //           caption="Total Cows"
// //           accent="bg-emerald-600"
// //           iconBg="bg-emerald-100"
// //           iconColor="text-emerald-700"
// //           valueColor="text-emerald-700"
// //           Icon={CowIcon}
// //           path="/dashboard/cow-project"
// //         />
// //         <StatCard
// //           label="Fish"
// //           value={fmt(data.totalFish)}
// //           caption="Total Fish"
// //           accent="bg-sky-700"
// //           iconBg="bg-sky-100"
// //           iconColor="text-sky-800"
// //           valueColor="text-sky-800"
// //           Icon={Fish}
// //           path="/dashboard/fish-project"
// //         />
// //       </Section>

// //       {/* ── Chicken per shed ── */}
// //       <Section title="Chicken by Shed" badge={`Total: ${fmt(data.totalChicken)}`}>
// //         {sheds.length === 0 && (
// //           <p className="col-span-full text-sm text-neutral-400">No active chicken batch found.</p>
// //         )}
// //         {sheds.map((s) => (
// //           <StatCard
// //             key={`chicken-${s.shed}`}
// //             label={`Chicken · ${s.shed}`}
// //             value={fmt(s.totalChicken)}
// //             caption={`Total Chicken (${s.shed})`}
// //             accent="bg-orange-500"
// //             iconBg="bg-orange-100"
// //             iconColor="text-orange-500"
// //             valueColor="text-orange-500"
// //             Icon={ChickenIcon}
// //             path="/dashboard/chicken-project"
// //           />
// //         ))}
// //       </Section>

// //       {/* ── Egg ratio per shed ── */}
// //       <Section title="Egg Production Ratio by Shed" badge={`Overall: ${Number(data.eggRatio ?? 0)}%`}>
// //         {sheds.length === 0 && (
// //           <p className="col-span-full text-sm text-neutral-400">No production data found.</p>
// //         )}
// //         {sheds.map((s) => {
// //           const tone = ratioTone(Number(s.eggRatio ?? 0));
// //           return (
// //             <StatCard
// //               key={`egg-${s.shed}`}
// //               label={`Egg Ratio · ${s.shed}`}
// //               value={`${Number(s.eggRatio ?? 0)}%`}
// //               caption={`${fmt(s.eggQty)} eggs / ${fmt(s.totalChicken)} chicken`}
// //               accent={tone.bar}
// //               iconBg="bg-amber-100"
// //               iconColor="text-amber-600"
// //               valueColor={tone.text}
// //               Icon={Egg}
// //               path="/dashboard/chicken-project"
// //             >
// //               <RatioBar ratio={Number(s.eggRatio ?? 0)} />
// //             </StatCard>
// //           );
// //         })}
// //       </Section>
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
// // cols = lg screen e koyta column hobe (shed sonkha onujayi, max 4)
// function Section({ title, subtitle, cols = 4, children }) {
//   const c = Math.min(Math.max(cols, 1), 4);
//   return (
//     <section>
//       <div className="mb-3">
//         <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
//           {title}
//         </h2>
//         {subtitle && <p className="text-xs text-neutral-400">{subtitle}</p>}
//       </div>
//       <div
//         style={{ "--cols": c }}
//         className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
//       >
//         {children}
//       </div>
//     </section>
//   );
// }

// function StatCard({
//   label, value, caption, accent, iconBg, iconColor, valueColor, Icon, path, children,
// }) {
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
//       className={`relative flex h-full flex-col justify-center overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200/70 transition-all ${
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
//         <span className="text-neutral-400">100%</span>
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
//   const shedCols = Math.max(sheds.length, 1);

//   if (isLoading) {
//     return (
//       <div className="space-y-8">
//         {[4, 2, 2].map((count, s) => (
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
//       <div className="rounded-2xl bg-white p-5 text-center text-sm text-destructive shadow-sm">
//         Failed to load farm summary.
//       </div>
//     );
//   }

 

//   return (
//     <div className="space-y-8">
//       {/* ── Overview: Cow, Fish, Total Chicken, Overall Egg Ratio ── */}
//       <Section title="Farm Overview" cols={2}>
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
//       <Section title="Chicken by Shed" subtitle="Currently active batch" cols={shedCols}>
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
//       <Section title="Egg Production Ratio by Shed" subtitle="Based on latest production date" cols={shedCols}>
//         {sheds.length === 0 && (
//           <p className="col-span-full text-sm text-neutral-400">No production data found.</p>
//         )}
//         {sheds.map((s) => {
//           const ratio = Number(s.eggRatio ?? 0);
//           const tone = ratioTone(ratio);
//           return (
//             <StatCard
//               key={`egg-${s.shed}`}
//               label={`Egg Ratio · ${s.shed}`}
//               value={`${ratio}%`}
//               // caption={`${fmt(s.eggQty)} eggs / ${fmt(s.totalChicken)} chicken`}
//               accent={tone.bar}
//               iconBg="bg-amber-100"
//               iconColor="text-amber-600"
//               valueColor={tone.text}
//               Icon={Egg}
//               path="/dashboard/chicken-project"
//             >
//               <RatioBar ratio={ratio} />
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

// ── Data fetching (unchanged) ──────────────────────────────────────────────────
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

const ratioTone = (ratio) => {
  if (ratio >= 70)
    return {
      label: "Good",
      text: "text-emerald-600",
      bar: "bg-emerald-600",
      stroke: "stroke-emerald-600",
      badge: "bg-emerald-100 text-emerald-700",
    };
  if (ratio >= 40)
    return {
      label: "Average",
      text: "text-amber-600",
      bar: "bg-amber-500",
      stroke: "stroke-amber-500",
      badge: "bg-amber-100 text-amber-700",
    };
  return {
    label: "Low",
    text: "text-rose-600",
    bar: "bg-rose-500",
    stroke: "stroke-rose-500",
    badge: "bg-rose-100 text-rose-700",
  };
};

// Share-of-flock segment colors (shed er sonkha onujayi cycle korbe)
const SHARE_COLORS = ["bg-orange-600", "bg-orange-300", "bg-amber-500", "bg-yellow-300"];

const CARD = "rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200/70";
const NUM = "font-mono tabular-nums";

// ── Reusable pieces ────────────────────────────────────────────────────────────
// path thakle click kora jabe, na thakle normal div
function Clickable({ path, className = "", children }) {
  const navigate = useNavigate();
  if (!path) return <div className={className}>{children}</div>;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(path)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") navigate(path);
      }}
      className={`cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function KpiCard({ label, value, caption, Icon, tileBg, tileColor, path }) {
  return (
    <Clickable path={path} className={`${CARD} relative p-5`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-neutral-500">{label}</p>
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tileBg}`}>
          <Icon className={`h-[18px] w-[18px] ${tileColor}`} />
        </div>
      </div>
      <p className={`mt-3 text-4xl font-bold leading-none text-neutral-900 ${NUM}`}>{value}</p>
      <p className="mt-3 text-sm text-neutral-500">{caption}</p>
    </Clickable>
  );
}

function Donut({ ratio, tone, size = 92 }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  const pct = Math.min(Math.max(ratio, 0), 100);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 92 92" className="h-full w-full -rotate-90">
        <circle cx="46" cy="46" r={r} fill="none" strokeWidth="7" className="stroke-neutral-200" />
        <circle
          cx="46"
          cy="46"
          r={r}
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${(c * pct) / 100} ${c}`}
          className={`${tone.stroke} transition-all duration-500`}
        />
      </svg>
      <span
        className={`absolute inset-0 flex items-center justify-center text-[13px] font-bold text-neutral-900 ${NUM}`}
      >
        {ratio}%
      </span>
    </div>
  );
}

function ShedCard({ shed, total, ratio }) {
  const tone = ratioTone(ratio);
  return (
    <Clickable
      path="/dashboard/chicken-project"
      className="rounded-xl bg-white p-4 ring-1 ring-neutral-200"
    >
      <div className="flex items-center gap-4">
        <Donut ratio={ratio} tone={tone} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-neutral-900">{shed}</p>
          <p className={`text-3xl font-bold leading-tight text-orange-600 ${NUM}`}>{fmt(total)}</p>
          <p className="text-xs text-neutral-500">chickens · egg ratio</p>
          <span
            className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone.badge}`}
          >
            {tone.label}
          </span>
        </div>
      </div>
    </Clickable>
  );
}

function LivestockRow({ label, caption, value, valueColor, Icon, tileBg, tileColor, path }) {
  return (
    <Clickable path={path} className="flex items-center justify-between gap-3 py-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tileBg}`}>
          <Icon className={`h-5 w-5 ${tileColor}`} />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900">{label}</p>
          <p className="text-xs text-neutral-500">{caption}</p>
        </div>
      </div>
      <p className={`text-3xl font-bold ${valueColor} ${NUM}`}>{value}</p>
    </Clickable>
  );
}

function SkeletonLoader() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`${CARD} space-y-3 p-5`}>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
      <Skeleton className="h-40 rounded-2xl" />
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function FarmStatsCards() {
  const { data, isLoading, isError } = useFarmSummary();

  if (isLoading) return <SkeletonLoader />;

  if (isError || !data) {
    return (
      <div className="rounded-2xl bg-white p-5 text-center text-sm text-destructive shadow-sm">
        Failed to load farm summary.
      </div>
    );
  }

  const sheds = data.sheds ?? [];
  const totalChicken = sheds.reduce((sum, s) => sum + Number(s.totalChicken ?? 0), 0);
  const avgRatio = sheds.length
    ? sheds.reduce((sum, s) => sum + Number(s.eggRatio ?? 0), 0) / sheds.length
    : 0;
  const avgRatioText = `${Number(avgRatio.toFixed(2))}%`;
  const allGood = sheds.length > 0 && sheds.every((s) => Number(s.eggRatio ?? 0) >= 70);
 
  return (
    <div className="space-y-5">
            {/* ── KPI row ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total chickens"
          value={fmt(totalChicken)}
          caption={`${sheds.length} active ${sheds.length === 1 ? "shed" : "sheds"}`}
          Icon={ChickenIcon}
          tileBg="bg-orange-100"
          tileColor="text-orange-600"
          path="/dashboard/chicken-project"
        />
        <KpiCard
          label="Total fish"
          value={fmt(data.totalFish)}
          caption="Across all ponds"
          Icon={Fish}
          tileBg="bg-sky-100"
          tileColor="text-sky-700"
          path="/dashboard/fish-project"
        />
        <KpiCard
          label="Total cows"
          value={fmt(data.totalCows)}
          caption="Cattle on farm"
          Icon={CowIcon}
          tileBg="bg-lime-100"
          tileColor="text-lime-700"
          path="/dashboard/cow-project"
        />
        <KpiCard
          label="Avg egg ratio"
          value={avgRatioText}
          caption={sheds.length > 1 ? "Both sheds, latest date" : "Latest date"}
          Icon={Egg}
          tileBg="bg-emerald-100"
          tileColor="text-emerald-700"
          path="/dashboard/chicken-project"
        />
      </div>

      {/* ── Chickens by shed + Other livestock ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        <section className={`${CARD} p-5`}>
          <h2 className="text-base font-semibold text-neutral-900">Chickens by shed</h2>
          <p className="text-sm text-neutral-500">Currently active batch</p>

          {sheds.length === 0 ? (
            <p className="mt-6 text-sm text-neutral-400">No active chicken batch found.</p>
          ) : (
            <>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {sheds.map((s) => (
                  <ShedCard
                    key={`chicken-${s.shed}`}
                    shed={s.shed}
                    total={s.totalChicken}
                    ratio={Number(s.eggRatio ?? 0)}
                  />
                ))}
              </div>

              {/* Share of flock */}
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm text-neutral-500">
                  <span>Share of flock</span>
                  <span>{fmt(totalChicken)} total</span>
                </div>
                <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full bg-neutral-100">
                  {sheds.map((s, i) => {
                    const pct = totalChicken
                      ? (Number(s.totalChicken ?? 0) / totalChicken) * 100
                      : 0;
                    return (
                      <div
                        key={`share-${s.shed}`}
                        className={`${SHARE_COLORS[i % SHARE_COLORS.length]} h-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    );
                  })}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-neutral-700">
                  {sheds.map((s, i) => {
                    const pct = totalChicken
                      ? (Number(s.totalChicken ?? 0) / totalChicken) * 100
                      : 0;
                    return (
                      <span key={`legend-${s.shed}`} className="flex items-center gap-1.5">
                        <span
                          className={`h-2 w-2 rounded-full ${SHARE_COLORS[i % SHARE_COLORS.length]}`}
                        />
                        {s.shed}
                        <span className={`font-bold ${NUM}`}>{pct.toFixed(1)}%</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </section>

        <section className={`${CARD} p-5`}>
          <h2 className="text-base font-semibold text-neutral-900">Other livestock</h2>
          <p className="text-sm text-neutral-500">Current headcount</p>

          <div className="mt-3 divide-y divide-neutral-200">
            <LivestockRow
              label="Fish"
              caption="Total fish"
              value={fmt(data.totalFish)}
              valueColor="text-sky-700"
              Icon={Fish}
              tileBg="bg-sky-100"
              tileColor="text-sky-700"
              path="/dashboard/fish-project"
            />
            <LivestockRow
              label="Cows"
              caption="Total cows"
              value={fmt(data.totalCows)}
              valueColor="text-lime-700"
              Icon={CowIcon}
              tileBg="bg-lime-100"
              tileColor="text-lime-700"
              path="/dashboard/cow-project"
            />
          </div>
        </section>
      </div>

      {/* ── Egg production ratio by shed ── */}
      <section className={`${CARD} p-5`}>
        <h2 className="text-base font-semibold text-neutral-900">Egg production ratio by shed</h2>
        <p className="text-sm text-neutral-500">Based on latest production date</p>

        {sheds.length === 0 ? (
          <p className="mt-6 text-sm text-neutral-400">No production data found.</p>
        ) : (
          <>
            <div className="mt-5 space-y-4">
              {sheds.map((s) => {
                const ratio = Number(s.eggRatio ?? 0);
                const tone = ratioTone(ratio);
                return (
                  <Clickable
                    key={`egg-${s.shed}`}
                    path="/dashboard/chicken-project"
                    className="flex items-center gap-4"
                  >
                    <span className="w-14 shrink-0 text-sm font-semibold text-neutral-900">
                      {s.shed}
                    </span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-neutral-200">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${tone.bar}`}
                        style={{ width: `${Math.min(Math.max(ratio, 0), 100)}%` }}
                      />
                    </div>
                    <span
                      className={`w-16 shrink-0 text-right text-sm font-bold text-neutral-900 ${NUM}`}
                    >
                      {ratio}%
                    </span>
                  </Clickable>
                );
              })}
            </div>
            <p className="mt-5 text-sm text-neutral-500">
              Bars show the ratio out of 100%.
              {allGood && " All sheds are rated Good."}
            </p>
          </>
        )}
      </section>
    </div>
  );
}