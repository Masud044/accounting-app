// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { format } from "date-fns";
// import { useQuery } from "@tanstack/react-query";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetDescription,
// } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import { cn } from "@/lib/utils";
// import { DatePicker } from "@/components/DatePicker";
// import { ArchiveIcon, Trash2, Plus, Check, ChevronsUpDown } from "lucide-react";
// import { Spinner } from "@/components/ui/spinner";
// import { useInventoryById, useUpdateInventory } from "./queries";

// const BASE = import.meta.env.VITE_API_BASE_URL;
// const fetchJSON = async (url) => {
//   const res = await fetch(url);
//   if (!res.ok)
//     throw new Error(
//       (await res.json().catch(() => ({}))).message || res.statusText,
//     );
//   const json = await res.json();
//   return json.data ?? json;
// };

// // value: { id, name } | null, enabled: shudhu popover open thakle query chalabe
// const useItemSearch = (query, enabled) =>
//   useQuery({
//     queryKey: ["items", "search", query],
//     queryFn: () =>
//       fetchJSON(`${BASE}/api/item?q=${encodeURIComponent(query)}&limit=20`),
//     enabled,
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
//     queryKey: ["inv-stores"],
//     queryFn: () => fetchJSON(`${BASE}/api/stores`),
//     staleTime: 5 * 60 * 1000,
//   });

// let rowIdCounter = 0;
// const newRow = (overrides = {}) => ({
//   key: `row-${++rowIdCounter}`,
//   tid: null, // existing hole TID thakbe, notun hole null
//   item: null,
//   invQty: "", // GRN Qty
//   receiveQty: "", // Receive Qty
//   unitId: "",
//   unit: "",
//   unitPrice: "",
//   price: "",
//   invStatus: 1,
//   ...overrides,
// });

// // ─── Item picker — table cell er jonno (Popover + Command, ItemPicker er moto) ──
// function ItemCellPicker({ value, onChange, disabled }) {
//   const [open, setOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   const { data: results = [], isFetching } = useItemSearch(query, open);

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <button
//           type="button"
//           disabled={disabled}
//           className="h-8 w-full flex items-center justify-between text-sm bg-background px-2 rounded-md border border-input focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           <span
//             className={cn(
//               "truncate text-left",
//               !value?.name && "text-muted-foreground",
//             )}
//           >
//             {value?.name || "Search item..."}
//           </span>
//           <ChevronsUpDown className="h-3.5 w-3.5 opacity-50 shrink-0 ml-1" />
//         </button>
//       </PopoverTrigger>
//       <PopoverContent className="p-0 w-72 z-[200]" align="start">
//         <Command shouldFilter={false}>
//           <CommandInput
//             placeholder="Search item name..."
//             value={query}
//             onValueChange={setQuery}
//           />
//           <CommandList>
//             <CommandEmpty>
//               {isFetching ? "Searching..." : "No items found."}
//             </CommandEmpty>
//             <CommandGroup>
//               {results.map((item) => (
//                 <CommandItem
//                   key={item.ITEM_ID}
//                   value={String(item.ITEM_ID)}
//                   onSelect={() => {
//                     onChange({ id: item.ITEM_ID, name: item.NAME });
//                     setOpen(false);
//                   }}
//                 >
//                   <Check
//                     className={cn(
//                       "mr-2 h-4 w-4",
//                       String(value?.id) === String(item.ITEM_ID)
//                         ? "opacity-100"
//                         : "opacity-0",
//                     )}
//                   />
//                   <div className="flex flex-col">
//                     <span className="text-sm">{item.NAME}</span>
//                     {item.DESCRIPTION && (
//                       <span className="text-xs text-muted-foreground">
//                         {item.DESCRIPTION}
//                       </span>
//                     )}
//                   </div>
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// }

// export default function UpdateInventorySheet({
//   open,
//   onOpenChange,
//   showConfirmation,
//   hid,
// }) {
//   const { data: inv, isLoading } = useInventoryById(hid);
//   const { data: stores = [] } = useStores();
//   const { data: uoms = [] } = useUoms();
//   const updateMutation = useUpdateInventory();

