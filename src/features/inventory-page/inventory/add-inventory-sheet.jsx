// import { useEffect, useState, useRef } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { toast } from "sonner";
// import { format } from "date-fns";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetDescription,
  
// } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { DatePicker } from "@/components/DatePicker";
// import { ArchiveIcon } from "lucide-react";
// import { Spinner } from "@/components/ui/spinner";
// import { useQuery } from "@tanstack/react-query";
// import { useCreateInventory } from "./queries";

// // ─── Fetcher ──────────────────────────────────────────────────────────────────
// const BASE = import.meta.env.VITE_API_BASE_URL;

// const fetchJSON = async (url) => {
//   const res = await fetch(url);
//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err.message || `${res.status} ${res.statusText}`);
//   }
//   const json = await res.json();
//   return json.data ?? json;
// };

// // ─── Inline hooks ─────────────────────────────────────────────────────────────
// const useItemSearch = (query) =>
//   useQuery({
//     queryKey: ["items", "search", query],
//     queryFn: () =>
//       fetchJSON(`${BASE}/api/item?q=${encodeURIComponent(query)}&limit=20`),
//     enabled: typeof query === "string" && query.trim().length >= 2,
//     staleTime: 60 * 1000,
//   });

// const useUoms = () =>
//   useQuery({
//     queryKey: ["uoms"],
//     queryFn: () => fetchJSON(`${BASE}/api/inv-uom`),
//     staleTime: 10 * 60 * 1000,
//   });

// const useStores = () =>
//   useQuery({
//     queryKey: ["stores"],
//     queryFn: () => fetchJSON(`${BASE}/api/stores`),
//     staleTime: 5 * 60 * 1000,
//   });

// // ─── ItemSearchCombobox ───────────────────────────────────────────────────────
// function ItemSearchCombobox({ value, onChange, disabled }) {
//   const [query, setQuery] = useState("");
//   const [open, setOpen] = useState(false);
//   const containerRef = useRef(null);

//   const { data: items = [], isFetching } = useItemSearch(query);

//   useEffect(() => {
//     const handler = (e) => {
//       if (containerRef.current && !containerRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const handleInputChange = (e) => {
//     const val = e.target.value;
//     setQuery(val);
//     setOpen(true);
//     if (!val) onChange(null);
//   };

//   const handleSelect = (item) => {
//     onChange({ id: item.ITEM_ID, name: item.NAME });
//     setQuery("");
//     setOpen(false);
//   };

//   const handleClear = () => {
//     onChange(null);
//     setQuery("");
//     setOpen(false);
//   };

//   return (
//     <div ref={containerRef} className="relative w-full">
//       <div className="relative">
//         <Input
//           placeholder="Search item by name or model..."
//           value={open ? query : (value?.name ?? "")}
//           disabled={disabled}
//           onChange={handleInputChange}
//           onFocus={() => {
//             if (!value) setOpen(true);
//           }}
//           className={value && !open ? "pr-8" : ""}
//           autoComplete="off"
//         />
//         {isFetching && open && (
//           <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
//             <Spinner className="h-4 w-4" />
//           </span>
//         )}
//         {value && !open && !disabled && (
//           <button
//             type="button"
//             onClick={handleClear}
//             className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-lg leading-none"
//             aria-label="Clear selection"
//           >
//             ×
//           </button>
//         )}
//       </div>

//       {open && (
//         <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
//           {items.length > 0
//             ? items.map((item) => (
//                 <button
//                   key={item.ITEM_ID}
//                   type="button"
//                   className="w-full text-left px-3 py-2 text-sm hover:bg-accent cursor-pointer"
//                   onMouseDown={() => handleSelect(item)}
//                 >
//                   <div className="font-medium">{item.NAME}</div>
//                   {item.MODEL && (
//                     <div className="text-xs text-muted-foreground">
//                       {item.MODEL}
//                     </div>
//                   )}
//                 </button>
//               ))
//             : query.trim().length >= 2 &&
//               !isFetching && (
//                 <div className="px-3 py-2 text-sm text-muted-foreground">
//                   No items found.
//                 </div>
//               )}
//           {query.trim().length < 2 && (
//             <div className="px-3 py-2 text-sm text-muted-foreground">
//               Type at least 2 characters to search...
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Schema ───────────────────────────────────────────────────────────────────
// const formSchema = z.object({
//   item: z.object(
//     { id: z.number(), name: z.string() },
//     { required_error: "Item is required" },
//   ),
//   storeId: z.coerce
//     .number({ required_error: "Store is required" })
//     .min(1, "Store is required"),
//   invQty: z.coerce.number().min(0).optional(),
//   grnNo: z.string().max(30).optional(),
//   poNo: z.coerce.number().optional(),
//   price: z.coerce.number().min(0).optional(),
//   sellingUnitPrice: z.coerce.number().min(0).optional(),
//   unit: z.string().max(10).optional(),
//   unitPrice: z.string().max(10).optional(),
//   unitId: z.coerce.number().optional(),
//   inventoryType: z.coerce.number().optional(),
//   itemType: z.coerce.number().optional(),
//   accounted: z.coerce.number().optional(),
//   invtDate: z.string().optional(),
//   invStatus: z.string().optional(),
//   invoiceStatus: z.string().optional(),
// });

