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
import { Bird } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useCreateChickenProject } from "./queries";
import { useAuthUserId } from "@/hooks/use-auth-helper-id";

const formSchema = z.object({
  chickenNumber: z.coerce.number({ invalid_type_error: "Chicken number must be a number" })
                    .min(0, "Cannot be negative"),
  lot:           z.coerce.number().optional().or(z.literal("")),
  description:   z.string().max(500).optional(),
  shade:         z.string().max(100).optional(),
});

const defaultValues = {
  chickenNumber: "",
  lot:           "",
  description:   "",
  shade:         "",
};

export default function AddChickenProjectSheet({ open, onOpenChange, showConfirmation }) {
  const createMutation = useCreateChickenProject();
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
        chickenNumber: data.chickenNumber,
        lot:           data.lot === "" ? null : data.lot,
        description:   data.description || null,
        shade:         data.shade || null,
        creationBy:     userId, 
      });
      toast.success("Chicken project created successfully!");
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
              <Bird className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Add Chicken Project</SheetTitle>
              <SheetDescription>Create a new chicken batch record</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Chicken Number */}
              <FormField control={form.control} name="chickenNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Chicken Number <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="Enter chicken count" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Shade */}
              <FormField control={form.control} name="shade" render={({ field }) => (
                <FormItem>
                  <FormLabel>Shade</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Optional" disabled={isSubmitting} {...field} />
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

              {/* Description */}
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Optional note" disabled={isSubmitting} {...field} />
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