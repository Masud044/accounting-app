import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Fish, Plus, Trash2, Layers } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateFishProject, useFishProjectById } from "./queries";
import { useAuthUserId } from "@/hooks/use-auth-helper-id";

// ── Validation Schema ────────────────────────────────────────────────────────
const detailSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  fishName: z.string().min(1, "Fish name is required").max(100),
  numOfFish: z.coerce.number({ invalid_type_error: "Must be a number" })
                .min(0, "Cannot be negative"),
  productionStartDate: z.string().optional().or(z.literal("")),
});

const formSchema = z.object({
  lot:        z.coerce.number().optional().or(z.literal("")),
  fishNumber: z.coerce.number({ invalid_type_error: "Fish number must be a number" })
                .min(0, "Cannot be negative"),
  fishType:   z.string().min(1, "Fish type is required").max(30),
  details:    z.array(detailSchema).optional(),
});

const emptyDetail = { fishName: "", numOfFish: "", productionStartDate: "" };

const defaultValues = {
  lot:        "",
  fishNumber: "",
  fishType:   "",
  details:    [],
};

// Oracle DD-MON-YY (ba ISO string) ke <input type="date"> compatible yyyy-mm-dd te convert kora
const toDateInputValue = (oracleDate) => {
  if (!oracleDate) return "";
  const d = new Date(oracleDate);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

export default function UpdateFishProjectSheet({ open, onOpenChange, showConfirmation, record }) {
  const updateMutation = useUpdateFishProject();
  const userId = useAuthUserId();

  // List theke sudhu header ashe, tai full record (header + details) alada fetch korte hobe
  const {
    data: fullRecord,
    isLoading: isLoadingDetails,
    isError: isDetailsError,
  } = useFishProjectById(open ? record?.ID : undefined);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { formState: { isDirty } } = form;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "details",
  });

  useEffect(() => {
    if (open && fullRecord) {
      form.reset({
        lot:        fullRecord.LOT ?? "",
        fishNumber: fullRecord.FISH_NUMBER ?? "",
        fishType:   fullRecord.FISH_TYPE ?? "",
        details: (fullRecord.details ?? []).map((d) => ({
          id:                  d.ID,
          fishName:            d.FISH_NAME ?? "",
          numOfFish:           d.NUM_OF_FISH ?? "",
          productionStartDate: toDateInputValue(d.PRODUCTION_START_DATE),
        })),
      });
    }
  }, [open, fullRecord]);

  const onSubmit = async (data) => {
    if (!record?.ID) { toast.error("Record ID is missing."); return; }
    try {
      await updateMutation.mutateAsync({
        id: record.ID,
        data: {
          lot:        data.lot === "" ? null : data.lot,
          fishNumber: data.fishNumber,
          fishType:   data.fishType,
          updateBy:   userId,
          details: (data.details ?? []).map((d) => ({
            id:                  d.id ?? undefined,
            fishName:            d.fishName,
            numOfFish:           d.numOfFish,
            productionStartDate: d.productionStartDate === "" ? null : d.productionStartDate,
          })),
        },
      });
      toast.success("Fish project updated successfully!");
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
      <SheetContent className="sm:max-w-2xl w-full flex flex-col gap-0 p-0 z-105">

        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Fish className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Update Fish Project</SheetTitle>
              <SheetDescription>Editing record #{record?.ID}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Loading details */}
        {isLoadingDetails ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16">
            <Spinner className="h-8 w-8 mb-3" />
            <p className="text-sm text-muted-foreground">Loading record details...</p>
          </div>
        ) : isDetailsError ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 px-6 text-center">
            <p className="text-sm text-destructive">Failed to load record details. Please close and try again.</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

                {/* ── Header Fields ───────────────────────────────────────── */}
                <div className="space-y-5">
                  <FormField control={form.control} name="fishNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fish Number <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input type="number" min="0" placeholder="Enter fish count" disabled={isSubmitting} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="fishType" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fish Type <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Tilapia" disabled={isSubmitting} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

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

                {/* ── Details Section ─────────────────────────────────────── */}
                <div className="space-y-3 pt-2 border-t border-border">
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-semibold">Production Details</h3>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isSubmitting}
                      onClick={() => append(emptyDetail)}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add Detail
                    </Button>
                  </div>

                  {fields.length === 0 && (
                    <p className="text-sm text-muted-foreground italic py-2">
                      No production details added yet.
                    </p>
                  )}

                  <div className="space-y-3">
                    {fields.map((item, index) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-12 gap-2 items-start rounded-md border border-border p-3 bg-muted/30"
                      >
                        <div className="col-span-12 sm:col-span-5">
                          <FormField control={form.control} name={`details.${index}.fishName`} render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Fish Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Rui" disabled={isSubmitting} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <FormField control={form.control} name={`details.${index}.numOfFish`} render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Num of Fish</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" placeholder="0" disabled={isSubmitting} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <FormField control={form.control} name={`details.${index}.productionStartDate`} render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Start Date</FormLabel>
                              <FormControl>
                                <Input type="date" disabled={isSubmitting} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>

                        <div className="col-span-12 sm:col-span-1 flex sm:justify-end sm:pt-6">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            disabled={isSubmitting}
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

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
        )}
      </SheetContent>
    </Sheet>
  );
}