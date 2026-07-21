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
import { Layers } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateFarmType } from "./queries";

// ── Validation Schema ────────────────────────────────────────────────────────
const formSchema = z.object({
  farmTypeName: z.string().min(1, "Farm type name is required").max(100),
  farmTypeCode: z.string().min(1, "Farm type code is required").max(30),
});

const defaultValues = {
  farmTypeName: "",
  farmTypeCode: "",
};

export default function UpdateFarmTypeSheet({ open, onOpenChange, showConfirmation, record }) {
  const updateMutation = useUpdateFarmType();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { formState: { isDirty } } = form;

  useEffect(() => {
    if (open && record) {
      form.reset({
        farmTypeName: record.FARM_TYPE_NAME ?? "",
        farmTypeCode: record.FARM_TYPE_CODE ?? "",
      });
    }
  }, [open, record]);

  const onSubmit = async (data) => {
    if (!record?.FARM_TYPE_ID) { toast.error("Record ID is missing."); return; }
    try {
      await updateMutation.mutateAsync({
        id: record.FARM_TYPE_ID,
        data: {
          farmTypeName: data.farmTypeName,
          farmTypeCode: data.farmTypeCode,
        },
      });
      toast.success("Farm type updated successfully!");
      form.reset(defaultValues);
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
    form.reset(defaultValues);
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
              <Layers className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Update Farm Type</SheetTitle>
              <SheetDescription>Editing record #{record?.FARM_TYPE_ID}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <FormField control={form.control} name="farmTypeName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Farm Type Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Poultry" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="farmTypeCode" render={({ field }) => (
                <FormItem>
                  <FormLabel>Farm Type Code <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. PLT" disabled={isSubmitting} {...field} />
                  </FormControl>
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
                {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Updating...</> : "Update Record"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}