// // ─── Component ────────────────────────────────────────────────────────────────
// export default function AddInventorySheet({
//   open,
//   onOpenChange,
//   showConfirmation,
//   initialData,
// }) {
//   const createMutation = useCreateInventory();
//   const { data: stores = [], isLoading: storesLoading } = useStores();
//   const { data: uoms = [], isLoading: uomsLoading } = useUoms();

//   const defaultValues = {
//     item: null,
//     storeId: "1",
//     invQty: "",
//     grnNo: "",
//     poNo: "",
//     price: "",
//     sellingUnitPrice: "",
//     unit: "",
//     unitPrice: "",
//     unitId: "",
//     inventoryType: "",
//     itemType: "",
//     accounted: "",
//     invtDate: "",
//     invStatus: "1",
//     invoiceStatus: "0",
//   };

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues,
//   });

//   const {
//     formState: { isDirty },
//   } = form;

//   // useEffect(() => {
//   //   if (open) form.reset(defaultValues);
//   // }, [open]);

//   useEffect(() => {
//   if (open) {
//     form.reset({
//       ...defaultValues,
//       item: initialData?.itemId
//         ? { id: initialData.itemId, name: initialData.itemName }
//         : null,
//       invQty:   initialData?.qty ?? "",
//       grnNo:    initialData?.grnNo ?? "",
//       price:    initialData?.price ?? "",
//       invtDate: initialData?.invtDate ?? "",
//     });
//   }
// }, [open, initialData]);

//   const onSubmit = async (data) => {
//     try {
//       await createMutation.mutateAsync({
//         item: data.item.id,
//         storeId: data.storeId,
//         invQty: data.invQty || null,
//         grnNo: data.grnNo || null,
//         poNo: data.poNo || null,
//         price: data.price || null,
//         sellingUnitPrice: data.sellingUnitPrice || null,
//         unit: data.unit || null,
//         unitPrice: data.unitPrice || null,
//         unitId: data.unitId || null,
//         inventoryType: data.inventoryType || null,
//         itemType: data.itemType || null,
//         accounted: data.accounted || null,
//         invtDate: data.invtDate || null,
//         invStatus: Number(data.invStatus ?? 1),
//         invoiceStatus: Number(data.invoiceStatus ?? 0),
//       });
//       toast.success("Inventory created successfully!");
//       form.reset(defaultValues);
//       onOpenChange(false);
//     } catch (err) {
//       toast.error(
//         err?.message || "Failed to create inventory. Please try again.",
//       );
//     }
//   };

//   const handleCancel = async () => {
//     if (isDirty && showConfirmation) {
//       const confirmed = await showConfirmation({
//         title: "Discard changes?",
//         description:
//           "You have unsaved changes. Are you sure you want to close without saving?",
//         confirmText: "Discard",
//         cancelText: "Keep Editing",
//         variant: "destructive",
//       });
//       if (!confirmed) return;
//     }
//     form.reset(defaultValues);
//     onOpenChange(false);
//   };

//   const isSubmitting = createMutation.isPending;

//   return (
//     <Sheet
//       open={open}
  
//       onOpenChange={(isOpen) => {
//         if (!isOpen) handleCancel();
//       }}
//     >
      
//       <SheetContent className="sm:max-w-xl w-full flex flex-col gap-0 p-0 z-105">
//         {/* Header */}
//         <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
//           <div className="flex items-center gap-3">
//             <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
//               <ArchiveIcon className="h-5 w-5 text-primary" />
//             </div>
//             <div>
//               <SheetTitle>Add Inventory</SheetTitle>
//               <SheetDescription>Create a new inventory record</SheetDescription>
//             </div>
//           </div>
//         </SheetHeader>

