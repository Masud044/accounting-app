import { useEffect, useState } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { format } from "date-fns";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/DatePicker";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { PackageCheck, Plus, Trash2, ChevronsUpDown, Check } from "lucide-react";
import { useCreateGRN, useStores, useAllItems, useUOMList  } from "./queries";

/* ─── Constants ──────────────────────────────────────────────────────────── */
const REV_TYPE_OPTIONS    = ["PURCHASE", "RETURN", "TRANSFER", "ADJUSTMENT"];
const RECV_TYPE_OPTIONS   = ["DIRECT", "INDIRECT", "CROSS_DOCK"];
const ITEM_TYPE_OPTIONS   = [
  { value: "1", label: "Raw Material" },
  { value: "2", label: "Finished Goods" },
  { value: "3", label: "Spare Parts" },
  { value: "4", label: "Consumable" },
];

const emptyDetail = () => ({
  ITEMID: undefined,
  REVQTY: "",
  STOREID: undefined,
  UOM: "",
  COST: "",
  UNIT_PRICE: "",
  SELLING_UNIT_PRICE: "",
  REVTYPE: "PURCHASE",
  STORERECVTYPE: "DIRECT",
  ITEMTYPE: "",
  CHALLAN_NO: "",
  PONO: "",
});

/* ─── Zod ────────────────────────────────────────────────────────────────── */
// NOTE: STOREID uses z.coerce.number() — Select always gives a string, coerce converts it
const detailSchema = z.object({
  ITEMID:             z.number({ required_error: "Item required" }),
  REVQTY:             z.coerce.number({ invalid_type_error: "Number required" }).positive("Must be > 0"),
  STOREID:            z.coerce.number({ required_error: "Store required" }),
  UOM:                z.string().optional(),
  COST:               z.coerce.number().min(0).default(0),
  UNIT_PRICE:         z.coerce.number().min(0).default(0),
  SELLING_UNIT_PRICE: z.coerce.number().min(0).default(0),
  REVTYPE:            z.string().optional(),
  STORERECVTYPE:      z.string().optional(),
  ITEMTYPE:           z.string().optional(),
  CHALLAN_NO:         z.string().optional(),
  PONO:               z.string().optional(),
});

const formSchema = z.object({
  GRNDATE:  z.string().min(1, "Date required"),
  GRNNO:    z.string().optional(),
  CHALLANNO:z.string().optional(),
  PONO:     z.string().optional(),
  details:  z.array(detailSchema).min(1, "At least one item required"),
});

