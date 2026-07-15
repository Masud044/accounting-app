import { useState } from "react";
import { Trash2, AlertCircle, RefreshCw, Syringe } from "lucide-react";
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

import { useCowMedicineByCow, useDeleteCowMedicine } from "./queries";
import AddVaccineSheet from "./add-vaccine-sheet";
import UpdateVaccineSheet from "./update-vaccine-sheet";

const formatDate = (val) => {
  if (!val) return "—";
  const isoMatch = String(val).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!isoMatch) return "—";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const [, year, month, day] = isoMatch;
  return `${day} ${months[Number(month) - 1]} ${year}`;
};

const fmtAmt = (v) =>
  v === null || v === undefined
    ? "—"
    : Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function VaccineTab({ cowNo, cowLabel }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const { data: records = [], isLoading, isError, error, refetch, isFetching } = useCowMedicineByCow(cowNo);
  const deleteMutation = useDeleteCowMedicine();

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsUpdateOpen(true);
  };

  const handleDelete = async (record) => {
    const confirmed = await showConfirmation({
      title: "Delete vaccine record?",
      description: `Are you sure you want to delete this vaccine record? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });
    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(record.ID);
        toast.success("Vaccine record deleted successfully!");
      } catch (err) {
        toast.error(err?.message || "Failed to delete record. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Spinner className="h-10 w-10 mb-4" />
        <p className="text-muted-foreground">Loading vaccine history...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Records</AlertTitle>
        <AlertDescription className="mt-2 flex flex-col gap-2">
          <p>{error?.message || "Failed to load vaccine history."}</p>
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
          <IconCircleDashedPlus className="mr-1" />Add Vaccine
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vaccine Name</TableHead>
              <TableHead>Vaccine Date</TableHead>
              <TableHead>Next Vaccine Date</TableHead>
              <TableHead className="text-right">Price With Doctor</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length ? (
              records.map((r) => (
                <TableRow key={r.ID}>
                  <TableCell className="font-medium">{r.VACCINE_NAME}</TableCell>
                  <TableCell>{formatDate(r.VACCINE_DATE)}</TableCell>
                  <TableCell>{formatDate(r.NEXT_VACCINE_DATE)}</TableCell>
                  <TableCell className="text-right tabular-nums">{fmtAmt(r.PRICE_WITH_DOCTOR)}</TableCell>
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
                <TableCell colSpan={5} className="h-24 text-center">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon"><Syringe /></EmptyMedia>
                      <EmptyTitle>No Vaccine Records</EmptyTitle>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isAddOpen && (
        <AddVaccineSheet
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          showConfirmation={showConfirmation}
          cowNo={cowNo}
          cowLabel={cowLabel}
        />
      )}
      {isUpdateOpen && (
        <UpdateVaccineSheet
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