//   const [storeId, setStoreId] = useState("");
//   const [invDate, setInvDate] = useState("");
//   const [grnNo, setGrnNo] = useState("");
//   const [poNo, setPoNo] = useState("");
//   const [rows, setRows] = useState([]);
//   const [dirty, setDirty] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     if (!inv) return;
//     setStoreId(inv.STORE_ID ? String(inv.STORE_ID) : "");
//     setInvDate(
//       inv.INV_DATE ? format(new Date(inv.INV_DATE), "yyyy-MM-dd") : "",
//     );
//     setGrnNo(inv.GRN_NO || "");
//     setPoNo(inv.PO_NO || "");
//     setRows(
//       (inv.items || []).map((it) =>
//         newRow({
//           tid: it.TID,
//           item: { id: it.INV_ITEM_ID, name: it.ITEM_NAME },
//           invQty: it.INVQTY ?? "",
//           receiveQty: it.RECEIVE_QTY ?? "",
//           unit: it.INV_UNIT || "",
//           unitPrice: it.UNIT_PRICE || "",
//           unitId: it.INV_UNIT_ID ?? "",
//           price: it.INV_PRICE ?? "",
//           invStatus: it.INVSTATUS,
//         }),
//       ),
//     );
//     setDirty(false);
//   }, [inv]);

//   const updateRow = (idx, field, value) => {
//     setDirty(true);
//     setRows((prev) => {
//       const next = [...prev];
//       const row = { ...next[idx], [field]: value };
//       if (field === "receiveQty" || field === "unitPrice") {
//         const rq = Number(field === "receiveQty" ? value : row.receiveQty) || 0;
//         const up = Number(field === "unitPrice" ? value : row.unitPrice) || 0;
//         row.price = rq && up ? (rq * up).toFixed(2) : "";
//       }
//       if (field === "unitId") {
//         const selected = uoms.find((u) => String(u.ID) === String(value));
//         row.unit = selected?.NAME || "";
//       }
//       next[idx] = row;
//       return next;
//     });
//   };

//   const addRow = () => {
//     setDirty(true);
//     setRows((prev) => [...prev, newRow()]);
//   };

//   // ✅ Existing row hole simply list theke shore jabe (backend diff-based delete korbe)
//   //    Notun (unsaved) row hole shudhu local remove
//   const removeRow = (idx) => {
//     setDirty(true);
//     setRows((prev) => prev.filter((_, i) => i !== idx));
//   };

//   const buildItemsPayload = (overrideIdx, overrideStatus) =>
//     rows.map((r, i) => ({
//       tid: r.tid || undefined,
//       item: r.item?.id,
//       invQty: r.invQty ? Number(r.invQty) : null,
//       receiveQty: r.receiveQty !== "" ? Number(r.receiveQty) : null,
//       unit: r.unit || null,
//       unitPrice: r.unitPrice || null,
//       unitId: r.unitId ? Number(r.unitId) : null,
//       price: r.price ? Number(r.price) : null,
//       invStatus: overrideIdx === i ? overrideStatus : Number(r.invStatus ?? 1),
//       invoiceStatus: 0,
//     }));

//   const handleSave = async () => {
//     if (!storeId) return toast.error("Store select korun.");
//     if (rows.some((r) => !r.item))
//       return toast.error("Shob row e item select korte hobe.");
//     if (rows.some((r) => !r.invQty || Number(r.invQty) <= 0))
//       return toast.error("Shob row e valid quantity din.");

//     setSubmitting(true);
//     try {
//       await updateMutation.mutateAsync({
//         hid,
//         data: {
//           invDate: invDate || null,
//           storeId,
//           grnNo: grnNo || null,
//           poNo: poNo || null,
//           items: buildItemsPayload(),
//         },
//       });
//       toast.success("Inventory updated successfully!");
//       onOpenChange(false);
//     } catch (err) {
//       toast.error(err?.message || "Failed to update inventory.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleTransfer = async (idx) => {
//     const row = rows[idx];
//     const confirmed = await showConfirmation({
//       title: "Transfer to Stock?",
//       description: `${row.item?.name} — Do you want to transfer to stock?`,
//       confirmText: "Transfer",
//       cancelText: "Cancel",
//     });
//     if (!confirmed) return;

