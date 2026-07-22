import { Wallet, Calendar, Building2 } from "lucide-react";
import { IconEdit } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_VARIANT = {
  DRAFT:     "secondary",
  SUBMITTED: "outline",
  APPROVED:  "default",
  REJECTED:  "destructive",
};

export default function HeaderSummaryCard({ budget, isLoading, onEdit }) {
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

  if (!budget) return null;

  return (
    <div className="bg-card rounded-md shadow-sm p-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-semibold tracking-tight">
              Budget #{budget.BUDGET_ID}
            </h1>
            <p className="text-sm text-muted-foreground">
              {budget.B_MONTH} {budget.BUDGET_YEAR}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={STATUS_VARIANT[budget.STATUS] || "secondary"}>
            {budget.STATUS || "DRAFT"}
          </Badge>
          <Button variant="outline" onClick={onEdit}>
            <IconEdit className="h-4 w-4 mr-1" /> Edit
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 pt-4 border-t border-border text-sm">
        {budget.FARM_NAME && (
          <div className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Farm:</span>
            <span className="font-medium">{budget.FARM_NAME}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Created:</span>
          <span className="font-medium">{budget.CREATED_DATE || "—"}</span>
        </div>
      </div>
    </div>
  );
}