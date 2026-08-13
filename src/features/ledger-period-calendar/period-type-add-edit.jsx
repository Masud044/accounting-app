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
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ListTree } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { useCreatePeriodType, useUpdatePeriodType } from "./queries";

const formSchema = z.object({
  typeCode:       z.string().min(1, "Type code is required").max(20, "Max 20 characters"),
  typeName:       z.string().min(1, "Type name is required"),
  periodsPerYear: z.coerce.number().min(1, "Must be at least 1").max(366, "Too large"),
  description:    z.string().optional(),
});

const emptyValues = {
  typeCode:       "",
  typeName:       "",
  periodsPerYear: "",
  description:    "",
};

export default function PeriodTypeFormSheet({ open, onOpenChange, periodType = null }) {
  const isEdit = !!periodType;
  const createMutation = useCreatePeriodType();
  const updateMutation = useUpdatePeriodType();
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: emptyValues,
  });

  const { formState: { isDirty } } = form;

  useEffect(() => {
    if (open) {
      form.reset(
        isEdit
          ? {
              typeCode:       periodType.TYPE_CODE ?? "",
              typeName:       periodType.TYPE_NAME ?? "",
              periodsPerYear: periodType.PERIODS_PER_YEAR ?? "",
              description:    periodType.DESCRIPTION ?? "",
            }
          : emptyValues
      );
    }
  }, [open, periodType]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: periodType.PERIOD_TYPE_ID, ...data });
        toast.success("Period type updated successfully!");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Period type created successfully!");
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to save period type. Please try again.");
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

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) handleCancel(); }}>
      <SheetContent className="sm:max-w-md w-full flex flex-col gap-0 p-0 z-105">

        <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <ListTree className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>{isEdit ? "Edit Period Type" : "Add Period Type"}</SheetTitle>
              <SheetDescription>
                {isEdit ? "Update this period type" : "Define a new reusable period type"}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              <FormField control={form.control} name="typeCode" render={({ field }) => (
                <FormItem>
                  <FormLabel>Type Code <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. MONTHLY" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="typeName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Type Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Monthly Calendar" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="periodsPerYear" render={({ field }) => (
                <FormItem>
                  <FormLabel>Periods Per Year <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="number" min={1} placeholder="e.g. 13" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} disabled={isSubmitting} {...field} />
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
                {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Saving...</> : isEdit ? "Save Changes" : "Add Period Type"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
      <ConfirmationDialog />
    </Sheet>
  );
}