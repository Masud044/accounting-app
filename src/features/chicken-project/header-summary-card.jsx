import { Bird, Calendar, Layers, Hash } from "lucide-react";
import { IconEdit } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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
      <div className="bg-card rounded-md shadow-sm p-4 mb-4">
        <Skeleton className="h-6 w-48 mb-3" />
        <div className="flex gap-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="bg-card rounded-md shadow-sm p-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Bird className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-semibold tracking-tight">
              Chicken batch #{project.ID}
            </h1>
            {project.DESCRIPTION && (
              <p className="text-sm text-muted-foreground max-w-md truncate">
                {project.DESCRIPTION}
              </p>
            )}
          </div>
        </div>
        <Button variant="outline" onClick={onEdit}>
          <IconEdit className="h-4 w-4 mr-1" /> Edit
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 pt-4 border-t border-border text-sm">
        <div className="flex items-center gap-1.5">
          <Hash className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Chicken number:</span>
          <span className="font-medium tabular-nums">
            {Number(project.CHICKEN_NUMBER || 0).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Period:</span>
          <span className="font-medium">
            {formatDate(project.FROM_DATE)} – {formatDate(project.TODATE)}
          </span>
        </div>
        {project.LOT != null && project.LOT !== "" && (
          <div className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Lot:</span>
            <span className="font-medium tabular-nums">{project.LOT}</span>
          </div>
        )}
      </div>
    </div>
  );
}