//         {/* Form */}
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="flex flex-col flex-1 overflow-hidden"
//           >
//             <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
//               {/* Item Search */}
//               <FormField
//                 control={form.control}
//                 name="item"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>
//                       Item <span className="text-destructive">*</span>
//                     </FormLabel>
//                     <FormControl>
//                       <ItemSearchCombobox
//                         value={field.value}
//                         onChange={field.onChange}
//                         disabled={isSubmitting}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
           


           
//               {/* Store */}
//              <div className="grid grid-cols-2 gap-4">
//                  <FormField
//                 control={form.control}
//                 name="storeId"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>
//                       Store <span className="text-destructive">*</span>
//                     </FormLabel>
//                     <Select
//                       disabled={isSubmitting || storesLoading}
//                       onValueChange={field.onChange}
//                       value={String(field.value ?? "")}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue
//                             placeholder={
//                               storesLoading
//                                 ? "Loading stores..."
//                                 : "Select store"
//                             }
//                           />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent className="z-106">
//                         {stores.map((s) => (
//                           <SelectItem
//                             key={s.STORE_ID}
//                             value={String(s.STORE_ID)}
//                           >
//                             {s.STORE_NAME}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//                 <FormField
//   control={form.control}
//   name="invtDate"
//   render={({ field }) => (
//     <FormItem>
//       <FormLabel>Invt Date</FormLabel>
//       <FormControl>
//         <DatePicker
//           className="w-full"
//           placeholder="Select date"
//           disabled={isSubmitting}
//           value={
//             field.value ? new Date(field.value) : new Date()
//           }
//           onChange={(date) =>
//             field.onChange(
//               date ? format(date, "yyyy-MM-dd") : ""
//             )
//           }
//         />
//       </FormControl>
//       <FormMessage />
//     </FormItem>
//   )}
// />

             
//              </div>
           

//               {/* Inv Qty + GRN No */}
//               <div className="grid grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="invQty"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Inv Qty</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           placeholder="0"
//                           disabled={isSubmitting}
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="grnNo"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>GRN No</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="GRN-001"
//                           disabled={isSubmitting}
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

             

//               {/* Price + Selling Unit Price */}
//               <div className="grid grid-cols-2 gap-4">
//                 {/* <FormField
//                   control={form.control}
//                   name="price"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Price</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           step="0.01"
//                           placeholder="0.00"
//                           disabled={isSubmitting}
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 /> */}
//                 {/* <FormField control={form.control} name="sellingUnitPrice" render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Selling Unit Price</FormLabel>
//                     <FormControl><Input type="number" step="0.01" placeholder="0.00" disabled={isSubmitting} {...field} /></FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )} /> */}
//               </div>

//               {/* Unit + Unit Price */}
//               <div className="grid grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="unitId"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Unit (UOM)</FormLabel>
//                       <Select
//                         disabled={isSubmitting || uomsLoading}
//                         onValueChange={(val) => {
//                           field.onChange(Number(val));
//                           // ✅ unit name auto-fill করুন
//                           const selected = uoms.find(
//                             (u) => String(u.ID) === val,
//                           );
//                           if (selected) form.setValue("unit", selected.NAME);
//                         }}
//                         value={field.value ? String(field.value) : ""}
//                       >
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue
//                               placeholder={
//                                 uomsLoading ? "Loading..." : "Select UOM"
//                               }
//                             />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent className="z-106">
//                           {uoms.map((u) => (
//                             <SelectItem key={u.ID} value={String(u.ID)}>
//                               {u.NAME}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="unitPrice"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Unit Price</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Unit Price"
//                           disabled={isSubmitting}
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//                {/* PO No + Invt Date */}
//               <div className="grid grid-cols-2 gap-4">
//                 {/* <FormField control={form.control} name="poNo" render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>PO No</FormLabel>
//                     <FormControl><Input type="number" placeholder="PO No" disabled={isSubmitting} {...field} /></FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )} /> */}

//                  <FormField
//                   control={form.control}
//                   name="price"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Price</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           step="0.01"
//                           placeholder="0.00"
//                           disabled={isSubmitting}
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
             
//               </div>

