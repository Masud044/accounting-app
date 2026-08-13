import { useEffect } from "react";
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
import { CalendarCog } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { useUpdateLedgerPeriod, usePeriodTypes } from "./queries";

const formSchema = z.object({
  periodTypeId: z.string().min(1, "Period type is required"),
  periodNo:     z.coerce.number().min(1, "Period No is required").max(13, "Period No must be 1-13"),
  periodName:   z.string().min(1, "Period name is required"),
  startDate:    z.string().min(1, "Start date is required"),
  endDate:      z.string().min(1, "End date is required"),
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export default function EditLedgerPeriodSheet({ open, onOpenChange, period, fiscalYearId }) {
  const updateMutation = useUpdateLedgerPeriod();
  const { data: periodTypes = [] } = usePeriodTypes();
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      periodTypeId: "",
      periodNo:     "",
      periodName:   "",
      startDate:    "",
      endDate:      "",
    },
  });

  const { formState: { isDirty } } = form;

  useEffect(() => {
    if (open && period) {
      form.reset({
        periodTypeId: period.periodTypeId ? String(period.periodTypeId) : "",
        periodNo:     period.no ?? "",
        periodName:   period.name ?? "",
        startDate:    period.start ?? "",
        endDate:      period.end ?? "",
      });
    }
  }, [open, period]);

  const onSubmit = async (data) => {
    try {
      await updateMutation.mutateAsync({
        id: period.periodId,
        fiscalYearId,
        periodTypeId: Number(data.periodTypeId),
        periodNo:     data.periodNo,
        periodName:   data.periodName,
        startDate:    data.startDate,
        endDate:      data.endDate,
      });
      toast.success("Ledger period updated successfully!");
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to update ledger period. Please try again.");
    }
  };

  const handleCancel = async () => {
    if (isDirty) {
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
  };

  const isSubmitting = updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) handleCancel(); }}>
      <SheetContent className="sm:max-w-md w-full flex flex-col gap-0 p-0 z-105">

        <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <CalendarCog className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Edit Ledger Period</SheetTitle>
              <SheetDescription>Update this period's dates, name, or type</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              <FormField control={form.control} name="periodTypeId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Period Type <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select period type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {periodTypes.map((t) => (
                        <SelectItem key={t.PERIOD_TYPE_ID} value={String(t.PERIOD_TYPE_ID)}>
                          {t.TYPE_NAME} ({t.TYPE_CODE})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="periodNo" render={({ field }) => (
                <FormItem>
                  <FormLabel>Period No <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={13} disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="periodName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Period Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="startDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="date" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="endDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="date" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Saving...</> : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
      <ConfirmationDialog />
    </Sheet>
  );
}