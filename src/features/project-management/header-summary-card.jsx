import { FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IconEdit } from "@tabler/icons-react";

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
            <FolderKanban className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-semibold tracking-tight">
              {record.PROJECT_NAME}
            </h1>
            <p className="text-sm text-muted-foreground">
              {record.PROJECT_LOCATION || "—"} · {record.OWNER_NAME || "—"} · {record.CONTACT_NUMBER || "—"} · {record.BUSINESS_TYPE || "—"} · {record.DURATION_DESC || "—"}
            </p>
            {record.EXECUTIVE_SUMMARY && (
              <p className="text-sm text-muted-foreground mt-1 max-w-3xl line-clamp-2">
                {record.EXECUTIVE_SUMMARY}
              </p>
            )}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <IconEdit className="mr-1 h-4 w-4" /> Edit
        </Button>
      </div>
    </div>
  );
}