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
import { Egg } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateEggProduction } from "./queries";

const formSchema = z.object({
  productionDate: z.string().min(1, "Production date is required"),
  qty:            z.coerce.number({ invalid_type_error: "Quantity must be a number" })
                    .min(0, "Quantity cannot be negative"),
  updatedBy:      z.string().max(100).optional(),
});

// Helper: Oracle date → input[type=date] value (YYYY-MM-DD)
const toDateInputValue = (val) => {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d)) return "";
  return d.toISOString().split("T")[0];
};

export default function UpdateEggProductionSheet({ open, onOpenChange, showConfirmation, record }) {
  const updateMutation = useUpdateEggProduction();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { productionDate: "", qty: "", updatedBy: "" },
  });

  const { formState: { isDirty } } = form;

  useEffect(() => {
    if (record) {
      form.reset({
        productionDate: toDateInputValue(record.PRODUCTION_DATE),
        qty:            record.QTY ?? "",
        updatedBy:      record.UPDATED_BY ?? "",
      });
    }
  }, [record]);

  const onSubmit = async (data) => {
    if (!record?.ID) { toast.error("Record ID is missing."); return; }
    try {
      await updateMutation.mutateAsync({
        id: record.ID,
        data: {
          productionDate: data.productionDate,
          qty:            data.qty,
          updatedBy:      data.updatedBy || null,
        },
      });
      toast.success("Egg production record updated successfully!");
      form.reset();
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to update record. Please try again.");
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
              <Egg className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Update Egg Production</SheetTitle>
              <SheetDescription>Editing record #{record?.ID}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Production Date */}
              <FormField control={form.control} name="productionDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Production Date <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="date" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Quantity */}
              <FormField control={form.control} name="qty" render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity (Eggs) <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Enter egg count"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Updated By */}
              {/* <FormField control={form.control} name="updatedBy" render={({ field }) => (
                <FormItem>
                  <FormLabel>Updated By</FormLabel>
                  <FormControl>
                    <Input placeholder="Optional" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} /> */}

            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Updating...</> : "Update Record"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}