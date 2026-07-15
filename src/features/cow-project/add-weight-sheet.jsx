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
import { Scale } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useCreateCowWeight } from "./queries";

const formSchema = z.object({
  weightDate: z.string().min(1, "Weight date is required"),
  weight:     z.coerce.number({ invalid_type_error: "Weight must be a number" }).min(0, "Cannot be negative"),
});

const defaultValues = {
  weightDate: "",
  weight:     "",
};

export default function AddWeightSheet({ open, onOpenChange, showConfirmation, cowNo, cowLabel }) {
  const createMutation = useCreateCowWeight();

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
        cowNo,
        weightDate: data.weightDate,
        weight:     data.weight,
      });
      toast.success("Weight record added successfully!");
      form.reset(defaultValues);
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to add weight record. Please try again.");
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
              <Scale className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Add Weight Record</SheetTitle>
              <SheetDescription>Cow #{cowLabel ?? cowNo}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              <FormField control={form.control} name="weightDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight Date <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="date" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="weight" render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" placeholder="Weight in kg" disabled={isSubmitting} {...field} />
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
                {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Saving...</> : "Add Record"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}