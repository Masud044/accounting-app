import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ListChecks } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useCreateActivityLog } from "./queries";

const formSchema = z.object({
  activityDate:     z.string().min(1, "Activity date is required"),
  actualQty:        z.coerce.number().optional().or(z.literal("")),
  actualCost:       z.coerce.number().optional().or(z.literal("")),
  actualRevenue:    z.coerce.number().optional().or(z.literal("")),
  unit:             z.string().max(30).optional(),
  completedBy:      z.string().max(100).optional(),
  completionStatus: z.string().min(1, "Status is required"),
  comments:         z.string().max(1000).optional(),
});

const defaultValues = {
  activityDate: "", actualQty: "", actualCost: "", actualRevenue: "",
  unit: "", completedBy: "", completionStatus: "PENDING", comments: "",
};

export default function AddActivityLogSheet({ open, onOpenChange, showConfirmation, detailId }) {
  const createMutation = useCreateActivityLog(detailId);

  const form = useForm({ resolver: zodResolver(formSchema), defaultValues });
  const { formState: { isDirty } } = form;

  useEffect(() => { if (open) form.reset(defaultValues); }, [open]);

  const onSubmit = async (data) => {
    try {
      await createMutation.mutateAsync({
        detailId:         Number(detailId),
        activityDate:     data.activityDate,
        actualQty:        data.actualQty === "" ? null : data.actualQty,
        actualCost:       data.actualCost === "" ? null : data.actualCost,
        actualRevenue:    data.actualRevenue === "" ? null : data.actualRevenue,
        unit:             data.unit || null,
        completedBy:      data.completedBy || null,
        completionStatus: data.completionStatus,
        comments:         data.comments || null,
      });
      toast.success("Activity log added successfully!");
      form.reset(defaultValues);
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to add log. Please try again.");
    }
  };

  const handleCancel = async () => {
    if (isDirty && showConfirmation) {
      const confirmed = await showConfirmation({
        title: "Discard changes?",
        description: "You have unsaved changes. Are you sure you want to close without saving?",
        confirmText: "Discard",
        cancelText: "Keep Editing",
        variant: "destructive",
      });
      if (!confirmed) return;
    }
    form.reset(defaultValues);
    onOpenChange(false);
  };

  const isSubmitting = createMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) handleCancel(); }}>
      <SheetContent className="sm:max-w-md w-full flex flex-col gap-0 p-0 z-105">
        <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <ListChecks className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Add Activity Log</SheetTitle>
              <SheetDescription>Record actual activity performance</SheetDescription>
            </div>
          </div>
        </SheetHeader>

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
                  <FormLabel>Status <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                    <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent className="z-110">
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="actualQty" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl><Input type="number" step="0.01" placeholder="Optional" disabled={isSubmitting} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="unit" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl><Input placeholder="e.g. Kg" disabled={isSubmitting} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="actualCost" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost</FormLabel>
                    <FormControl><Input type="number" step="0.01" placeholder="Optional" disabled={isSubmitting} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="actualRevenue" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Revenue</FormLabel>
                    <FormControl><Input type="number" step="0.01" placeholder="Optional" disabled={isSubmitting} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="completedBy" render={({ field }) => (
                <FormItem>
                  <FormLabel>Completed By</FormLabel>
                  <FormControl><Input placeholder="Optional" disabled={isSubmitting} {...field} /></FormControl>
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
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Adding...</> : "Add Log"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}