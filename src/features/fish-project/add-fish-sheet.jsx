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
import { Fish } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useCreateFishProject } from "./queries";
import { useAuthUserId } from "@/hooks/use-auth-helper-id";

const formSchema = z.object({
  lot:        z.coerce.number().optional().or(z.literal("")),
  fishNumber: z.coerce.number({ invalid_type_error: "Fish number must be a number" })
                .min(0, "Cannot be negative"),
  fishType:   z.string().min(1, "Fish type is required").max(30),
});

const defaultValues = {
  lot:        "",
  fishNumber: "",
  fishType:   "",
};

export default function AddFishProjectSheet({ open, onOpenChange, showConfirmation }) {
  const createMutation = useCreateFishProject();
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
        lot:        data.lot === "" ? null : data.lot,
        fishNumber: data.fishNumber,
        fishType:   data.fishType,
        creationBy:  userId,
      });
      toast.success("Fish project created successfully!");
      form.reset(defaultValues);
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to create record. Please try again.");
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
              <Fish className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Add Fish Project</SheetTitle>
              <SheetDescription>Create a new fish batch record</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Fish Number */}
              <FormField control={form.control} name="fishNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Fish Number <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="Enter fish count" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Fish Type */}
              <FormField control={form.control} name="fishType" render={({ field }) => (
                <FormItem>
                  <FormLabel>Fish Type <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Tilapia" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Lot */}
              <FormField control={form.control} name="lot" render={({ field }) => (
                <FormItem>
                  <FormLabel>Lot</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="Optional" disabled={isSubmitting} {...field} />
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
                {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Creating...</> : "Create Record"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}