//     setSubmitting(true);
//     try {
//       await updateMutation.mutateAsync({
//         hid,
//         data: {
//           invDate: invDate || null,
//           storeId,
//           grnNo: grnNo || null,
//           poNo: poNo || null,
//           items: buildItemsPayload(idx, 2),
//         },
//       });
//       updateRow(idx, "invStatus", 2);
//       toast.success(`${row.item?.name} transferred!`);
//     } catch (err) {
//       toast.error(err?.message || "Transfer failed.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleCancel = async () => {
//     if (dirty && showConfirmation) {
//       const confirmed = await showConfirmation({
//         title: "Discard changes?",
//         description: "Unsaved changes.?want to break through and get out",
//         confirmText: "Discard",
//         cancelText: "Keep Editing",
//         variant: "destructive",
//       });
//       if (!confirmed) return;
//     }
//     onOpenChange(false);
//   };

//   const isSubmitting = submitting || updateMutation.isPending;
//   const total = rows.reduce((sum, r) => sum + (Number(r.price) || 0), 0);

//   return (
//     <Sheet
//       open={open}
//       onOpenChange={(o) => {
//         if (!o) handleCancel();
//       }}
//     >
//       <SheetContent className="sm:max-w-5xl w-full flex flex-col gap-0 p-0 z-110">
//         <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
//           <div className="flex items-center gap-3">
//             <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
//               <ArchiveIcon className="h-5 w-5 text-primary" />
//             </div>
//             <div>
//               <SheetTitle>
//                 Update Inventory — GRN {grnNo || `#${hid}`}
//               </SheetTitle>
//               <SheetDescription>
//                 Header o {rows.length} item edit korun, notun item o add korte
//                 paren
//               </SheetDescription>
//             </div>
//           </div>
//         </SheetHeader>

//         {isLoading ? (
//           <div className="flex-1 flex items-center justify-center">
//             <Spinner className="h-8 w-8" />
//           </div>
//         ) : (
//           <>
//             <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div className="space-y-1.5">
//                   <Label className="text-xs font-medium">Store</Label>
//                   <Select
//                     disabled={isSubmitting}
//                     onValueChange={(v) => {
//                       setStoreId(v);
//                       setDirty(true);
//                     }}
//                     value={storeId}
//                   >
//                     <SelectTrigger className="h-9">
//                       <SelectValue placeholder="Select store" />
//                     </SelectTrigger>
//                     <SelectContent className="z-115">
//                       {stores.map((s) => (
//                         <SelectItem key={s.STORE_ID} value={String(s.STORE_ID)}>
//                           {s.STORE_NAME}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-1.5">
//                   <Label className="text-xs font-medium">Inv Date</Label>
//                   <DatePicker
//                     className="w-full"
//                     disabled={isSubmitting}
//                     value={invDate ? new Date(invDate) : undefined}
//                     onChange={(d) => {
//                       setInvDate(d ? format(d, "yyyy-MM-dd") : "");
//                       setDirty(true);
//                     }}
//                   />
//                 </div>
//                 <div className="space-y-1.5">
//                   <Label className="text-xs font-medium">GRN No</Label>
//                   <Input value={grnNo} disabled className="h-9 bg-muted/50" />
//                 </div>
//                 <div className="space-y-1.5">
//                   <Label className="text-xs font-medium">PO No</Label>
//                   <Input value={poNo} disabled className="h-9 bg-muted/50" />
//                 </div>
//               </div>

