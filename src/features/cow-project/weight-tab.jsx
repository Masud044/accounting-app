import { useState } from "react";
import { Trash2, AlertCircle, RefreshCw, Scale } from "lucide-react";
import { toast } from "react-toastify";
import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

import { useCowWeightByCow, useDeleteCowWeight } from "./queries";
import AddWeightSheet from "./add-weight-sheet";
import UpdateWeightSheet from "./update-weight-sheet";

const formatDate = (val) => {
  if (!val) return "—";
  const isoMatch = String(val).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!isoMatch) return "—";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const [, year, month, day] = isoMatch;
  return `${day} ${months[Number(month) - 1]} ${year}`;
};

export default function WeightTab({ cowNo, cowLabel }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const { data: records = [], isLoading, isError, error, refetch, isFetching } = useCowWeightByCow(cowNo);
  const deleteMutation = useDeleteCowWeight();

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsUpdateOpen(true);
  };

  const handleDelete = async (record) => {
    const confirmed = await showConfirmation({
      title: "Delete weight record?",
      description: `Are you sure you want to delete this weight record? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });
    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(record.ID);
        toast.success("Weight record deleted successfully!");
      } catch (err) {
        toast.error(err?.message || "Failed to delete record. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Spinner className="h-10 w-10 mb-4" />
        <p className="text-muted-foreground">Loading weight history...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Records</AlertTitle>
        <AlertDescription className="mt-2 flex flex-col gap-2">
          <p>{error?.message || "Failed to load weight history."}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
            {isFetching ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</> : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh</span>
        </Button>
        <Button onClick={() => setIsAddOpen(true)}>
          <IconCircleDashedPlus className="mr-1" />Add Weight
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Weight Date</TableHead>
              <TableHead className="text-right">Weight</TableHead>
              <TableHead className="text-right">Interval (days)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length ? (
              records.map((r) => (
                <TableRow key={r.ID}>
                  <TableCell className="font-medium">{formatDate(r.WEIGT_DATE)}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.WEIGHT ?? "—"}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.INTERVAL_DAYS ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(r)}>
                        <IconEdit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(r)}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? <Spinner className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon"><Scale /></EmptyMedia>
                      <EmptyTitle>No Weight Records</EmptyTitle>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isAddOpen && (
        <AddWeightSheet
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          showConfirmation={showConfirmation}
          cowNo={cowNo}
          cowLabel={cowLabel}
        />
      )}
      {isUpdateOpen && (
        <UpdateWeightSheet
          open={isUpdateOpen}
          onOpenChange={setIsUpdateOpen}
          showConfirmation={showConfirmation}
          record={selectedRecord}
          cowNo={cowNo}
        />
      )}
      <ConfirmationDialog />
    </div>
  );
}