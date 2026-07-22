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
import { Wallet } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateFarmBudget } from "./queries";
import { useAuthUserId } from "@/hooks/use-auth-helper-id";

const formSchema = z.object({
  bMonth:     z.string().min(1, "Month is required"),
  budgetYear: z.coerce.number({ invalid_type_error: "Year is required" }).min(2000, "Invalid year"),
  farmName:   z.string().max(200).optional(),
  status:     z.string().min(1, "Status is required"),
});

const defaultValues = {
  bMonth:     "",
  budgetYear: "",
  farmName:   "",
  status:     "DRAFT",
};

const STATUS_OPTIONS = ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"];

export default function UpdateFarmBudgetSheet({ open, onOpenChange, showConfirmation, record }) {
  const updateMutation = useUpdateFarmBudget();
  const userId = useAuthUserId();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { formState: { isDirty } } = form;

  useEffect(() => {
    if (open && record) {
      form.reset({
        bMonth:     record.B_MONTH ?? "",
        budgetYear: record.BUDGET_YEAR ?? "",
        farmName:   record.FARM_NAME ?? "",
        status:     record.STATUS ?? "DRAFT",
      });
    }
  }, [open, record?.BUDGET_ID]);

  const onSubmit = async (data) => {
    if (!record?.BUDGET_ID) { toast.error("Budget ID is missing."); return; }
    try {
      await updateMutation.mutateAsync({
        id: record.BUDGET_ID,
        data: {
          bMonth:     data.bMonth,
          budgetYear: data.budgetYear,
          farmName:   data.farmName || null,
          status:     data.status,
          updateBy:   userId,
        },
      });
      toast.success("Farm budget updated successfully!");
      form.reset();
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to update budget. Please try again.");
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

        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Update Farm Budget</SheetTitle>
              <SheetDescription>Editing budget #{record?.BUDGET_ID}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Month */}
              <FormField control={form.control} name="bMonth" render={({ field }) => (
                <FormItem>
                  <FormLabel>Month <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="e.g. July" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Year */}
              <FormField control={form.control} name="budgetYear" render={({ field }) => (
                <FormItem>
                  <FormLabel>Year <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 2026" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Farm Name */}
              <FormField control={form.control} name="farmName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Farm Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Optional" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Status */}
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Updating...</> : "Update Budget"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}