//               <div className="rounded-md border border-border overflow-visible">
//                 <table className="w-full text-sm border-collapse">
//                   <thead>
//                     <tr style={{ background: "#1a3c34" }}>
//                       {[
//                         "#",
//                         "Item",
//                         "GRN Qty",
//                         "Receive Qty",
//                         "UOM",
//                         "Unit Price",
//                         "Total",
//                         "Status",
//                         "",
//                       ].map((h) => (
//                         <th
//                           key={h}
//                           className="px-3 py-2 text-left text-xs font-semibold text-white whitespace-nowrap"
//                         >
//                           {h}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {rows.map((row, idx) => {
//                       const isTransferred = row.invStatus === 2;
//                       const isNew = !row.tid;
//                       return (
//                         <tr key={row.key} className="border-t border-border">
//                           <td className="px-3 py-1 text-center text-muted-foreground w-8">
//                             {idx + 1}
//                           </td>
//                           <td className="px-1 py-1 min-w-[180px]">
//                             {isNew ? (
//                               <ItemCellPicker
//                                 value={row.item}
//                                 onChange={(v) => updateRow(idx, "item", v)}
//                                 disabled={isSubmitting}
//                               />
//                             ) : (
//                               <div className="px-2 py-1.5 font-medium text-sm">
//                                 {row.item?.name}
//                               </div>
//                             )}
//                           </td>
//                           <td className="px-1 py-1 w-24">
//                             <Input
//                               type="number"
//                               min="0"
//                               value={row.invQty}
//                                disabled={
//                                 isSubmitting ||
//                                 isTransferred ||
//                                 (row.invQty !== "" &&
//                                   Number(row.invQty) === Number(row.receiveQty))
//                               }
//                               onChange={(e) =>
//                                 updateRow(idx, "invQty", e.target.value)
//                               }
//                               className="h-8 text-sm text-center"
//                             />
//                           </td>
//                           <td className="px-1 py-1 w-24">
//                             <Input
//                               type="number"
//                               min="0"
//                               value={row.receiveQty}
//                               disabled={
//                                 isSubmitting ||
//                                 isTransferred ||
//                                 (row.invQty !== "" &&
//                                   Number(row.invQty) === Number(row.receiveQty))
//                               }
//                               onChange={(e) =>
//                                 updateRow(idx, "receiveQty", e.target.value)
//                               }
//                               className="h-8 text-sm text-center"
//                             />
//                           </td>
//                           <td className="px-1 py-1 w-28">
//                             <Select
//                               disabled={isSubmitting || isTransferred}
//                               onValueChange={(v) => updateRow(idx, "unitId", v)}
//                               value={row.unitId ? String(row.unitId) : ""}
//                             >
//                               <SelectTrigger className="h-8 text-sm">
//                                 <SelectValue placeholder="UOM" />
//                               </SelectTrigger>
//                               <SelectContent className="z-115">
//                                 {uoms.map((u) => (
//                                   <SelectItem key={u.ID} value={String(u.ID)}>
//                                     {u.NAME}
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                           </td>
//                           <td className="px-1 py-1 w-28">
//                             <Input
//                               type="number"
//                               min="0"
//                               step="0.01"
//                               value={row.unitPrice}
//                               disabled={isSubmitting || isTransferred}
//                               onChange={(e) =>
//                                 updateRow(idx, "unitPrice", e.target.value)
//                               }
//                               className="h-8 text-sm text-center"
//                             />
//                           </td>
//                           <td className="px-1 py-1 w-28">
//                             <Input
//                               type="number"
//                               min="0"
//                               step="0.01"
//                               value={row.price}
//                               disabled
//                               readOnly
//                               className="h-8 text-sm text-center font-medium bg-muted/50"
//                             />
//                           </td>
//                           <td className="px-3 py-1 whitespace-nowrap">
//                             {isTransferred ? (
//                               <span className="text-xs font-medium text-green-600 dark:text-green-400">
//                                 ✓ Transferred
//                               </span>
//                             ) : (
//                               <span className="text-xs font-medium text-yellow-600">
//                                 Pending
//                               </span>
//                             )}
//                           </td>
//                           <td className="px-2 py-1 whitespace-nowrap">
//                             <div className="flex items-center gap-1">
//                               {!isTransferred && !isNew && (
//                                 <Button
//                                   type="button"
//                                   variant="ghost"
//                                   size="sm"
//                                   className="h-7 text-xs text-blue-600 hover:text-blue-800"
//                                   onClick={() => handleTransfer(idx)}
//                                   disabled={isSubmitting}
//                                 >
//                                   Transfer
//                                 </Button>
//                               )}
//                               {!isTransferred && (
//                                 <Button
//                                   type="button"
//                                   variant="ghost"
//                                   size="icon"
//                                   className="h-7 w-7 text-destructive"
//                                   onClick={() => removeRow(idx)}
//                                   disabled={isSubmitting}
//                                 >
//                                   <Trash2 className="h-3.5 w-3.5" />
//                                 </Button>
//                               )}
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                   <tfoot>
//                     <tr className="border-t border-border bg-muted/30">
//                       <td
//                         colSpan={6}
//                         className="px-3 py-2 text-right text-xs font-medium text-muted-foreground"
//                       >
//                         Total
//                       </td>
//                       <td className="px-3 py-2 font-semibold tabular-nums">
//                         {total.toFixed(2)}
//                       </td>
//                       <td colSpan={2} />
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>

