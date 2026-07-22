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
import { Wallet } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useCreateFarmBudget } from "./queries";
import { useAuthUserId } from "@/hooks/use-auth-helper-id";

const formSchema = z.object({
  bMonth:     z.string().min(1, "Month is required"),
  budgetYear: z.coerce.number({ invalid_type_error: "Year is required" }).min(2000, "Invalid year"),
  farmName:   z.string().max(200).optional(),
});

const defaultValues = {
  bMonth:     "",
  budgetYear: "",
  farmName:   "",
};

export default function AddFarmBudgetSheet({ open, onOpenChange, showConfirmation }) {
  const createMutation = useCreateFarmBudget();
  const userId = useAuthUserId();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { formState: { isDirty } } = form;

  useEffect(() => {
    if (open) form.reset(defaultValues);
  }, [open]);

  const onSubmit = async (data) => {
    try {
      await createMutation.mutateAsync({
        bMonth:     data.bMonth,
        budgetYear: data.budgetYear,
        farmName:   data.farmName || null,
        createdBy:  userId,
      });
      toast.success("Farm budget created successfully!");
      form.reset(defaultValues);
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to create budget. Please try again.");
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

        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Add Farm Budget</SheetTitle>
              <SheetDescription>Create a new budget for a month/year</SheetDescription>
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

              <p className="text-sm text-muted-foreground">
                Status will default to Draft. Add expense line items in Details after creating the budget.
              </p>

            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Creating...</> : "Create Budget"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}