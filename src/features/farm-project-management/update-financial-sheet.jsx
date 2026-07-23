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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TrendingUp } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateFinancialProjection } from "./queries";

const formSchema = z.object({
  projectionScope: z.string().min(1, "Scope is required").max(20),
  revenueAmount:   z.coerce.number({ invalid_type_error: "Number required" }),
  operatingCost:   z.coerce.number({ invalid_type_error: "Number required" }),
});

const formatAmount = (val) =>
  Number.isFinite(val) ? val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—";

export default function UpdateProjectionSheet({ open, onOpenChange, showConfirmation, record, projectId }) {
  const updateMutation = useUpdateFinancialProjection(projectId);

  const form = useForm({ resolver: zodResolver(formSchema) });
  const { formState: { isDirty } } = form;

  useEffect(() => {
    if (open && record) {
      form.reset({
        projectionScope: record.PROJECTION_SCOPE || "",
        revenueAmount:   record.REVENUE_AMOUNT ?? "",
        operatingCost:   record.OPERATING_COST ?? "",
      });
    }
  }, [open, record]);

  const revenue = Number(form.watch("revenueAmount"));
  const cost = Number(form.watch("operatingCost"));
  const grossProfit = Number.isFinite(revenue) && Number.isFinite(cost) ? revenue - cost : null;

  const onSubmit = async (data) => {
    try {
      await updateMutation.mutateAsync({
        id: record.PROJECTION_ID,
        data: {
          projectionScope: data.projectionScope,
          revenueAmount:    data.revenueAmount,
          operatingCost:    data.operatingCost,
        },
      });
      toast.success("Financial projection updated successfully!");
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to update projection. Please try again.");
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
    onOpenChange(false);
  };

  const isSubmitting = updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) handleCancel(); }}>
      <SheetContent className="sm:max-w-md w-full flex flex-col gap-0 p-0 z-105">
        <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Edit Financial Projection</SheetTitle>
              <SheetDescription>Update this projection's details</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <FormField control={form.control} name="projectionScope" render={({ field }) => (
                <FormItem>
                  <FormLabel>Scope <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input disabled={isSubmitting} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="revenueAmount" render={({ field }) => (
                <FormItem>
                  <FormLabel>Revenue Amount <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input type="number" step="0.01" disabled={isSubmitting} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="operatingCost" render={({ field }) => (
                <FormItem>
                  <FormLabel>Operating Cost <span className="text-destructive">*</span></FormLabel>
                  <FormControl><Input type="number" step="0.01" disabled={isSubmitting} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="rounded-md border bg-muted/40 px-4 py-3">
                <p className="text-sm text-muted-foreground">Gross Profit (auto-calculated)</p>
                <p className={`text-lg font-semibold tabular-nums ${grossProfit != null && grossProfit < 0 ? "text-destructive" : ""}`}>
                  {formatAmount(grossProfit)}
                </p>
              </div>
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
    </Sheet>
  );
}