/* ─── TinySelect ─────────────────────────────────────────────────────────── */
function TinySelect({ control, name, options, placeholder }) {
  return (
    <FormField control={control} name={name}
      render={({ field }) => (
        <FormItem className="space-y-0">
          <Select onValueChange={field.onChange} value={field.value != null ? String(field.value) : ""}>
            <FormControl>
              <SelectTrigger className="h-8 text-xs w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="z-[200]">
              {options.map((o) => (
                <SelectItem
                  key={typeof o === "string" ? o : o.value}
                  value={typeof o === "string" ? o : o.value}
                  className="text-xs"
                >
                  {typeof o === "string" ? o : o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="text-[10px]" />
        </FormItem>
      )}
    />
  );
}

/* ─── Item Row ────────────────────────────────────────────────────────────── */
function ItemRow({ index, control, onRemove, stores, allItems, uomList, allItemsLoading, masterChallan, masterPono }) {
  const [itemOpen, setItemOpen]   = useState(false);
  const [itemSearch, setItemSearch] = useState("");
  const form = useFormContext();

  const selectedItemId = form.watch(`details.${index}.ITEMID`);

  // API returns NAME (not ITEM_NAME) — filter and display use .NAME
  const filteredItems = (allItems || []).filter((it) =>
    it.NAME?.toLowerCase().includes(itemSearch.toLowerCase())
  );
  const selectedItem = (allItems || []).find((it) => it.ITEM_ID === selectedItemId);

  const handleItemSelect = (it) => {
    form.setValue(`details.${index}.ITEMID`, it.ITEM_ID, { shouldDirty: true });
    // UNIT field is null in this API — leave UOM blank so user can type
    form.setValue(`details.${index}.UOM`, it.UNIT || "", { shouldDirty: true });
    setItemOpen(false);
    setItemSearch("");
  };

  // Inherit master Challan/PO only if line field is still blank
  useEffect(() => {
    if (masterChallan && !form.getValues(`details.${index}.CHALLAN_NO`)) {
      form.setValue(`details.${index}.CHALLAN_NO`, masterChallan, { shouldDirty: false });
    }
  }, [masterChallan]);

  useEffect(() => {
    if (masterPono && !form.getValues(`details.${index}.PONO`)) {
      form.setValue(`details.${index}.PONO`, masterPono, { shouldDirty: false });
    }
  }, [masterPono]);

  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors group">
      {/* # */}
      <td className="px-2 py-2 text-center align-middle w-8">
        <span className="text-[11px] text-muted-foreground/60 font-mono font-semibold">
          {String(index + 1).padStart(2, "0")}
        </span>
      </td>

      {/* Item — field name is ITEMID, display field is NAME */}
      <td className="px-1 py-2 align-middle">
        <FormField control={control} name={`details.${index}.ITEMID`}
          render={({ field }) => (
            <FormItem className="space-y-0">
              <Popover open={itemOpen} onOpenChange={setItemOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox"
                      className={cn("w-full justify-between font-normal text-xs h-8", !field.value && "text-muted-foreground")}
                    >
                      <span className="truncate max-w-[160px]">
                        {selectedItem
                          ? selectedItem.NAME
                          : field.value
                          ? (allItemsLoading ? "Loading…" : `Item #${field.value}`)
                          : "Select item…"}
                      </span>
                      <ChevronsUpDown className="ml-1 h-3 w-3 opacity-50 shrink-0" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput placeholder="Search item…" value={itemSearch} onValueChange={setItemSearch} className="text-xs h-9" />
                    <CommandList>
                      {allItemsLoading && (
                        <div className="flex items-center justify-center py-4"><Spinner className="h-4 w-4" /></div>
                      )}
                      {!allItemsLoading && filteredItems.length === 0 && (
                        <CommandEmpty className="text-xs">{itemSearch ? `"${itemSearch}" not found` : "No items"}</CommandEmpty>
                      )}
                      <CommandGroup>
                        {filteredItems.map((it) => (
                          <CommandItem key={it.ITEM_ID} value={String(it.ITEM_ID)} onSelect={() => handleItemSelect(it)}>
                            <Check className={cn("mr-2 h-3.5 w-3.5", field.value === it.ITEM_ID ? "opacity-100" : "opacity-0")} />
                            <div className="flex flex-col min-w-0">
                              {/* NAME is the correct field from API */}
                              <span className="text-xs font-medium truncate">{it.NAME}</span>
                              <span className="text-[10px] text-muted-foreground">ID: {it.ITEM_ID}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage className="text-[10px] mt-0.5" />
            </FormItem>
          )}
        />
      </td>

      {/* Store — value is String from Select, coerced to number by zod */}
      <td className="px-1 py-2 align-middle">
        <TinySelect control={control} name={`details.${index}.STOREID`}
          options={stores.map((s) => ({ value: String(s.STORE_ID), label: s.STORE_NAME }))}
          placeholder="Select store…"
        />
      </td>

      {/* Rev Qty */}
      <td className="px-1 py-2 align-middle">
        <FormField control={control} name={`details.${index}.REVQTY`}
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormControl className="w-20">
                <Input type="number" min={0} step="1" placeholder="0"
                  className="h-8 text-xs text-center" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />
      </td>

      {/* UOM */}
      {/* <td className="px-1 py-2 align-middle">
        <FormField control={control} name={`details.${index}.UOM`}
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormControl>
                <Input placeholder="PCS" className="h-8 text-xs text-center" {...field} value={field.value || ""} />
              </FormControl>
            </FormItem>
          )}
        />
      </td> */}

      <td className="px-1 py-2 align-middle">
  <TinySelect
    control={control}
    name={`details.${index}.UOM`}
    options={uomList.map((u) => ({ value: u.NAME.trim(), label: u.NAME.trim() }))}
    placeholder="UOM…"
  />
</td>

      {/* Cost */}
      <td className=" py-2 align-middle">
        <FormField control={control} name={`details.${index}.COST`}
          render={({ field }) => (
            <FormItem className=" w-20">
              <FormControl>
                <Input type="number" min={0} step="0.01" placeholder="0.00"
                  className="h-8 text-xs text-right" {...field} value={field.value ?? ""} />
              </FormControl>
            </FormItem>
          )}
        />
      </td>

      {/* Unit Price */}
      <td className="px-1 py-2 align-middle">
        <FormField control={control} name={`details.${index}.UNIT_PRICE`}
          render={({ field }) => (
            <FormItem className="w-20">
              <FormControl>
                <Input type="number" min={0} step="0.01" placeholder="0.00"
                  className="h-8 text-xs text-right" {...field} value={field.value ?? ""} />
              </FormControl>
            </FormItem>
          )}
        />
      </td>

      {/* Selling Price */}
      <td className="px-1 py-2 align-middle">
        <FormField control={control} name={`details.${index}.SELLING_UNIT_PRICE`}
          render={({ field }) => (
            <FormItem className="w-20">
              <FormControl>
                <Input type="number" min={0} step="0.01" placeholder="0.00"
                  className="h-8 text-xs text-right" {...field} value={field.value ?? ""} />
              </FormControl>
            </FormItem>
          )}
        />
      </td>

      {/* Rev Type */}
      <td className="px-1 py-2 align-middle">
        <TinySelect control={control} name={`details.${index}.REVTYPE`} options={REV_TYPE_OPTIONS} placeholder="Rev type…" />
      </td>

      {/* Store Recv Type */}
      <td className="px-1 py-2 align-middle">
        <TinySelect control={control} name={`details.${index}.STORERECVTYPE`} options={RECV_TYPE_OPTIONS} placeholder="Recv type…" />
      </td>

      {/* Item Type */}
      <td className="px-1 py-2 align-middle">
        <TinySelect control={control} name={`details.${index}.ITEMTYPE`} options={ITEM_TYPE_OPTIONS} placeholder="Item type…" />
      </td>

      {/* PO No */}
      <td className="px-1 py-2 align-middle">
        <FormField control={control} name={`details.${index}.PONO`}
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormControl><Input placeholder="PO-XXXX" className="h-8 text-xs" {...field} value={field.value || ""} /></FormControl>
            </FormItem>
          )}
        />
      </td>

      {/* Challan No */}
      <td className="px-1 py-2 align-middle">
        <FormField control={control} name={`details.${index}.CHALLAN_NO`}
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormControl><Input placeholder="CH-XXXX" className="h-8 text-xs" {...field} value={field.value || ""} /></FormControl>
            </FormItem>
          )}
        />
      </td>

      {/* Remove */}
      <td className="px-2 py-2 align-middle text-center">
        <Button type="button" variant="ghost" size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onRemove}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </td>
    </tr>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function AddGRNSheet({ open, onOpenChange, showConfirmation }) {
  const createMutation = useCreateGRN();
  const { data: stores = [] }                      = useStores();
  const { data: allItems = [], isFetching: allItemsLoading } = useAllItems();
  const { data: uomList = [] } = useUOMList();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      GRNDATE: format(new Date(), "yyyy-MM-dd"),
      GRNNO: "", CHALLANNO: "", PONO: "",
      details: [emptyDetail()],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "details" });
  const { formState: { isDirty } }  = form;
  const masterChallan = form.watch("CHALLANNO");
  const masterPono    = form.watch("PONO");

  useEffect(() => {
    if (open) {
      form.reset({
        GRNDATE: format(new Date(), "yyyy-MM-dd"),
        GRNNO: "", CHALLANNO: "", PONO: "",
        details: [emptyDetail()],
      });
    }
  }, [open]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        master: {
          GRNDATE:   data.GRNDATE,
          GRNNO:     data.GRNNO     || null,
          CHALLANNO: data.CHALLANNO || null,
          PONO:      data.PONO      || null,
          USERID: 1,
        },
        details: data.details.map((d) => ({
          ITEMID:             d.ITEMID,
          REVQTY:             d.REVQTY,
           GRNDATE:           data.GRNDATE,  
          STOREID:            d.STOREID || null,
          UOM:                d.UOM     || null,
          COST:               d.COST    || 0,
          UNIT_PRICE:         d.UNIT_PRICE         || 0,
          SELLING_UNIT_PRICE: d.SELLING_UNIT_PRICE || 0,
          REVTYPE:            d.REVTYPE       || null,
          STORERECVTYPE:      d.STORERECVTYPE || null,
          ITEMTYPE:           d.ITEMTYPE      || null,
          CHALLAN_NO:         d.CHALLAN_NO    || data.CHALLANNO || null,
          PONO:               d.PONO          || data.PONO      || null,
        })),
      };
      await createMutation.mutateAsync(payload);
      toast.success("GRN created successfully!");
      form.reset();
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to create GRN.");
    }
  };

  const handleCancel = async () => {
    if (isDirty && showConfirmation) {
      const ok = await showConfirmation({
        title: "Discard changes?",
        description: "You have unsaved changes. Are you sure you want to close?",
        confirmText: "Discard", cancelText: "Keep Editing", variant: "destructive",
      });
      if (!ok) return;
    }
    form.reset();
    onOpenChange(false);
  };

  const isSubmitting = createMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) handleCancel(); }}>
      <SheetContent className="!w-screen !h-screen !max-w-none flex flex-col gap-0 p-0 rounded-none z-105">

        <SheetHeader className="px-6 py-4 border-b border-border shrink-0 bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <PackageCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-base font-semibold">GRN Form</SheetTitle>
              <SheetDescription className="text-xs mt-0.5">Create a new GRN entry</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

              {/* ── Header fields ── */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                  <span className="inline-block w-1 h-3.5 bg-primary rounded-full" />Header
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField control={form.control} name="GRNDATE" render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        GRN Date <span className="text-destructive normal-case">*</span>
                      </FormLabel>
                      <FormControl>
                        <DatePicker className="w-full" placeholder="Select date" disabled={isSubmitting}
                          value={field.value ? new Date(field.value) : undefined}
                          onChange={(d) => field.onChange(d ? format(d, "yyyy-MM-dd") : "")}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="GRNNO" render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">GRN No.</FormLabel>
                      <FormControl><Input placeholder="Auto-generated if blank" disabled={isSubmitting} {...field} value={field.value || ""} /></FormControl>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="CHALLANNO" render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Challan No.</FormLabel>
                      <FormControl><Input placeholder="CH-XXXX" disabled={isSubmitting} {...field} value={field.value || ""} /></FormControl>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="PONO" render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">PO No.</FormLabel>
                      <FormControl><Input placeholder="PO-XXXX" disabled={isSubmitting} {...field} value={field.value || ""} /></FormControl>
                    </FormItem>
                  )} />
                </div>
              </div>

              <Separator />

              {/* ── Line items table ── */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <span className="inline-block w-1 h-3.5 bg-primary rounded-full" />
                    Line Items
                    <Badge variant="secondary" className="text-xs h-5 px-1.5 rounded-sm ml-1">{fields.length}</Badge>
                  </p>
                  <Button type="button" variant="outline" size="sm"
                    onClick={() => append(emptyDetail())} className="h-7 text-xs gap-1.5">
                    <Plus className="h-3.5 w-3.5" />Add Item
                  </Button>
                </div>

                <div className="rounded-md border border-border overflow-x-auto">
                  <table className="border-collapse text-sm" style={{ minWidth: "1420px", width: "100%" }}>
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        <th className="px-2 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center w-8">#</th>
                        <th className="px-1 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-left" style={{minWidth:"190px"}}>Item Name</th>
                        <th className="px-1 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center" style={{minWidth:"150px"}}>Store</th>
                        <th className="px-1 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center" style={{width:"80px"}}>Rev Qty</th>
                        <th className="px-1 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center" style={{width:"72px"}}>UOM</th>
                        <th className="px-1 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center" style={{width:"92px"}}>Cost</th>
                        <th className="px-1 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right" style={{width:"92px"}}>Unit Price</th>
                        <th className="px-1 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right" style={{width:"96px"}}>Selling Price</th>
                        <th className="px-1 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-left" style={{minWidth:"120px"}}>Rev Type</th>
                        <th className="px-1 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-left" style={{minWidth:"120px"}}>Recv Type</th>
                        <th className="px-1 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-left" style={{minWidth:"120px"}}>Item Type</th>
                        <th className="px-1 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-left" style={{minWidth:"110px"}}>PO No</th>
                        <th className="px-1 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-left" style={{minWidth:"110px"}}>Challan No</th>
                        <th className="px-2 py-2.5 w-10" />
                      </tr>
                    </thead>
                    <tbody>
                      {fields.map((field, index) => (
                        <ItemRow key={field.id} index={index} control={form.control}
                          stores={stores} allItems={allItems} allItemsLoading={allItemsLoading}
                          masterChallan={masterChallan} masterPono={masterPono} uomList={uomList} 
                          onRemove={() => fields.length > 1 && remove(index)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {typeof form.formState.errors.details?.message === "string" && (
                  <p className="text-xs text-destructive mt-1.5">{form.formState.errors.details.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-border bg-muted/40 shrink-0">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Creating…</> : "Save GRN"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}