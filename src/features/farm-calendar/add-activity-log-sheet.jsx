import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { NotebookPen, Trash2, ArrowLeft } from "lucide-react";
import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  useActivityLogsByDetailId,
  useCreateActivityLog,
  useUpdateActivityLog,
  useDeleteActivityLog,
} from "./queries";
import { useAuthV2 } from "@/features/authentication-v2/use-auth-v2";

const formSchema = z.object({
  activityDate:     z.string().min(1, "Date is required"),
  actualQty:        z.coerce.number().optional().or(z.literal("")),
  actualCost:       z.coerce.number().optional().or(z.literal("")),
  actualRevenue:    z.coerce.number().optional().or(z.literal("")),
  unit:             z.string().optional(),
  completionStatus: z.string().optional(),
  comments:         z.string().optional(),
});

const emptyValues = {
  activityDate: "", actualQty: "", actualCost: "", actualRevenue: "",
  unit: "", completionStatus: "COMPLETED", comments: "",
};

const formatDate = (val) => {
  if (!val) return "—";
  const isoMatch = String(val).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!isoMatch) return "—";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const [, year, month, day] = isoMatch;
  return `${day} ${months[Number(month) - 1]} ${year}`;
};

const statusVariant = (status) => {
  if (status === "COMPLETED") return "default";
  if (status === "PARTIAL") return "secondary";
  if (status === "SKIPPED") return "destructive";
  return "outline";
};