//               {/* Unit ID + Inventory Type */}
//               {/* <div className="grid grid-cols-2 gap-4">
//                 <FormField control={form.control} name="unitId" render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Unit ID</FormLabel>
//                     <FormControl><Input type="number" placeholder="Unit ID" disabled={isSubmitting} {...field} /></FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )} />
//                 <FormField control={form.control} name="inventoryType" render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Inventory Type</FormLabel>
//                     <FormControl><Input type="number" placeholder="Type" disabled={isSubmitting} {...field} /></FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )} />
//               </div> */}

//               {/* Inv Status + Invoice Status */}
//               <div className="grid grid-cols-2 gap-4">
//                 {/* <FormField control={form.control} name="invStatus" render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Inv Status</FormLabel>
//                     <Select disabled={isSubmitting} onValueChange={field.onChange} value={field.value}>
//                       <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
//                       <SelectContent>
//                         <SelectItem value="1">Pending</SelectItem>
//                         <SelectItem value="2">transfer</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )} /> */}
//                 {/* <FormField control={form.control} name="invoiceStatus" render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Invoice Status</FormLabel>
//                     <Select disabled={isSubmitting} onValueChange={field.onChange} value={field.value}>
//                       <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
//                       <SelectContent>
//                         <SelectItem value="0">Pending</SelectItem>
//                         <SelectItem value="1">Invoiced</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )} /> */}
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="flex justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={handleCancel}
//                 disabled={isSubmitting}
                
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isSubmitting}>
//                 {isSubmitting ? (
//                   <>
//                     <Spinner className="mr-2 h-4 w-4" />
//                     Creating...
//                   </>
//                 ) : (
//                   "Create Inventory"
//                 )}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </SheetContent>
//     </Sheet>
//   );
// }

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/DatePicker";
import { ArchiveIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { useCreateInventory } from "./queries";

// ─── Fetcher ──────────────────────────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_BASE_URL;

const fetchJSON = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  return json.data ?? json;
};

// ─── Inline hooks ─────────────────────────────────────────────────────────────
const useItemSearch = (query) =>
  useQuery({
    queryKey: ["items", "search", query],
    queryFn: () =>
      fetchJSON(`${BASE}/api/item?q=${encodeURIComponent(query)}&limit=20`),
    enabled: typeof query === "string" && query.trim().length >= 2,
    staleTime: 60 * 1000,
  });

const useUoms = () =>
  useQuery({
    queryKey: ["uoms"],
    queryFn: () => fetchJSON(`${BASE}/api/inv-uom`),
    staleTime: 10 * 60 * 1000,
  });

const useStores = () =>
  useQuery({
    queryKey: ["stores"],
    queryFn: () => fetchJSON(`${BASE}/api/stores`),
    staleTime: 5 * 60 * 1000,
  });

