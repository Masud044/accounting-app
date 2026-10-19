import { Bird, Calendar, Layers, Hash, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const SENTINEL_DATE = "2050-12-31";

const formatDate = (val) => {
  if (!val) return "—";
  const isoMatch = String(val).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!isoMatch) return "—";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const [, year, month, day] = isoMatch;
  return `${day} ${months[Number(month) - 1]} ${year}`;
};

const formatPeriod = (detail) => {
  if (!detail?.FROM_DATE) return "—";
  const isOngoing = !detail.TO_DATE || String(detail.TO_DATE).startsWith(SENTINEL_DATE);
  return `${formatDate(detail.FROM_DATE)} – ${isOngoing ? "Current" : formatDate(detail.TO_DATE)}`;
};

export default function MortalityHeaderSummaryCard({ project, detail, totalDied, isLoading }) {
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

  if (!detail) return null;

  return (
    <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
      {/* Header Section */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-sm flex-shrink-0">
            <Bird className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-gray-900 truncate">
                Mortality for Detail #{detail.ID}
              </h1>
              {project?.ID && (
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 flex-shrink-0">
                  Batch #{project.ID}
                </Badge>
              )}
            </div>
            {detail.DESCRIPTION && (
              <p className="text-sm text-gray-500 truncate max-w-md">{detail.DESCRIPTION}</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
        <div className="px-4 py-3.5">
          <div className="flex items-center gap-2">
            <Hash className="h-3.5 w-3.5 text-emerald-600" />
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Detail Quantity</p>
          </div>
          <p className="text-lg font-bold text-gray-900 mt-0.5">
            {Number(detail.QTY || 0).toLocaleString()}
          </p>
        </div>

        <div className="px-4 py-3.5">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-emerald-600" />
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Detail Period</p>
          </div>
          <p className="text-sm font-semibold text-gray-800 mt-0.5">{formatPeriod(detail)}</p>
        </div>

        <div className="px-4 py-3.5">
          <div className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-emerald-600" />
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Lot</p>
          </div>
          <p className="text-lg font-bold text-gray-900 mt-0.5">{project?.LOT || "—"}</p>
        </div>

        <div className="px-4 py-3.5">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-3.5 w-3.5 text-amber-600" />
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Died</p>
          </div>
          <p className="text-lg font-bold text-gray-900 mt-0.5">
            {Number(totalDied || 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}