export default function ActivityLogSheet({ open, onOpenChange, showConfirmation, detail }) {
  const detailId = detail?.DETAIL_ID;
  const { user } = useAuthV2();

  const [mode, setMode] = useState("list"); // "list" | "form"
  const [editingRecord, setEditingRecord] = useState(null);

  const { data: logs = [], isLoading } = useActivityLogsByDetailId(detailId);
  const createMutation = useCreateActivityLog(detailId);
  const updateMutation = useUpdateActivityLog(detailId);
  const deleteMutation = useDeleteActivityLog(detailId);

  const form = useForm({ resolver: zodResolver(formSchema), defaultValues: emptyValues });
  const { formState: { isDirty } } = form;

  useEffect(() => {
    if (open) {
      setMode("list");
      setEditingRecord(null);
      form.reset(emptyValues);
    }
  }, [open]);

  const openAddForm = () => {
    setEditingRecord(null);
    form.reset(emptyValues);
    setMode("form");
  };

  const openEditForm = (record) => {
    setEditingRecord(record);
    form.reset({
      activityDate:     record.ACTIVITY_DATE ?? "",
      actualQty:        record.ACTUAL_QTY ?? "",
      actualCost:       record.ACTUAL_COST ?? "",
      actualRevenue:    record.ACTUAL_REVENUE ?? "",
      unit:             record.UNIT ?? "",
      completionStatus: record.COMPLETION_STATUS ?? "COMPLETED",
      comments:         record.COMMENTS ?? "",
    });
    setMode("form");
  };

  const backToList = async () => {
    if (isDirty && showConfirmation) {
      const confirmed = await showConfirmation({
        title: "Discard changes?",
        description: "You have unsaved changes. Are you sure you want to go back without saving?",
        confirmText: "Discard",
        cancelText: "Keep Editing",
        variant: "destructive",
      });
      if (!confirmed) return;
    }
    setMode("list");
    setEditingRecord(null);
  };

  const onSubmit = async (data) => {
    const payload = {
      detailId,
      activityDate:     data.activityDate,
      actualQty:        data.actualQty === "" ? null : data.actualQty,
      actualCost:       data.actualCost === "" ? null : data.actualCost,
      actualRevenue:    data.actualRevenue === "" ? null : data.actualRevenue,
      unit:             data.unit || null,
      completionStatus: data.completionStatus || null,
      comments:         data.comments || null,
      completedBy:      user?.username || null,
    };
    try {
      if (editingRecord) {
        await updateMutation.mutateAsync({ id: editingRecord.LOG_ID, data: payload });
        toast.success("Log updated successfully!");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Log added successfully!");
      }
      setMode("list");
      setEditingRecord(null);
    } catch (err) {
      toast.error(err?.message || "Failed to save log. Please try again.");
    }
  };

  const handleDelete = async (record) => {
    const confirmed = await showConfirmation({
      title: "Delete log?",
      description: `Are you sure you want to delete this log from ${formatDate(record.ACTIVITY_DATE)}? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });
    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(record.LOG_ID);
        toast.success("Log deleted successfully!");
      } catch (err) {
        toast.error(err?.message || "Failed to delete log. Please try again.");
      }
    }
  };

  const handleSheetClose = async (isOpen) => {
    if (!isOpen) {
      if (mode === "form" && isDirty && showConfirmation) {
        const confirmed = await showConfirmation({
          title: "Discard changes?",
          description: "You have unsaved changes. Are you sure you want to close without saving?",
          confirmText: "Discard",
          cancelText: "Keep Editing",
          variant: "destructive",
        });
        if (!confirmed) return;
      }
      onOpenChange(false);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={handleSheetClose}>
      <SheetContent className="sm:max-w-lg w-full flex flex-col gap-0 p-0 z-105">
        <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            {mode === "form" && (
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={backToList}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <NotebookPen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>
                {mode === "list"
                  ? "Activity Logs"
                  : editingRecord ? "Edit Log" : "Add Log"}
              </SheetTitle>
              <SheetDescription>
                {detail?.ACTIVITY_NAME ? `For: ${detail.ACTIVITY_NAME}` : "Track actual completion records"}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {mode === "list" ? (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex justify-end px-6 py-3 border-b border-border shrink-0">
              <Button size="sm" onClick={openAddForm}>
                <IconCircleDashedPlus className="mr-1 h-4 w-4" /> Add Log
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Spinner className="h-8 w-8 mb-3" />
                  <p className="text-sm text-muted-foreground">Loading logs...</p>
                </div>
              ) : logs.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon"><NotebookPen /></EmptyMedia>
                    <EmptyTitle>No logs added yet</EmptyTitle>
                    <EmptyDescription>Record the first completion log for this activity.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div key={log.LOG_ID} className="border border-border rounded-md p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{formatDate(log.ACTIVITY_DATE)}</span>
                            {log.COMPLETION_STATUS && (
                              <Badge variant={statusVariant(log.COMPLETION_STATUS)} className="text-xs">
                                {log.COMPLETION_STATUS}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3">
                            {log.ACTUAL_QTY != null && <span>Qty: {log.ACTUAL_QTY} {log.UNIT || ""}</span>}
                            {log.ACTUAL_COST != null && <span>Cost: {log.ACTUAL_COST}</span>}
                            {log.ACTUAL_REVENUE != null && <span>Revenue: {log.ACTUAL_REVENUE}</span>}
                          </div>
                          {log.COMPLETED_BY && (
                            <div className="text-xs text-muted-foreground mt-1">By: {log.COMPLETED_BY}</div>
                          )}
                          {log.COMMENTS && (
                            <div className="text-xs text-muted-foreground mt-1 italic">"{log.COMMENTS}"</div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditForm(log)}>
                            <IconEdit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(log)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                <FormField control={form.control} name="activityDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Date <span className="text-destructive">*</span></FormLabel>
                    <FormControl><Input type="date" disabled={isSubmitting} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="completionStatus" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="PARTIAL">Partial</SelectItem>
                        <SelectItem value="SKIPPED">Skipped</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="actualQty" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Actual Quantity</FormLabel>
                    <FormControl><Input type="number" placeholder="Optional" disabled={isSubmitting} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="unit" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl><Input placeholder="e.g. kg, pcs" disabled={isSubmitting} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="actualCost" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Actual Cost</FormLabel>
                    <FormControl><Input type="number" placeholder="Optional" disabled={isSubmitting} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="actualRevenue" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Actual Revenue</FormLabel>
                    <FormControl><Input type="number" placeholder="Optional" disabled={isSubmitting} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="comments" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comments</FormLabel>
                    <FormControl><Textarea rows={3} placeholder="Optional note" disabled={isSubmitting} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="flex justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
                <Button type="button" variant="outline" onClick={backToList} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? <><Spinner className="mr-2 h-4 w-4" />Saving...</>
                    : editingRecord ? "Save Changes" : "Add Log"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
}