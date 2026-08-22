// import { Bird, Calendar, Layers, Hash } from "lucide-react";
// import { IconEdit } from "@tabler/icons-react";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";

// const formatDate = (val) => {
//   if (!val) return "—";
//   const isoMatch = String(val).match(/(\d{4})-(\d{2})-(\d{2})/);
//   if (!isoMatch) return "—";
//   const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
//   const [, year, month, day] = isoMatch;
//   return `${day} ${months[Number(month) - 1]} ${year}`;
// };

// export default function HeaderSummaryCard({ project, isLoading, onEdit }) {
//   if (isLoading) {
//     return (
//       <div className="bg-card rounded-md shadow-sm p-4 mb-4">
//         <Skeleton className="h-6 w-48 mb-3" />
//         <div className="flex gap-6">
//           <Skeleton className="h-4 w-32" />
//           <Skeleton className="h-4 w-32" />
//           <Skeleton className="h-4 w-24" />
//         </div>
//       </div>
//     );
//   }

//   if (!project) return null;

//   return (
//     <div className="bg-card rounded-md shadow-sm p-4 mb-4">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div className="flex items-center gap-3">
//           <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
//             <Bird className="h-5 w-5 text-primary" />
//           </div>
//           <div>
//             <h1 className="text-lg md:text-2xl font-semibold tracking-tight">
//               Chicken batch #{project.ID}
//             </h1>
//             {project.DESCRIPTION && (
//               <p className="text-sm text-muted-foreground max-w-md truncate">
//                 {project.DESCRIPTION}
//               </p>
//             )}
//           </div>
//         </div>
//         <Button variant="outline" onClick={onEdit}>
//           <IconEdit className="h-4 w-4 mr-1" /> Edit
//         </Button>
//       </div>

//       <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 pt-4 border-t border-border text-sm">
//         <div className="flex items-center gap-1.5">
//           <Hash className="h-3.5 w-3.5 text-muted-foreground" />
//           <span className="text-muted-foreground">Chicken number:</span>
//           <span className="font-medium tabular-nums">
//             {Number(project.CHICKEN_NUMBER || 0).toLocaleString()}
//           </span>
//         </div>
//         <div className="flex items-center gap-1.5">
//           <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
//           <span className="text-muted-foreground">Period:</span>
//           <span className="font-medium">
//             {formatDate(project.FROM_DATE)} – {formatDate(project.TODATE)}
//           </span>
//         </div>
//         {project.LOT != null && project.LOT !== "" && (
//           <div className="flex items-center gap-1.5">
//             <Layers className="h-3.5 w-3.5 text-muted-foreground" />
//             <span className="text-muted-foreground">Lot:</span>
//             <span className="font-medium tabular-nums">{project.LOT}</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { Bird, Calendar, Layers, Hash, MapPin, Package, Tag, Clock } from "lucide-react";
import { IconEdit } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const formatDate = (val) => {
  if (!val) return "—";
  const isoMatch = String(val).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!isoMatch) return "—";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const [, year, month, day] = isoMatch;
  return `${day} ${months[Number(month) - 1]} ${year}`;
};

export default function HeaderSummaryCard({ project, isLoading, onEdit }) {
  if (isLoading) {
    return (
      <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-7 w-48" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
      {/* Header Section */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-sm flex-shrink-0">
              <Bird className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-gray-900 truncate">
                  Chicken Batch #{project.ID}
                </h1>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 flex-shrink-0">
                  Active
                </Badge>
              </div>
              {project.DESCRIPTION && (
                <p className="text-sm text-gray-500 truncate max-w-md">
                  {project.DESCRIPTION}
                </p>
              )}
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onEdit}
            className="border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 flex-shrink-0"
          >
            <IconEdit className="h-3.5 w-3.5 mr-1.5" /> Edit Batch
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
        <div className="px-4 py-3.5">
          <div className="flex items-center gap-2">
            <Hash className="h-3.5 w-3.5 text-emerald-600" />
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Chicken Number</p>
          </div>
          <p className="text-lg font-bold text-gray-900 mt-0.5">
            {Number(project.CHICKEN_NUMBER || 0).toLocaleString()}
          </p>
        </div>
        <div className="px-4 py-3.5">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-emerald-600" />
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Period</p>
          </div>
          <p className="text-sm font-semibold text-gray-800 mt-0.5">
            {formatDate(project.FROM_DATE)} – {formatDate(project.TODATE)}
          </p>
        </div>
        <div className="px-4 py-3.5">
          <div className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-emerald-600" />
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Lot</p>
          </div>
          <p className="text-lg font-bold text-gray-900 mt-0.5">
            {project.LOT || "—"}
          </p>
        </div>
        <div className="px-4 py-3.5">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-emerald-600" />
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Shade</p>
          </div>
          <p className="text-lg font-bold text-gray-900 mt-0.5">
            {project.SHADE || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}