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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Beef } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateCowProject } from "./queries";
import { useAuthUserId } from "@/hooks/use-auth-helper-id";

const formSchema = z.object({
  cowNumber:    z.coerce.number({ invalid_type_error: "Cow number must be a number" })
                  .min(0, "Cannot be negative"),
  purchaseDate: z.string().min(1, "Purchase date is required"),
  sellingDate:  z.string().optional(),
  purchaseAmt:  z.coerce.number().optional().or(z.literal("")),
  sellingAmt:   z.coerce.number().optional().or(z.literal("")),
  weight:       z.coerce.number().optional().or(z.literal("")),

});

const defaultValues = {
  cowNumber:    "",
  purchaseDate: "",
  sellingDate:  "",
  purchaseAmt:  "",
  sellingAmt:   "",
  weight:       "",
 
};

export default function UpdateCowProjectSheet({ open, onOpenChange, showConfirmation, record }) {
  const updateMutation = useUpdateCowProject();
  const userId = useAuthUserId();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { formState: { isDirty } } = form;

  useEffect(() => {
    if (open && record) {
      form.reset({
        cowNumber:    record.COW_NUMBER ?? "",
        purchaseDate: record.PURCHASE_DATE ?? "",
        sellingDate:  record.SELLING_DATE ?? "",
        purchaseAmt:  record.PURCHASE_AMT ?? "",
        sellingAmt:   record.SELLING_AMT ?? "",
        weight:       record.WEIGHT ?? "",
      
      });
    }
  }, [open, record?.ID]);

  const onSubmit = async (data) => {
    if (!record?.ID) { toast.error("Record ID is missing."); return; }
    try {
      await updateMutation.mutateAsync({
        id: record.ID,
        data: {
          cowNumber:    data.cowNumber,
          purchaseDate: data.purchaseDate,
          sellingDate:  data.sellingDate || null,
          purchaseAmt:  data.purchaseAmt === "" ? null : data.purchaseAmt,
          sellingAmt:   data.sellingAmt === "" ? null : data.sellingAmt,
          weight:       data.weight === "" ? null : data.weight,
         updateBy: userId,
        },
      });
      toast.success("Cow project updated successfully!");
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
              <Beef className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Update Cow Project</SheetTitle>
              <SheetDescription>Editing record #{record?.ID}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Cow Number */}
              <FormField control={form.control} name="cowNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Cow Number <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="Tag / ID number" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Purchase Date */}
              <FormField control={form.control} name="purchaseDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Date <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="date" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Selling Date */}
              <FormField control={form.control} name="sellingDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Selling Date</FormLabel>
                  <FormControl>
                    <Input type="date" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Purchase Amount */}
              <FormField control={form.control} name="purchaseAmt" render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Amount</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" placeholder="Optional" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Selling Amount */}
              <FormField control={form.control} name="sellingAmt" render={({ field }) => (
                <FormItem>
                  <FormLabel>Selling Amount</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" placeholder="Optional" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Weight */}
              <FormField control={form.control} name="weight" render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" placeholder="Optional" disabled={isSubmitting} {...field} />
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