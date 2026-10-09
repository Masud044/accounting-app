import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Warehouse } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateChickenShed } from "./queries";

const formSchema = z.object({
  shedCode: z.string().trim().min(1, "Shed code is required").max(10, "Shed code max 10 characters"),
});

const emptyValues = { shedCode: "" };

export default function UpdateChickenShedSheet({ open, onOpenChange, showConfirmation, record }) {
  const updateMutation = useUpdateChickenShed();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: emptyValues,
  });

  const { formState: { isDirty } } = form;

  useEffect(() => {
    if (open && record) {
      form.reset({ shedCode: record.SHED_CODE ?? "" });
    }
  }, [open, record?.ID]);

  const onSubmit = async (data) => {
    if (!record?.ID) { toast.error("Shed ID is missing."); return; }
    try {
      await updateMutation.mutateAsync({
        id: record.ID,
        data: { shed_code: data.shedCode.trim() },
      });
      toast.success("Shed updated successfully!");
      form.reset(emptyValues);
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to update shed. Please try again.");
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
    form.reset(emptyValues);
    onOpenChange(false);
  };

  const isSubmitting = updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleCancel(); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Warehouse className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <DialogTitle>Update Shed</DialogTitle>
              <DialogDescription>Editing shed #{record?.ID}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField control={form.control} name="shedCode" render={({ field }) => (
              <FormItem>
                <FormLabel>Shed Code <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input
                    maxLength={10}
                    placeholder="e.g. S-6"
                    autoComplete="off"
                    autoFocus
                    className="uppercase"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Updating...</> : "Update Shed"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}