//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={addRow}
//                 disabled={isSubmitting}
//               >
//                 <Plus className="h-4 w-4 mr-1" /> Add Item
//               </Button>
//             </div>

//             <div className="flex justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={handleCancel}
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </Button>
//               <Button onClick={handleSave} disabled={isSubmitting}>
//                 {isSubmitting ? (
//                   <>
//                     <Spinner className="mr-2 h-4 w-4" />
//                     Saving...
//                   </>
//                 ) : (
//                   "Save Changes"
//                 )}
//               </Button>
//             </div>
//           </>
//         )}
//       </SheetContent>
//     </Sheet>
//   );
// }


import { useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/DatePicker";
import {
  ArchiveIcon,
  Trash2,
  Plus,
  Check,
  ChevronsUpDown,
  Wallet,
  Lock,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
  useInventoryById,
  useUpdateInventory,
  useSuppliers,
} from "./queries";
import { useAuthUserId } from "@/hooks/use-auth-helper-id";

const BASE = import.meta.env.VITE_API_BASE_URL;
const fetchJSON = async (url) => {
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(
      (await res.json().catch(() => ({}))).message || res.statusText,
    );
  const json = await res.json();
  return json.data ?? json;
};

// value: { id, name } | null, enabled: shudhu popover open thakle query chalabe
const useItemSearch = (query, enabled) =>
  useQuery({
    queryKey: ["items", "search", query],
    queryFn: () =>
      fetchJSON(`${BASE}/api/item?q=${encodeURIComponent(query)}&limit=20`),
    enabled,
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
    queryKey: ["inv-stores"],
    queryFn: () => fetchJSON(`${BASE}/api/stores`),
    staleTime: 5 * 60 * 1000,
  });

let rowIdCounter = 0;
const newRow = (overrides = {}) => ({
  key: `row-${++rowIdCounter}`,
  tid: null, // existing hole TID thakbe, notun hole null
  item: null,
  invQty: "", // GRN Qty
  receiveQty: "", // Receive Qty
  unitId: "",
  unit: "",
  unitPrice: "",
  price: "",
  invStatus: 1,
  ...overrides,
});

// ─── Item picker — table cell er jonno (Popover + Command, ItemPicker er moto) ──
function ItemCellPicker({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { data: results = [], isFetching } = useItemSearch(query, open);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="h-8 w-full flex items-center justify-between text-sm bg-background px-2 rounded-md border border-input focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span
            className={cn(
              "truncate text-left",
              !value?.name && "text-muted-foreground",
            )}
          >
            {value?.name || "Search item..."}
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 opacity-50 shrink-0 ml-1" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-72 z-[200]" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search item name..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>
              {isFetching ? "Searching..." : "No items found."}
            </CommandEmpty>
            <CommandGroup>
              {results.map((item) => (
                <CommandItem
                  key={item.ITEM_ID}
                  value={String(item.ITEM_ID)}
                  onSelect={() => {
                    onChange({ id: item.ITEM_ID, name: item.NAME });
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      String(value?.id) === String(item.ITEM_ID)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm">{item.NAME}</span>
                    {item.DESCRIPTION && (
                      <span className="text-xs text-muted-foreground">
                        {item.DESCRIPTION}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function UpdateInventorySheet({
  open,
  onOpenChange,
  showConfirmation,
  hid,
}) {
  const { data: inv, isLoading } = useInventoryById(hid);
  const { data: stores = [] } = useStores();
  const { data: uoms = [] } = useUoms();
  const { data: suppliers = [] } = useSuppliers();
  const updateMutation = useUpdateInventory();

  const [storeId, setStoreId] = useState("");
  const [invDate, setInvDate] = useState("");
  const [grnNo, setGrnNo] = useState("");
  const [poNo, setPoNo] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [rows, setRows] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const userId =useAuthUserId();

  useEffect(() => {
    if (!inv) return;
    setStoreId(inv.STORE_ID ? String(inv.STORE_ID) : "");
    setInvDate(
      inv.INV_DATE ? format(new Date(inv.INV_DATE), "yyyy-MM-dd") : "",
    );
    setGrnNo(inv.GRN_NO || "");
    setPoNo(inv.PO_NO || "");
    setInvoiceNo(inv.INVOICE_NUMBER || "");
    setSupplierId(inv.SUPPLIER_ID ? String(inv.SUPPLIER_ID) : "");
    setRows(
      (inv.items || []).map((it) =>
        newRow({
          tid: it.TID,
          item: { id: it.INV_ITEM_ID, name: it.ITEM_NAME },
          invQty: it.INVQTY ?? "",
          receiveQty: it.RECEIVE_QTY ?? "",
          unit: it.INV_UNIT || "",
          unitPrice: it.UNIT_PRICE || "",
          unitId: it.INV_UNIT_ID ?? "",
          price: it.INV_PRICE ?? "",
          invStatus: it.INVSTATUS,
        }),
      ),
    );
    setDirty(false);
  }, [inv]);

  const updateRow = (idx, field, value) => {
    if (isReadOnly) return;
    setDirty(true);
    setRows((prev) => {
      const next = [...prev];
      const row = { ...next[idx], [field]: value };
      if (field === "receiveQty" || field === "unitPrice") {
        const rq = Number(field === "receiveQty" ? value : row.receiveQty) || 0;
        const up = Number(field === "unitPrice" ? value : row.unitPrice) || 0;
        row.price = rq && up ? (rq * up).toFixed(2) : "";
      }
      if (field === "unitId") {
        const selected = uoms.find((u) => String(u.ID) === String(value));
        row.unit = selected?.NAME || "";
      }
      next[idx] = row;
      return next;
    });
  };

  const addRow = () => {
    if (isReadOnly) return; 
    setDirty(true);
    setRows((prev) => [...prev, newRow()]);
  };

  // ✅ Existing row hole simply list theke shore jabe (backend diff-based delete korbe)
  //    Notun (unsaved) row hole shudhu local remove
  const removeRow = (idx) => {
    if (isReadOnly) return; 
    setDirty(true);
    setRows((prev) => prev.filter((_, i) => i !== idx));
  };

  const buildItemsPayload = (overrideIdx, overrideStatus) =>
    rows.map((r, i) => ({
      tid: r.tid || undefined,
      item: r.item?.id,
      invQty: r.invQty ? Number(r.invQty) : null,
      receiveQty: r.receiveQty !== "" ? Number(r.receiveQty) : null,
      unit: r.unit || null,
      unitPrice: r.unitPrice || null,
      unitId: r.unitId ? Number(r.unitId) : null,
      price: r.price ? Number(r.price) : null,
      invStatus: overrideIdx === i ? overrideStatus : Number(r.invStatus ?? 1),
      invoiceStatus: 0,
    }));

  const handleSave = async () => {
    if (!storeId) return toast.error("Store select korun.");
    if (rows.some((r) => !r.item))
      return toast.error("Shob row e item select korte hobe.");
    if (rows.some((r) => !r.invQty || Number(r.invQty) <= 0))
      return toast.error("Shob row e valid quantity din.");

    setSubmitting(true);
    try {
      await updateMutation.mutateAsync({
        hid,
        data: {
          invDate: invDate || null,
          storeId,
          grnNo: grnNo || null,
          poNo: poNo || null,
          supplierId: supplierId ? Number(supplierId) : null,
          items: buildItemsPayload(),
           updateBy: userId,      
        },
      });
      toast.success("Inventory updated successfully!");
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to update inventory.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTransfer = async (idx) => {
    const row = rows[idx];
    const confirmed = await showConfirmation({
      title: "Transfer to Stock?",
      description: `${row.item?.name} — Do you want to transfer to stock?`,
      confirmText: "Transfer",
      cancelText: "Cancel",
    });
    if (!confirmed) return;

    setSubmitting(true);
    try {
      await updateMutation.mutateAsync({
        hid,
        data: {
          invDate: invDate || null,
          storeId,
          grnNo: grnNo || null,
          poNo: poNo || null,
          supplierId: supplierId ? Number(supplierId) : null,
          items: buildItemsPayload(idx, 2),
           updateBy: userId,      
        },
      });
      updateRow(idx, "invStatus", 2);
      toast.success(`${row.item?.name} transferred!`);
    } catch (err) {
      toast.error(err?.message || "Transfer failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (dirty && showConfirmation) {
      const confirmed = await showConfirmation({
        title: "Discard changes?",
        description: "Unsaved changes.?want to break through and get out",
        confirmText: "Discard",
        cancelText: "Keep Editing",
        variant: "destructive",
      });
      if (!confirmed) return;
    }
    onOpenChange(false);
  };
// ── Lock state: PAYMENT_CREATED = 1 hole পুরো ফর্ম view-only ──────────────
const isLocked      = Number(inv?.PAYMENT_CREATED) === 1;
const isSubmitting  = submitting || updateMutation.isPending;
const isReadOnly    = isSubmitting || isLocked;
  const total = rows.reduce((sum, r) => sum + (Number(r.price) || 0), 0);

  // ✅ Payment Voucher button — Invoice No, Supplier, Total niye Payment Create e jabe
  const paymentState = {
     inventoryHid: hid,        
    supplier: supplierId ?? "",
    entryDate: invDate || format(new Date(), "yyyy-MM-dd"),
    glDate: invDate || format(new Date(), "yyyy-MM-dd"),
    description: `Payment against Inventory GRN ${grnNo}`,
    invoiceNo: invoiceNo || "",
    poNumber: poNo || "",
    grnNo: grnNo || "",
    // rows: [
    //   {
    //     particulars: `Inventory GRN ${grnNo}`,
    //     amount: total,
    //   },
    // ],
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        if (!o) handleCancel();
      }}
    >
      <SheetContent className="sm:max-w-5xl w-full flex flex-col gap-0 p-0 z-110">
        <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <ArchiveIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle className="flex items-center gap-2">
  Update Inventory — GRN {grnNo || `#${hid}`}
  {isLocked && (
    <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-semibold">
      <Lock className="h-3 w-3" /> Locked
    </span>
  )}
</SheetTitle>
<SheetDescription>
  {isLocked
    ? "Payment Voucher already created — view only, editing disabled."
    : `Header o ${rows.length} item edit and new item  add`}
</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Spinner className="h-8 w-8" />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Store</Label>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={(v) => {
                      setStoreId(v);
                      setDirty(true);
                    }}
                    value={storeId}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select store" />
                    </SelectTrigger>
                    <SelectContent className="z-115">
                      {stores.map((s) => (
                        <SelectItem key={s.STORE_ID} value={String(s.STORE_ID)}>
                          {s.STORE_NAME}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Inv Date</Label>
                  <DatePicker
                    className="w-full"
                    disabled={isSubmitting}
                    value={invDate ? new Date(invDate) : undefined}
                    onChange={(d) => {
                      setInvDate(d ? format(d, "yyyy-MM-dd") : "");
                      setDirty(true);
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">GRN No</Label>
                  <Input value={grnNo} disabled className="h-9 bg-muted/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">PO No</Label>
                  <Input value={poNo} disabled className="h-9 bg-muted/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Invoice No</Label>
                  <Input
                    value={invoiceNo}
                    disabled
                    className="h-9 bg-muted/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Supplier</Label>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={(v) => {
                      setSupplierId(v);
                      setDirty(true);
                    }}
                    value={supplierId}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent className="z-115">
                      {suppliers.map((s) => (
                        <SelectItem
                          key={s.SUPPLIER_ID}
                          value={String(s.SUPPLIER_ID)}
                        >
                          {s.SUPPLIER_NAME}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border border-border overflow-visible">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr style={{ background: "#1a3c34" }}>
                      {[
                        "#",
                        "Item",
                        "GRN Qty",
                        "Receive Qty",
                        "UOM",
                        "Unit Price",
                        "Total",
                        "Status",
                        "",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-3 py-2 text-left text-xs font-semibold text-white whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => {
                      const isTransferred = row.invStatus === 2;
                      const isNew = !row.tid;
                      return (
                        <tr key={row.key} className="border-t border-border">
                          <td className="px-3 py-1 text-center text-muted-foreground w-8">
                            {idx + 1}
                          </td>
                          <td className="px-1 py-1 min-w-[180px]">
                            {isNew ? (
                              <ItemCellPicker
                                value={row.item}
                                onChange={(v) => updateRow(idx, "item", v)}
                                disabled={isSubmitting}
                              />
                            ) : (
                              <div className="px-2 py-1.5 font-medium text-sm">
                                {row.item?.name}
                              </div>
                            )}
                          </td>
                          <td className="px-1 py-1 w-24">
                            <Input
                              type="number"
                              min="0"
                              value={row.invQty}
                              disabled={
                                isSubmitting ||
                                isTransferred ||
                                (row.invQty !== "" &&
                                  Number(row.invQty) === Number(row.receiveQty))
                              }
                              onChange={(e) =>
                                updateRow(idx, "invQty", e.target.value)
                              }
                              className="h-8 text-sm text-center"
                            />
                          </td>
                          <td className="px-1 py-1 w-24">
                            <Input
                              type="number"
                              min="0"
                              value={row.receiveQty}
                              disabled={
                                isSubmitting ||
                                isTransferred ||
                                (row.invQty !== "" &&
                                  Number(row.invQty) === Number(row.receiveQty))
                              }
                              onChange={(e) =>
                                updateRow(idx, "receiveQty", e.target.value)
                              }
                              className="h-8 text-sm text-center"
                            />
                          </td>
                          <td className="px-1 py-1 w-28">
                            <Select
                              disabled={isSubmitting || isTransferred}
                              onValueChange={(v) => updateRow(idx, "unitId", v)}
                              value={row.unitId ? String(row.unitId) : ""}
                            >
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue placeholder="UOM" />
                              </SelectTrigger>
                              <SelectContent className="z-115">
                                {uoms.map((u) => (
                                  <SelectItem key={u.ID} value={String(u.ID)}>
                                    {u.NAME}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-1 py-1 w-28">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={row.unitPrice}
                              disabled={isSubmitting || isTransferred}
                              onChange={(e) =>
                                updateRow(idx, "unitPrice", e.target.value)
                              }
                              className="h-8 text-sm text-center"
                            />
                          </td>
                          <td className="px-1 py-1 w-28">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={row.price}
                              disabled
                              readOnly
                              className="h-8 text-sm text-center font-medium bg-muted/50"
                            />
                          </td>
                          <td className="px-3 py-1 whitespace-nowrap">
                            {isTransferred ? (
                              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                ✓ Transferred
                              </span>
                            ) : (
                              <span className="text-xs font-medium text-yellow-600">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-2 py-1 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              {!isTransferred && !isNew && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs text-blue-600 hover:text-blue-800"
                                  onClick={() => handleTransfer(idx)}
                                  disabled={isSubmitting}
                                >
                                  Transfer
                                </Button>
                              )}
                              {!isTransferred && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive"
                                  onClick={() => removeRow(idx)}
                                  disabled={isSubmitting}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-border bg-muted/30">
                      <td
                        colSpan={6}
                        className="px-3 py-2 text-right text-xs font-medium text-muted-foreground"
                      >
                        Total
                      </td>
                      <td className="px-3 py-2 font-semibold tabular-nums">
                        {total.toFixed(2)}
                      </td>
                      <td colSpan={2} />
                    </tr>
                  </tfoot>
                </table>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRow}
                // disabled={isSubmitting}
                disabled={isReadOnly} 
              >
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </Button>
            </div>

           <div className="grid grid-cols-3 gap-2 px-6 py-4 border-t border-border shrink-0">
  <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
    {isLocked ? "Close" : "Cancel"}
  </Button>

  {!isLocked && (
    <Button onClick={handleSave} disabled={isSubmitting}>
      {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Saving...</> : "Save Changes"}
    </Button>
  )}

  {isLocked ? (
    <Button
      type="button" variant="secondary" className="w-full col-start-3"
      disabled title="Payment Voucher already created for this inventory"
    >
      Payment Voucher Created
    </Button>
  ) : (
    <Link to="/dashboard/payment-create" state={paymentState}>
      <Button type="button" variant="secondary" className="w-full">
        <Wallet className="h-4 w-4 mr-1" /> Payment Voucher
      </Button>
    </Link>
  )}
</div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}