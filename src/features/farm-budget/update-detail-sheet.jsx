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
import { ClipboardList } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateFarmBudgetDetail } from "./queries";

const formSchema = z.object({
  farmType:     z.string().min(1, "Farm type is required"),
  expenseHead:  z.string().min(1, "Expense head is required"),
  budgetMonth:  z.coerce.number({ invalid_type_error: "Month is required" }).min(1).max(12),
  expenseCode:  z.string().max(30).optional(),
  budgetAmount: z.coerce.number({ invalid_type_error: "Amount must be a number" }).min(0, "Cannot be negative"),
});

const defaultValues = {
  farmType:     "",
  expenseHead:  "",
  budgetMonth:  "",
  expenseCode:  "",
  budgetAmount: "",
};

export default function UpdateFarmBudgetDetailSheet({ open, onOpenChange, showConfirmation, record, budgetId }) {
  const updateMutation = useUpdateFarmBudgetDetail(budgetId);

  const form = useForm({ resolver: zodResolver(formSchema), defaultValues });
  const { formState: { isDirty } } = form;

  useEffect(() => {
    if (open && record) {
      form.reset({
        farmType:     record.FARM_TYPE ?? "",
        expenseHead:  record.EXPENSE_HEAD ?? "",
        budgetMonth:  record.BUDGET_MONTH ?? "",
        expenseCode:  record.EXPENSE_CODE ?? "",
        budgetAmount: record.BUDGET_AMOUNT ?? "",
      });
    }
  }, [open, record?.BUDGET_DETAIL_ID]);

  const onSubmit = async (data) => {
    if (!record?.BUDGET_DETAIL_ID) { toast.error("Detail ID is missing."); return; }
    try {
      await updateMutation.mutateAsync({
        id: record.BUDGET_DETAIL_ID,
        data: {
          farmType:     data.farmType,
          expenseHead:  data.expenseHead,
          budgetMonth:  data.budgetMonth,
          expenseCode:  data.expenseCode || null,
          budgetAmount: data.budgetAmount,
        },
      });
      toast.success("Expense line updated successfully!");
      form.reset();
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to update expense line. Please try again.");
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
    form.reset();
    onOpenChange(false);
  };

  const isSubmitting = updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) handleCancel(); }}>
      <SheetContent className="sm:max-w-md w-full flex flex-col gap-0 p-0 z-105">
        <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Update Expense Line</SheetTitle>
              <SheetDescription>Editing line #{record?.BUDGET_DETAIL_ID}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              <FormField control={form.control} name="farmType" render={({ field }) => (
                <FormItem>
                  <FormLabel>Farm Type <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="e.g. Chicken, Cow, Fish" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="expenseHead" render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Head <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="e.g. Feed Cost" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="budgetMonth" render={({ field }) => (
                <FormItem>
                  <FormLabel>Month (1-12) <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="number" min="1" max="12" placeholder="e.g. 7" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="expenseCode" render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Code</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Optional" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="budgetAmount" render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Amount <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" placeholder="Enter amount" disabled={isSubmitting} {...field} />
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
                {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Updating...</> : "Update Line"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}