// ─── ItemSearchCombobox ───────────────────────────────────────────────────────
function ItemSearchCombobox({ value, onChange, disabled }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const { data: items = [], isFetching } = useItemSearch(query);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setOpen(true);
    if (!val) onChange(null);
  };

  const handleSelect = (item) => {
    onChange({ id: item.ITEM_ID, name: item.NAME });
    setQuery("");
    setOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Input
          placeholder="Search item by name or model..."
          value={open ? query : (value?.name ?? "")}
          disabled={disabled}
          onChange={handleInputChange}
          onFocus={() => {
            if (!value) setOpen(true);
          }}
          className={value && !open ? "pr-8" : ""}
          autoComplete="off"
        />
        {isFetching && open && (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
            <Spinner className="h-4 w-4" />
          </span>
        )}
        {value && !open && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-lg leading-none"
            aria-label="Clear selection"
          >
            ×
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {items.length > 0
            ? items.map((item) => (
                <button
                  key={item.ITEM_ID}
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm hover:bg-accent cursor-pointer"
                  onMouseDown={() => handleSelect(item)}
                >
                  <div className="font-medium">{item.NAME}</div>
                  {item.MODEL && (
                    <div className="text-xs text-muted-foreground">
                      {item.MODEL}
                    </div>
                  )}
                </button>
              ))
            : query.trim().length >= 2 &&
              !isFetching && (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No items found.
                </div>
              )}
          {query.trim().length < 2 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Type at least 2 characters to search...
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Schema (single-item mode) ────────────────────────────────────────────────
const formSchema = z.object({
  item: z.object(
    { id: z.number(), name: z.string() },
    { required_error: "Item is required" },
  ),
  storeId: z.coerce
    .number({ required_error: "Store is required" })
    .min(1, "Store is required"),
  invQty: z.coerce.number().min(0).optional(),
  grnNo: z.string().max(30).optional(),
  poNo: z.coerce.number().optional(),
  price: z.coerce.number().min(0).optional(),
  sellingUnitPrice: z.coerce.number().min(0).optional(),
  unit: z.string().max(10).optional(),
  unitPrice: z.string().max(10).optional(),
  unitId: z.coerce.number().optional(),
  inventoryType: z.coerce.number().optional(),
  itemType: z.coerce.number().optional(),
  accounted: z.coerce.number().optional(),
  invtDate: z.string().optional(),
  invStatus: z.string().optional(),
  invoiceStatus: z.string().optional(),
});

// ─── Component ────────────────────────────────────────────────────────────────
export default function AddInventorySheet({
  open,
  onOpenChange,
  showConfirmation,
  initialData, // { bulkItems: [{itemId, itemName, qty, price}], poNumber, invtDate } OR { itemId, itemName, qty, price, grnNo, invtDate } OR null
}) {
  const createMutation = useCreateInventory();
  const { data: stores = [], isLoading: storesLoading } = useStores();
  const { data: uoms = [], isLoading: uomsLoading } = useUoms();

  const isBulkMode = Array.isArray(initialData?.bulkItems) && initialData.bulkItems.length > 0;

  // ═══════════════════════════════════════════════════════════
  // BULK MODE STATE (multiple items from Purchase Recognition)
  // ═══════════════════════════════════════════════════════════
  const [bulkStoreId, setBulkStoreId] = useState("1");
  const [bulkDate, setBulkDate] = useState("");
  const [bulkGrnNo, setBulkGrnNo] = useState("");
  const [bulkPoNo, setBulkPoNo] = useState("");       // ✅ PR এর PO Number
  const [bulkRows, setBulkRows] = useState([]);
  const [bulkSubmitting, setBulkSubmitting] = useState(false);
  const [bulkDirty, setBulkDirty] = useState(false);

  useEffect(() => {
    if (open && isBulkMode) {
      setBulkStoreId("1");
      setBulkDate(initialData?.invtDate || format(new Date(), "yyyy-MM-dd"));
      setBulkPoNo(initialData?.poNumber || "");   // ✅ PR থেকে আসা PO Number

      // ✅ GRN No backend থেকে fetch — একবারই generate হবে, সব row শেয়ার করবে
      fetchJSON(`${BASE}/api/inventory/next-grn-no`)
        .then((res) => setBulkGrnNo(res.grnNo))
        .catch(() => setBulkGrnNo(""));

      setBulkRows(
        initialData.bulkItems.map((it) => ({
          itemId: it.itemId,
          itemName: it.itemName,
          qty: it.qty ?? "",
          price: it.price ?? "",   // ✅ per-unit price (PR থেকে আসছে)
        }))
      );
      setBulkDirty(false);
    }
  }, [open, isBulkMode, initialData]);

  const updateBulkRow = (idx, field, value) => {
    setBulkDirty(true);
    setBulkRows((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const handleBulkSubmit = async () => {
    if (!bulkStoreId) {
      toast.error("Please select a store.");
      return;
    }
    if (bulkRows.some((r) => !r.itemId)) {
      toast.error("Some items are missing a valid item reference.");
      return;
    }
    if (bulkRows.some((r) => !r.qty || Number(r.qty) <= 0)) {
      toast.error("Every item needs a valid quantity.");
      return;
    }

    setBulkSubmitting(true);
    const results = await Promise.allSettled(
      bulkRows.map((r) => {
        const qty = Number(r.qty || 0);
        const unitPrice = Number(r.price || 0);   // ✅ per-unit price (PR থেকে)
        const lineTotal = qty * unitPrice;         // ✅ INVENTORIES.PRICE ← total

        return createMutation.mutateAsync({
          item: r.itemId,
          storeId: bulkStoreId,
          invQty: r.qty || null,
          grnNo: bulkGrnNo || null,
          poNo: bulkPoNo || null,          // ✅ PR এর PO Number
          price: lineTotal || null,         // ✅ total
          sellingUnitPrice: null,
          unit: null,
          unitPrice: unitPrice || null,      // ✅ per-unit price
          unitId: null,
          inventoryType: null,
          itemType: null,
          accounted: null,
          invtDate: bulkDate || null,
          invStatus: 1,
          invoiceStatus: 0,
        });
      })
    );
    setBulkSubmitting(false);

    results.forEach((r, idx) => {
      if (r.status === "rejected") {
        console.error(`Row ${idx + 1} (${bulkRows[idx].itemName}) failed:`, r.reason);
      }
    });

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.length - succeeded;

    if (failed === 0) {
      toast.success(`${succeeded} inventory record(s) created successfully!`);
      onOpenChange(false);
    } else if (succeeded > 0) {
      toast.error(`${succeeded} created, ${failed} failed. Please retry the failed ones.`);
    } else {
      toast.error("Failed to create inventory records. Please try again.");
    }
  };

  const handleBulkCancel = async () => {
    if (bulkDirty && showConfirmation) {
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

  // ═══════════════════════════════════════════════════════════
  // SINGLE-ITEM MODE (normal "Add Inventory" flow — unchanged)
  // ═══════════════════════════════════════════════════════════
  const defaultValues = {
    item: null,
    storeId: "1",
    invQty: "",
    grnNo: "",
    poNo: "",
    price: "",
    sellingUnitPrice: "",
    unit: "",
    unitPrice: "",
    unitId: "",
    inventoryType: "",
    itemType: "",
    accounted: "",
    invtDate: "",
    invStatus: "1",
    invoiceStatus: "0",
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const {
    formState: { isDirty },
  } = form;

  useEffect(() => {
    if (open && !isBulkMode) {
      form.reset({
        ...defaultValues,
        item: initialData?.itemId
          ? { id: initialData.itemId, name: initialData.itemName }
          : null,
        invQty: initialData?.qty ?? "",
        grnNo: initialData?.grnNo ?? "",
        price: initialData?.price ?? "",
        invtDate: initialData?.invtDate ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isBulkMode, initialData]);

  const onSubmit = async (data) => {
    try {
      await createMutation.mutateAsync({
        item: data.item.id,
        storeId: data.storeId,
        invQty: data.invQty || null,
        grnNo: data.grnNo || null,
        poNo: data.poNo || null,
        price: data.price || null,
        sellingUnitPrice: data.sellingUnitPrice || null,
        unit: data.unit || null,
        unitPrice: data.unitPrice || null,
        unitId: data.unitId || null,
        inventoryType: data.inventoryType || null,
        itemType: data.itemType || null,
        accounted: data.accounted || null,
        invtDate: data.invtDate || null,
        invStatus: Number(data.invStatus ?? 1),
        invoiceStatus: Number(data.invoiceStatus ?? 0),
      });
      toast.success("Inventory created successfully!");
      form.reset(defaultValues);
      onOpenChange(false);
    } catch (err) {
      toast.error(
        err?.message || "Failed to create inventory. Please try again.",
      );
    }
  };

  const handleCancel = async () => {
    if (isDirty && showConfirmation) {
      const confirmed = await showConfirmation({
        title: "Discard changes?",
        description:
          "You have unsaved changes. Are you sure you want to close without saving?",
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

  // ═══════════════════════════════════════════════════════════
  // BULK MODE UI
  // ═══════════════════════════════════════════════════════════
  if (isBulkMode) {
    return (
      <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) handleBulkCancel(); }}>
        <SheetContent className="sm:max-w-3xl w-full flex flex-col gap-0 p-0 z-105">
          <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <ArchiveIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <SheetTitle>Add Inventory — {bulkRows.length} Items</SheetTitle>
                <SheetDescription>
                  From Purchase Recognition — each item will be created as a separate inventory record
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Common fields */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  Store <span className="text-destructive">*</span>
                </Label>
                <Select
                  disabled={bulkSubmitting || storesLoading}
                  onValueChange={(v) => { setBulkStoreId(v); setBulkDirty(true); }}
                  value={String(bulkStoreId ?? "")}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder={storesLoading ? "Loading..." : "Select store"} />
                  </SelectTrigger>
                  <SelectContent className="z-110">
                    {stores.map((s) => (
                      <SelectItem key={s.STORE_ID} value={String(s.STORE_ID)}>
                        {s.STORE_NAME}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Invt Date</Label>
                <DatePicker
                  className="w-full"
                  placeholder="Select date"
                  disabled={bulkSubmitting}
                  value={bulkDate ? new Date(bulkDate) : new Date()}
                  onChange={(date) => {
                    setBulkDate(date ? format(date, "yyyy-MM-dd") : "");
                    setBulkDirty(true);
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">GRN No</Label>
                <Input
                  value={bulkGrnNo}
                  disabled
                  className="h-9 bg-muted/50"
                  placeholder="Auto-generating..."
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">PO No</Label>
                <Input
                  value={bulkPoNo}
                  disabled
                  className="h-9 bg-muted/50"
                />
              </div>
            </div>

            {/* Items table */}
            <div className="rounded-md overflow-hidden border border-border">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr style={{ background: "#1a3c34" }}>
                    {["#", "Item", "Qty", "Unit Price", "Price", ""].map((h) => (
                      <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-white whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bulkRows.map((row, idx) => (
                    <tr key={idx} className="border-t border-border">
                      <td className="px-3 py-1 text-center text-muted-foreground w-8">{idx + 1}</td>
                      <td className="px-3 py-1.5 font-medium">{row.itemName || `Item #${row.itemId}`}</td>
                      <td className="px-1 py-1 w-24">
                        <Input
                          type="number" min="0"
                          value={row.qty}
                          onChange={(e) => updateBulkRow(idx, "qty", e.target.value)}
                          disabled={bulkSubmitting}
                          className="h-8 text-sm text-center"
                        />
                      </td>
                      <td className="px-1 py-1 w-28">
                        <Input
                          type="number" min="0" step="0.01"
                          value={row.price}
                          onChange={(e) => updateBulkRow(idx, "price", e.target.value)}
                          disabled={bulkSubmitting}
                          className="h-8 text-sm text-center"
                        />
                      </td>
                      <td className="px-3 py-1 w-28 text-right tabular-nums font-medium text-orange-600 dark:text-orange-400">
                        {(Number(row.qty || 0) * Number(row.price || 0)).toLocaleString(undefined, {
                          minimumFractionDigits: 2, maximumFractionDigits: 2,
                        })}
                      </td>
                      <td />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
            <Button type="button" variant="outline" onClick={handleBulkCancel} disabled={bulkSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleBulkSubmit} disabled={bulkSubmitting || bulkRows.length === 0}>
              {bulkSubmitting
                ? <><Spinner className="mr-2 h-4 w-4" />Creating {bulkRows.length} items...</>
                : `Create All (${bulkRows.length})`}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // SINGLE-ITEM MODE UI (unchanged — normal "Add Inventory" button flow)
  // ═══════════════════════════════════════════════════════════
  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleCancel();
      }}
    >
      <SheetContent className="sm:max-w-xl w-full flex flex-col gap-0 p-0 z-105">
        <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <ArchiveIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Add Inventory</SheetTitle>
              <SheetDescription>Create a new inventory record</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <FormField
                control={form.control}
                name="item"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Item <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <ItemSearchCombobox
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="storeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Store <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        disabled={isSubmitting || storesLoading}
                        onValueChange={field.onChange}
                        value={String(field.value ?? "")}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={storesLoading ? "Loading stores..." : "Select store"}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="z-106">
                          {stores.map((s) => (
                            <SelectItem key={s.STORE_ID} value={String(s.STORE_ID)}>
                              {s.STORE_NAME}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="invtDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invt Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          className="w-full"
                          placeholder="Select date"
                          disabled={isSubmitting}
                          value={field.value ? new Date(field.value) : new Date()}
                          onChange={(date) =>
                            field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="invQty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inv Qty</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" disabled={isSubmitting} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="grnNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GRN No</FormLabel>
                      <FormControl>
                        <Input placeholder="GRN-001" disabled={isSubmitting} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="unitId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit (UOM)</FormLabel>
                      <Select
                        disabled={isSubmitting || uomsLoading}
                        onValueChange={(val) => {
                          field.onChange(Number(val));
                          const selected = uoms.find((u) => String(u.ID) === val);
                          if (selected) form.setValue("unit", selected.NAME);
                        }}
                        value={field.value ? String(field.value) : ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={uomsLoading ? "Loading..." : "Select UOM"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="z-106">
                          {uoms.map((u) => (
                            <SelectItem key={u.ID} value={String(u.ID)}>
                              {u.NAME}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unitPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Price</FormLabel>
                      <FormControl>
                        <Input placeholder="Unit Price" disabled={isSubmitting} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.00" disabled={isSubmitting} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Creating...
                  </>
                ) : (
                  "Create Inventory"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}