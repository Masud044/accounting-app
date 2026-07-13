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
import { useCreateCowProject } from "./queries";
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

export default function AddCowProjectSheet({ open, onOpenChange, showConfirmation }) {
  const createMutation = useCreateCowProject();
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
        cowNumber:    data.cowNumber,
        purchaseDate: data.purchaseDate,
        sellingDate:  data.sellingDate || null,
        purchaseAmt:  data.purchaseAmt === "" ? null : data.purchaseAmt,
        sellingAmt:   data.sellingAmt === "" ? null : data.sellingAmt,
        weight:       data.weight === "" ? null : data.weight,
        // status:       Number(data.status),
        creationBy: userId,
      });
      toast.success("Cow project created successfully!");
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
              <Beef className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Add Cow Project</SheetTitle>
              <SheetDescription>Create a new cow record</SheetDescription>
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

              {/* Status
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Active</SelectItem>
                      <SelectItem value="0">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
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
                {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Creating...</> : "Create Record"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}