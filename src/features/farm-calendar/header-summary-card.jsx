import { CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { IconEdit } from "@tabler/icons-react";

const statusVariant = (status) => {
  if (status === "ACTIVE") return "default";
  if (status === "COMPLETED") return "secondary";
  if (status === "CANCELLED") return "destructive";
  return "outline";
};

export default function HeaderSummaryCard({ record, isLoading, onEdit }) {
  if (isLoading || !record) {
    return (
      <div className="bg-card rounded-md shadow-sm p-4 mb-4">
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-md shadow-sm p-4 mb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <CalendarRange className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-2xl font-semibold tracking-tight">
                {record.FARM_NAME}
              </h1>
              <Badge variant={statusVariant(record.STATUS)}>{record.STATUS}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Calendar Year: {record.CALENDAR_YEAR}
              {record.DESCRIPTION ? ` · ${record.DESCRIPTION}` : ""}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <IconEdit className="mr-1 h-4 w-4" /> Edit
        </Button>
      </div>
    </div>
  );
}