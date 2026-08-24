// // // import { useEffect, useState } from "react";
// // // import { toast } from "sonner";
// // // import { format } from "date-fns";
// // // import { useQuery } from "@tanstack/react-query";
// // // import {
// // //   Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
// // // } from "@/components/ui/sheet";
// // // import { Button } from "@/components/ui/button";
// // // import { Input } from "@/components/ui/input";
// // // import { Label } from "@/components/ui/label";
// // // import {
// // //   Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
// // // } from "@/components/ui/select";
// // // import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// // // import {
// // //   Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
// // // } from "@/components/ui/command";
// // // import { cn } from "@/lib/utils";
// // // import { DatePicker } from "@/components/DatePicker";
// // // import { ArchiveIcon, Trash2, Plus, Check, ChevronsUpDown } from "lucide-react";
// // // import { Spinner } from "@/components/ui/spinner";
// // // import { useCreateInventory, useNextGrnNo, useNextPoNo } from "./queries";

// // // const BASE = import.meta.env.VITE_API_BASE_URL;

// // // const fetchJSON = async (url) => {
// // //   const res = await fetch(url);
// // //   if (!res.ok) {
// // //     const err = await res.json().catch(() => ({}));
// // //     throw new Error(err.message || `${res.status} ${res.statusText}`);
// // //   }
// // //   const json = await res.json();
// // //   return json.data ?? json;
// // // };

// // // // value: { id, name } | null, enabled: shudhu popover open thakle query chalabe
// // // const useItemSearch = (query, enabled) =>
// // //   useQuery({
// // //     queryKey: ["items", "search", query],
// // //     queryFn: () => fetchJSON(`${BASE}/api/item?q=${encodeURIComponent(query)}&limit=20`),
// // //     enabled,
// // //     staleTime: 60 * 1000,
// // //   });

// // // const useUoms = () =>
// // //   useQuery({ queryKey: ["uoms"], queryFn: () => fetchJSON(`${BASE}/api/inv-uom`), staleTime: 10 * 60 * 1000 });

// // // const useStores = () =>
// // //   useQuery({ queryKey: ["stores"], queryFn: () => fetchJSON(`${BASE}/api/stores`), staleTime: 5 * 60 * 1000 });

// // // let rowIdCounter = 0;
// // // const newRow = (overrides = {}) => ({
// // //   key: `row-${++rowIdCounter}`,
// // //   locked: false,       // true hole item change kora jabe na (PR theke ashle)
// // //   item: null,          // { id, name }
// // //   invQty: "",          // GRN Qty
// // //   receiveQty: "",      // Receive Qty
// // //   unitId: "",
// // //   unit: "",
// // //   unitPrice: "",
// // //   price: "",
// // //   ...overrides,
// // // });

// // // // ─── Item picker — table cell er jonno (Popover + Command, ItemPicker er moto) ──
// // // function ItemCellPicker({ value, onChange, disabled }) {
// // //   const [open, setOpen] = useState(false);
// // //   const [query, setQuery] = useState("");
// // //   const { data: results = [], isFetching } = useItemSearch(query, open);

// // //   return (
// // //     <Popover open={open} onOpenChange={setOpen}>
// // //       <PopoverTrigger asChild>
// // //         <button
// // //           type="button"
// // //           disabled={disabled}
// // //           className="h-8 w-full flex items-center justify-between text-sm bg-background px-2 rounded-md border border-input focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
// // //         >
// // //           <span className={cn("truncate text-left", !value?.name && "text-muted-foreground")}>
// // //             {value?.name || "Search item..."}
// // //           </span>
// // //           <ChevronsUpDown className="h-3.5 w-3.5 opacity-50 shrink-0 ml-1" />
// // //         </button>
// // //       </PopoverTrigger>
// // //       <PopoverContent className="p-0 w-72 z-[200]" align="start">
// // //         <Command shouldFilter={false}>
// // //           <CommandInput placeholder="Search item name..." value={query} onValueChange={setQuery} />
// // //           <CommandList>
// // //             <CommandEmpty>{isFetching ? "Searching..." : "No items found."}</CommandEmpty>
// // //             <CommandGroup>
// // //               {results.map((item) => (
// // //                 <CommandItem
// // //                   key={item.ITEM_ID}
// // //                   value={String(item.ITEM_ID)}
// // //                   onSelect={() => {
// // //                     onChange({ id: item.ITEM_ID, name: item.NAME });
// // //                     setOpen(false);
// // //                   }}
// // //                 >
// // //                   <Check
// // //                     className={cn(
// // //                       "mr-2 h-4 w-4",
// // //                       String(value?.id) === String(item.ITEM_ID) ? "opacity-100" : "opacity-0"
// // //                     )}
// // //                   />
// // //                   <div className="flex flex-col">
// // //                     <span className="text-sm">{item.NAME}</span>
// // //                     {item.DESCRIPTION && (
// // //                       <span className="text-xs text-muted-foreground">{item.DESCRIPTION}</span>
// // //                     )}
// // //                   </div>
// // //                 </CommandItem>
// // //               ))}
// // //             </CommandGroup>
// // //           </CommandList>
// // //         </Command>
// // //       </PopoverContent>
// // //     </Popover>
// // //   );
// // // }

// // // export default function AddInventorySheet({ open, onOpenChange, showConfirmation, initialData }) {
// // //   const createMutation = useCreateInventory();
// // //   const { data: stores = [], isLoading: storesLoading } = useStores();
// // //   const { data: uoms = [] } = useUoms();
// // //   const { data: grnData } = useNextGrnNo(open);
// // //   const { data: poData }  = useNextPoNo(open)

// // //   const [storeId, setStoreId] = useState("1");
// // //   const [invDate, setInvDate] = useState("");
// // //   const [poNo, setPoNo] = useState("");
// // //   const [grnNo, setGrnNo] = useState("");
// // //   const [rows, setRows] = useState([]);
// // //   const [dirty, setDirty] = useState(false);
// // //   const [submitting, setSubmitting] = useState(false);

// // //   useEffect(() => {
// // //     if (grnData?.grnNo) setGrnNo(grnData.grnNo);
// // //   }, [grnData]);

// // //   useEffect(() => {
// // //     if (poData?.poNo) setPoNo(poData.poNo);
// // //   }, [poData]);

// // //   useEffect(() => {
// // //     if (!open) return;
// // //     setStoreId("1");
// // //     setInvDate(initialData?.invtDate || format(new Date(), "yyyy-MM-dd"));
// // //     setPoNo(initialData?.poNumber || "");

// // //     const bulkItems = Array.isArray(initialData?.bulkItems) ? initialData.bulkItems : [];
// // //     if (bulkItems.length > 0) {
// // //       setRows(
// // //         bulkItems.map((it) =>
// // //           newRow({
// // //             locked: true,
// // //             item: { id: it.itemId, name: it.itemName },
// // //             invQty: it.qty ?? "",
// // //             receiveQty: it.receiveQty ?? it.qty ?? "",
// // //             unitPrice: it.price ?? "",
// // //             price: it.qty && it.price ? Number(it.qty) * Number(it.price) : "",
// // //           })
// // //         )
// // //       );
// // //     } else {
// // //       setRows([newRow()]);
// // //     }
// // //     setDirty(false);
// // //   }, [open, initialData]);

// // //   const updateRow = (idx, field, value) => {
// // //     setDirty(true);
// // //     setRows((prev) => {
// // //       const next = [...prev];
// // //       const row = { ...next[idx], [field]: value };
// // //       // ✅ qty/unitPrice change hole price auto-calc
// // //       if (field === "invQty" || field === "unitPrice") {
// // //         const q = Number(field === "invQty" ? value : row.invQty) || 0;
// // //         const up = Number(field === "unitPrice" ? value : row.unitPrice) || 0;
// // //         row.price = q && up ? (q * up).toFixed(2) : row.price;
// // //       }
// // //       if (field === "unitId") {
// // //         const selected = uoms.find((u) => String(u.ID) === String(value));
// // //         row.unit = selected?.NAME || "";
// // //       }
// // //       next[idx] = row;
// // //       return next;
// // //     });
// // //   };

// // //   const addRow = () => { setDirty(true); setRows((prev) => [...prev, newRow()]); };
// // //   const removeRow = (idx) => {
// // //     setDirty(true);
// // //     setRows((prev) => prev.filter((_, i) => i !== idx));
// // //   };

// // //   const handleSubmit = async () => {
// // //     if (!storeId) return toast.error("Store select korun.");
// // //     if (rows.length === 0) return toast.error("Kom pokkhe ekta item add korun.");
// // //     if (rows.some((r) => !r.item)) return toast.error("Shob row e item select korte hobe.");
// // //     if (rows.some((r) => !r.invQty || Number(r.invQty) <= 0)) return toast.error("Shob row e valid quantity din.");

// // //     setSubmitting(true);
// // //     try {
// // //       await createMutation.mutateAsync({
// // //         invDate: invDate || null,
// // //         storeId,
// // //         poNo: poNo || null,
// // //         grnNo: grnNo || null,
// // //         items: rows.map((r) => ({
// // //           item: r.item.id,
// // //           invQty: r.invQty ? Number(r.invQty) : null,
// // //           receiveQty: r.receiveQty !== "" ? Number(r.receiveQty) : null,
// // //           unit: r.unit || null,
// // //           unitPrice: r.unitPrice || null,
// // //           unitId: r.unitId ? Number(r.unitId) : null,
// // //           price: r.price ? Number(r.price) : null,
// // //           invStatus: 1,
// // //           invoiceStatus: 0,
// // //         })),
// // //       });
// // //       toast.success(`${rows.length} item(s) inventory-te add hoise! GRN: ${grnNo}`);
// // //       onOpenChange(false);
// // //     } catch (err) {
// // //       toast.error(err?.message || "Failed to create inventory.");
// // //     } finally {
// // //       setSubmitting(false);
// // //     }
// // //   };

// // //   const handleCancel = async () => {
// // //     if (dirty && showConfirmation) {
// // //       const confirmed = await showConfirmation({
// // //         title: "Discard changes?",
// // //         description: "Unsaved changes ache. Bad diye ber hote chan?",
// // //         confirmText: "Discard",
// // //         cancelText: "Keep Editing",
// // //         variant: "destructive",
// // //       });
// // //       if (!confirmed) return;
// // //     }
// // //     onOpenChange(false);
// // //   };

// // //   const total = rows.reduce((sum, r) => sum + (Number(r.price) || 0), 0);

// // //   return (
// // //     <Sheet open={open} onOpenChange={(o) => { if (!o) handleCancel(); }}>
// // //       <SheetContent className="sm:max-w-5xl w-full flex flex-col gap-0 p-0 z-105">
// // //         <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
// // //           <div className="flex items-center gap-3">
// // //             <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
// // //               <ArchiveIcon className="h-5 w-5 text-primary" />
// // //             </div>
// // //             <div>
// // //               <SheetTitle>Add Inventory</SheetTitle>
// // //               <SheetDescription>Ekta GRN e ekadhik item ekshathe add korun</SheetDescription>
// // //             </div>
// // //           </div>
// // //         </SheetHeader>

// // //         <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
// // //           {/* Header fields */}
// // //           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// // //             <div className="space-y-1.5">
// // //               <Label className="text-xs font-medium">Store <span className="text-destructive">*</span></Label>
// // //               <Select disabled={submitting || storesLoading} onValueChange={(v) => { setStoreId(v); setDirty(true); }} value={String(storeId ?? "")}>
// // //                 <SelectTrigger className="h-9"><SelectValue placeholder={storesLoading ? "Loading..." : "Select store"} /></SelectTrigger>
// // //                 <SelectContent className="z-110">
// // //                   {stores.map((s) => (<SelectItem key={s.STORE_ID} value={String(s.STORE_ID)}>{s.STORE_NAME}</SelectItem>))}
// // //                 </SelectContent>
// // //               </Select>
// // //             </div>
// // //             <div className="space-y-1.5">
// // //               <Label className="text-xs font-medium">Inv Date</Label>
// // //               <DatePicker className="w-full" disabled={submitting} value={invDate ? new Date(invDate) : new Date()}
// // //                 onChange={(d) => { setInvDate(d ? format(d, "yyyy-MM-dd") : ""); setDirty(true); }} />
// // //             </div>
// // //             <div className="space-y-1.5">
// // //               <Label className="text-xs font-medium">GRN No</Label>
// // //               <Input value={grnNo} disabled className="h-9 bg-muted/50" placeholder="Auto-generating..." />
// // //             </div>
// // //             <div className="space-y-1.5">
// // //               <Label className="text-xs font-medium">PO No</Label>
// // //               <Input value={poNo} disabled className="h-9 bg-muted/50" placeholder="Auto-generating..." />
// // //             </div>
// // //           </div>

// // //           {/* Items table */}
// // //           <div className="rounded-md border border-border overflow-visible">
// // //             <table className="w-full text-sm border-collapse">
// // //               <thead>
// // //                 <tr style={{ background: "#1a3c34" }}>
// // //                   {["#", "Item", "GRN Qty", "Receive Qty", "UOM", "Unit Price", "Total", ""].map((h) => (
// // //                     <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-white whitespace-nowrap">{h}</th>
// // //                   ))}
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {rows.map((row, idx) => (
// // //                   <tr key={row.key} className="border-t border-border">
// // //                     <td className="px-3 py-1 text-center text-muted-foreground w-8">{idx + 1}</td>
// // //                     <td className="px-1 py-1 min-w-[180px]">
// // //                       {row.locked ? (
// // //                         <div className="px-2 py-1.5 font-medium text-sm">{row.item?.name}</div>
// // //                       ) : (
// // //                         <ItemCellPicker value={row.item} onChange={(v) => updateRow(idx, "item", v)} disabled={submitting} />
// // //                       )}
// // //                     </td>
// // //                     <td className="px-1 py-1 w-24">
// // //                       <Input type="number" min="0" value={row.invQty} onChange={(e) => updateRow(idx, "invQty", e.target.value)} disabled={submitting} className="h-8 text-sm text-center" />
// // //                     </td>
// // //                     <td className="px-1 py-1 w-24">
// // //                       <Input type="number" min="0" value={row.receiveQty} onChange={(e) => updateRow(idx, "receiveQty", e.target.value)} disabled={submitting} className="h-8 text-sm text-center" />
// // //                     </td>
// // //                     <td className="px-1 py-1 w-28">
// // //                       <Select disabled={submitting} onValueChange={(v) => updateRow(idx, "unitId", v)} value={row.unitId ? String(row.unitId) : ""}>
// // //                         <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="UOM" /></SelectTrigger>
// // //                         <SelectContent className="z-110">
// // //                           {uoms.map((u) => (<SelectItem key={u.ID} value={String(u.ID)}>{u.NAME}</SelectItem>))}
// // //                         </SelectContent>
// // //                       </Select>
// // //                     </td>
// // //                     <td className="px-1 py-1 w-28">
// // //                       <Input type="number" min="0" step="0.01" value={row.unitPrice} onChange={(e) => updateRow(idx, "unitPrice", e.target.value)} disabled={submitting} className="h-8 text-sm text-center" />
// // //                     </td>
// // //                     <td className="px-1 py-1 w-28">
// // //                       <Input type="number" min="0" step="0.01" value={row.price} onChange={(e) => updateRow(idx, "price", e.target.value)} disabled={submitting} className="h-8 text-sm text-center font-medium" />
// // //                     </td>
// // //                     <td className="px-2 py-1 w-10">
// // //                       <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeRow(idx)} disabled={submitting || rows.length === 1}>
// // //                         <Trash2 className="h-3.5 w-3.5" />
// // //                       </Button>
// // //                     </td>
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //               <tfoot>
// // //                 <tr className="border-t border-border bg-muted/30">
// // //                   <td colSpan={6} className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Total</td>
// // //                   <td className="px-3 py-2 font-semibold tabular-nums">{total.toFixed(2)}</td>
// // //                   <td />
// // //                 </tr>
// // //               </tfoot>
// // //             </table>
// // //           </div>

// // //           <Button type="button" variant="outline" size="sm" onClick={addRow} disabled={submitting}>
// // //             <Plus className="h-4 w-4 mr-1" /> Add Item
// // //           </Button>
// // //         </div>

// // //         <div className="flex justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
// // //           <Button type="button" variant="outline" onClick={handleCancel} disabled={submitting}>Cancel</Button>
// // //           <Button onClick={handleSubmit} disabled={submitting || rows.length === 0}>
// // //             {submitting ? <><Spinner className="mr-2 h-4 w-4" />Creating...</> : `Create (${rows.length} item${rows.length !== 1 ? "s" : ""})`}
// // //           </Button>
// // //         </div>
// // //       </SheetContent>
// // //     </Sheet>
// // //   );
// // // }

// // import { useEffect, useState } from "react";
// // import { toast } from "sonner";
// // import { format } from "date-fns";
// // import { useQuery } from "@tanstack/react-query";
// // import {
// //   Sheet,
// //   SheetContent,
// //   SheetHeader,
// //   SheetTitle,
// //   SheetDescription,
// // } from "@/components/ui/sheet";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import {
// //   Popover,
// //   PopoverContent,
// //   PopoverTrigger,
// // } from "@/components/ui/popover";
// // import {
// //   Command,
// //   CommandEmpty,
// //   CommandGroup,
// //   CommandInput,
// //   CommandItem,
// //   CommandList,
// // } from "@/components/ui/command";
// // import { cn } from "@/lib/utils";
// // import { DatePicker } from "@/components/DatePicker";
// // import { ArchiveIcon, Trash2, Plus, Check, ChevronsUpDown } from "lucide-react";
// // import { Spinner } from "@/components/ui/spinner";
// // import { useCreateInventory, useNextGrnNo, useNextPoNo } from "./queries";

// // const BASE = import.meta.env.VITE_API_BASE_URL;

// // const fetchJSON = async (url) => {
// //   const res = await fetch(url);
// //   if (!res.ok) {
// //     const err = await res.json().catch(() => ({}));
// //     throw new Error(err.message || `${res.status} ${res.statusText}`);
// //   }
// //   const json = await res.json();
// //   return json.data ?? json;
// // };

// // // value: { id, name } | null, enabled: shudhu popover open thakle query chalabe
// // const useItemSearch = (query, enabled) =>
// //   useQuery({
// //     queryKey: ["items", "search", query],
// //     queryFn: () =>
// //       fetchJSON(`${BASE}/api/item?q=${encodeURIComponent(query)}&limit=20`),
// //     enabled,
// //     staleTime: 60 * 1000,
// //   });

// // const useUoms = () =>
// //   useQuery({
// //     queryKey: ["uoms"],
// //     queryFn: () => fetchJSON(`${BASE}/api/inv-uom`),
// //     staleTime: 10 * 60 * 1000,
// //   });

// // const useStores = () =>
// //   useQuery({
// //     queryKey: ["stores"],
// //     queryFn: () => fetchJSON(`${BASE}/api/stores`),
// //     staleTime: 5 * 60 * 1000,
// //   });

// // let rowIdCounter = 0;
// // const newRow = (overrides = {}) => ({
// //   key: `row-${++rowIdCounter}`,
// //   locked: false, // true hole item change kora jabe na (PR theke ashle)
// //   item: null, // { id, name }
// //   invQty: "", // GRN Qty
// //   receiveQty: "", // Receive Qty
// //   unitId: "",
// //   unit: "",
// //   unitPrice: "",
// //   price: "",
// //   ...overrides,
// // });

// // // ─── Item picker — table cell er jonno (Popover + Command, ItemPicker er moto) ──
// // function ItemCellPicker({ value, onChange, disabled }) {
// //   const [open, setOpen] = useState(false);
// //   const [query, setQuery] = useState("");
// //   const { data: results = [], isFetching } = useItemSearch(query, open);

// //   return (
// //     <Popover open={open} onOpenChange={setOpen}>
// //       <PopoverTrigger asChild>
// //         <button
// //           type="button"
// //           disabled={disabled}
// //           className="h-8 w-full flex items-center justify-between text-sm bg-background px-2 rounded-md border border-input focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
// //         >
// //           <span
// //             className={cn(
// //               "truncate text-left",
// //               !value?.name && "text-muted-foreground",
// //             )}
// //           >
// //             {value?.name || "Search item..."}
// //           </span>
// //           <ChevronsUpDown className="h-3.5 w-3.5 opacity-50 shrink-0 ml-1" />
// //         </button>
// //       </PopoverTrigger>
// //       <PopoverContent className="p-0 w-72 z-[200]" align="start">
// //         <Command shouldFilter={false}>
// //           <CommandInput
// //             placeholder="Search item name..."
// //             value={query}
// //             onValueChange={setQuery}
// //           />
// //           <CommandList>
// //             <CommandEmpty>
// //               {isFetching ? "Searching..." : "No items found."}
// //             </CommandEmpty>
// //             <CommandGroup>
// //               {results.map((item) => (
// //                 <CommandItem
// //                   key={item.ITEM_ID}
// //                   value={String(item.ITEM_ID)}
// //                   onSelect={() => {
// //                     onChange({ id: item.ITEM_ID, name: item.NAME });
// //                     setOpen(false);
// //                   }}
// //                 >
// //                   <Check
// //                     className={cn(
// //                       "mr-2 h-4 w-4",
// //                       String(value?.id) === String(item.ITEM_ID)
// //                         ? "opacity-100"
// //                         : "opacity-0",
// //                     )}
// //                   />
// //                   <div className="flex flex-col">
// //                     <span className="text-sm">{item.NAME}</span>
// //                     {item.DESCRIPTION && (
// //                       <span className="text-xs text-muted-foreground">
// //                         {item.DESCRIPTION}
// //                       </span>
// //                     )}
// //                   </div>
// //                 </CommandItem>
// //               ))}
// //             </CommandGroup>
// //           </CommandList>
// //         </Command>
// //       </PopoverContent>
// //     </Popover>
// //   );
// // }

// // export default function AddInventorySheet({
// //   open,
// //   onOpenChange,
// //   showConfirmation,
// //   initialData,
// // }) {
// //   const createMutation = useCreateInventory();
// //   const { data: stores = [], isLoading: storesLoading } = useStores();
// //   const { data: uoms = [] } = useUoms();
// //   const { data: grnData } = useNextGrnNo(open);
// //   const { data: poData } = useNextPoNo(open);

// //   const [storeId, setStoreId] = useState("1");
// //   const [invDate, setInvDate] = useState("");
// //   const [poNo, setPoNo] = useState("");
// //   const [grnNo, setGrnNo] = useState("");
// //   const [rows, setRows] = useState([]);
// //   const [dirty, setDirty] = useState(false);
// //   const [submitting, setSubmitting] = useState(false);

// //   useEffect(() => {
// //     if (grnData?.grnNo) setGrnNo(grnData.grnNo);
// //   }, [grnData]);

// //   useEffect(() => {
// //     if (poData?.poNo) setPoNo(poData.poNo);
// //   }, [poData]);

// //   useEffect(() => {
// //     if (!open) return;
// //     setStoreId("1");
// //     setInvDate(initialData?.invtDate || format(new Date(), "yyyy-MM-dd"));
// //     setPoNo(initialData?.poNumber || "");

// //     const bulkItems = Array.isArray(initialData?.bulkItems)
// //       ? initialData.bulkItems
// //       : [];
// //     if (bulkItems.length > 0) {
// //       setRows(
// //         bulkItems.map((it) =>
// //           newRow({
// //             locked: true,
// //             item: { id: it.itemId, name: it.itemName },
// //             invQty: it.qty ?? "",
// //             receiveQty: it.receiveQty ?? it.qty ?? "",
// //             unitId: it.unitId ?? "",
// //             unit: it.unit ?? "",
// //             unitPrice: it.price ?? "",
// //            price:
// //           it.receiveQty && it.price
// //             ? (Number(it.receiveQty) * Number(it.price)).toFixed(2)
// //             : "",
// //           }),
// //         ),
// //       );
// //     } else {
// //       setRows([newRow()]);
// //     }
// //     setDirty(false);
// //   }, [open, initialData]);

// //   const updateRow = (idx, field, value) => {
// //     setDirty(true);
// //     setRows((prev) => {
// //       const next = [...prev];
// //       const row = { ...next[idx], [field]: value };
// //       // ✅ price = receiveQty * unitPrice
// //       if (field === "receiveQty" || field === "unitPrice") {
// //         const rq = Number(field === "receiveQty" ? value : row.receiveQty) || 0;
// //         const up = Number(field === "unitPrice" ? value : row.unitPrice) || 0;
// //         row.price = rq && up ? (rq * up).toFixed(2) : "";
// //       }
// //       if (field === "unitId") {
// //         const selected = uoms.find((u) => String(u.ID) === String(value));
// //         row.unit = selected?.NAME || "";
// //       }
// //       next[idx] = row;
// //       return next;
// //     });
// //   };
// //   const addRow = () => {
// //     setDirty(true);
// //     setRows((prev) => [...prev, newRow()]);
// //   };
// //   const removeRow = (idx) => {
// //     setDirty(true);
// //     setRows((prev) => prev.filter((_, i) => i !== idx));
// //   };

// //   const handleSubmit = async () => {
// //     if (!storeId) return toast.error("Store select korun.");
// //     if (rows.length === 0)
// //       return toast.error("Kom pokkhe ekta item add korun.");
// //     if (rows.some((r) => !r.item))
// //       return toast.error("Shob row e item select korte hobe.");
// //     if (rows.some((r) => !r.invQty || Number(r.invQty) <= 0))
// //       return toast.error("Shob row e valid quantity din.");

// //     setSubmitting(true);
// //     try {
// //       await createMutation.mutateAsync({
// //         invDate: invDate || null,
// //         storeId,
// //         poNo: poNo || null,
// //         grnNo: grnNo || null,
// //         items: rows.map((r) => ({
// //           item: r.item.id,
// //           invQty: r.invQty ? Number(r.invQty) : null,
// //           receiveQty: r.receiveQty !== "" ? Number(r.receiveQty) : null,
// //           unit: r.unit || null,
// //           unitPrice: r.unitPrice || null,
// //           unitId: r.unitId ? Number(r.unitId) : null,
// //           price: r.price ? Number(r.price) : null,
// //           invStatus: 1,
// //           invoiceStatus: 0,
// //         })),
// //       });
// //       toast.success(
// //         `${rows.length} item(s) inventory-te add hoise! GRN: ${grnNo}`,
// //       );
// //       onOpenChange(false);
// //     } catch (err) {
// //       toast.error(err?.message || "Failed to create inventory.");
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   const handleCancel = async () => {
// //     if (dirty && showConfirmation) {
// //       const confirmed = await showConfirmation({
// //         title: "Discard changes?",
// //         description: "Unsaved changes.",
// //         confirmText: "Discard",
// //         cancelText: "Keep Editing",
// //         variant: "destructive",
// //       });
// //       if (!confirmed) return;
// //     }
// //     onOpenChange(false);
// //   };

// //   const total = rows.reduce((sum, r) => sum + (Number(r.price) || 0), 0);

// //   return (
// //     <Sheet
// //       open={open}
// //       onOpenChange={(o) => {
// //         if (!o) handleCancel();
// //       }}
// //     >
// //       <SheetContent className="sm:max-w-5xl w-full flex flex-col gap-0 p-0 z-105">
// //         <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
// //           <div className="flex items-center gap-3">
// //             <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
// //               <ArchiveIcon className="h-5 w-5 text-primary" />
// //             </div>
// //             <div>
// //               <SheetTitle>Add Inventory</SheetTitle>
// //               <SheetDescription>
// //                 Ekta GRN e ekadhik item ekshathe add korun
// //               </SheetDescription>
// //             </div>
// //           </div>
// //         </SheetHeader>

// //         <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
// //           {/* Header fields */}
// //           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// //             <div className="space-y-1.5">
// //               <Label className="text-xs font-medium">
// //                 Store <span className="text-destructive">*</span>
// //               </Label>
// //               <Select
// //                 disabled={submitting || storesLoading}
// //                 onValueChange={(v) => {
// //                   setStoreId(v);
// //                   setDirty(true);
// //                 }}
// //                 value={String(storeId ?? "")}
// //               >
// //                 <SelectTrigger className="h-9">
// //                   <SelectValue
// //                     placeholder={storesLoading ? "Loading..." : "Select store"}
// //                   />
// //                 </SelectTrigger>
// //                 <SelectContent className="z-110">
// //                   {stores.map((s) => (
// //                     <SelectItem key={s.STORE_ID} value={String(s.STORE_ID)}>
// //                       {s.STORE_NAME}
// //                     </SelectItem>
// //                   ))}
// //                 </SelectContent>
// //               </Select>
// //             </div>
// //             <div className="space-y-1.5">
// //               <Label className="text-xs font-medium">Inv Date</Label>
// //               <DatePicker
// //                 className="w-full"
// //                 disabled={submitting}
// //                 value={invDate ? new Date(invDate) : new Date()}
// //                 onChange={(d) => {
// //                   setInvDate(d ? format(d, "yyyy-MM-dd") : "");
// //                   setDirty(true);
// //                 }}
// //               />
// //             </div>
// //             <div className="space-y-1.5">
// //               <Label className="text-xs font-medium">GRN No</Label>
// //               <Input
// //                 value={grnNo}
// //                 disabled
// //                 className="h-9 bg-muted/50"
// //                 placeholder="Auto-generating..."
// //               />
// //             </div>
// //             <div className="space-y-1.5">
// //               <Label className="text-xs font-medium">PO No</Label>
// //               <Input
// //                 value={poNo}
// //                 disabled
// //                 className="h-9 bg-muted/50"
// //                 placeholder="Auto-generating..."
// //               />
// //             </div>
// //           </div>

// //           {/* Items table */}
// //           <div className="rounded-md border border-border overflow-visible">
// //             <table className="w-full text-sm border-collapse">
// //               <thead>
// //                 <tr style={{ background: "#1a3c34" }}>
// //                   {[
// //                     "#",
// //                     "Item",
// //                     "GRN Qty",
// //                     "Receive Qty",
// //                     "UOM",
// //                     "Unit Price",
// //                     "Total",
// //                     "",
// //                   ].map((h) => (
// //                     <th
// //                       key={h}
// //                       className="px-3 py-2 text-left text-xs font-semibold text-white whitespace-nowrap"
// //                     >
// //                       {h}
// //                     </th>
// //                   ))}
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {rows.map((row, idx) => (
// //                   <tr key={row.key} className="border-t border-border">
// //                     <td className="px-3 py-1 text-center text-muted-foreground w-8">
// //                       {idx + 1}
// //                     </td>
// //                     <td className="px-1 py-1 min-w-[180px]">
// //                       {row.locked ? (
// //                         <div className="px-2 py-1.5 font-medium text-sm">
// //                           {row.item?.name}
// //                         </div>
// //                       ) : (
// //                         <ItemCellPicker
// //                           value={row.item}
// //                           onChange={(v) => updateRow(idx, "item", v)}
// //                           disabled={submitting}
// //                         />
// //                       )}
// //                     </td>
// //                     <td className="px-1 py-1 w-24">
// //                       <Input
// //                         type="number"
// //                         min="0"
// //                         value={row.invQty}
// //                         onChange={(e) =>
// //                           updateRow(idx, "invQty", e.target.value)
// //                         }
// //                         disabled={
// //                           submitting ||
// //                           (row.invQty !== "" &&
// //                             Number(row.invQty) === Number(row.receiveQty))
// //                         }
// //                         className="h-8 text-sm text-center"
// //                       />
// //                     </td>
// //                     <td className="px-1 py-1 w-24">
// //                       <Input
// //                         type="number"
// //                         min="0"
// //                         value={row.receiveQty}
// //                         onChange={(e) =>
// //                           updateRow(idx, "receiveQty", e.target.value)
// //                         }
// //                         disabled={
// //                           submitting ||
// //                           (row.invQty !== "" &&
// //                             Number(row.invQty) === Number(row.receiveQty))
// //                         }
// //                         className="h-8 text-sm text-center"
// //                       />
// //                     </td>
// //                     <td className="px-1 py-1 w-28">
// //                       <Select
// //                         disabled={submitting}
// //                         onValueChange={(v) => updateRow(idx, "unitId", v)}
// //                         value={row.unitId ? String(row.unitId) : ""}
// //                       >
// //                         <SelectTrigger className="h-8 text-sm">
// //                           <SelectValue placeholder="UOM" />
// //                         </SelectTrigger>
// //                         <SelectContent className="z-110">
// //                           {uoms.map((u) => (
// //                             <SelectItem key={u.ID} value={String(u.ID)}>
// //                               {u.NAME}
// //                             </SelectItem>
// //                           ))}
// //                         </SelectContent>
// //                       </Select>
// //                     </td>
// //                     <td className="px-1 py-1 w-28">
// //                       <Input
// //                         type="number"
// //                         min="0"
// //                         step="0.01"
// //                         value={row.unitPrice}
// //                         onChange={(e) =>
// //                           updateRow(idx, "unitPrice", e.target.value)
// //                         }
// //                         disabled={submitting}
// //                         className="h-8 text-sm text-center"
// //                       />
// //                     </td>
// //                     <td className="px-1 py-1 w-28">
// //                       <Input
// //                         type="number"
// //                         min="0"
// //                         step="0.01"
// //                         value={row.price}
// //                         disabled
// //                         readOnly
// //                         className="h-8 text-sm text-center font-medium bg-muted/50"
// //                       />
// //                     </td>
// //                     <td className="px-2 py-1 w-10">
// //                       <Button
// //                         type="button"
// //                         variant="ghost"
// //                         size="icon"
// //                         className="h-7 w-7 text-destructive"
// //                         onClick={() => removeRow(idx)}
// //                         disabled={submitting || rows.length === 1}
// //                       >
// //                         <Trash2 className="h-3.5 w-3.5" />
// //                       </Button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //               <tfoot>
// //                 <tr className="border-t border-border bg-muted/30">
// //                   <td
// //                     colSpan={6}
// //                     className="px-3 py-2 text-right text-xs font-medium text-muted-foreground"
// //                   >
// //                     Total
// //                   </td>
// //                   <td className="px-3 py-2 font-semibold tabular-nums">
// //                     {total.toFixed(2)}
// //                   </td>
// //                   <td />
// //                 </tr>
// //               </tfoot>
// //             </table>
// //           </div>

// //           <Button
// //             type="button"
// //             variant="outline"
// //             size="sm"
// //             onClick={addRow}
// //             disabled={submitting}
// //           >
// //             <Plus className="h-4 w-4 mr-1" /> Add Item
// //           </Button>
// //         </div>

// //         <div className="flex justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
// //           <Button
// //             type="button"
// //             variant="outline"
// //             onClick={handleCancel}
// //             disabled={submitting}
// //           >
// //             Cancel
// //           </Button>
// //           <Button
// //             onClick={handleSubmit}
// //             disabled={submitting || rows.length === 0}
// //           >
// //             {submitting ? (
// //               <>
// //                 <Spinner className="mr-2 h-4 w-4" />
// //                 Creating...
// //               </>
// //             ) : (
// //               `Create (${rows.length} item${rows.length !== 1 ? "s" : ""})`
// //             )}
// //           </Button>
// //         </div>
// //       </SheetContent>
// //     </Sheet>
// //   );
// // }


// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { format } from "date-fns";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
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
// import {
//   useCreateInventory,
//   useNextGrnNo,
//   useNextPoNo,
//   useNextInvoiceNo,
//   useSuppliers,
// } from "./queries";
// import { useAuthUserId } from "@/hooks/use-auth-helper-id";
// import { usePeriodStatusForDate } from "@/features/ledger-period-calendar/queries";

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
//     queryKey: ["stores"],
//     queryFn: () => fetchJSON(`${BASE}/api/stores`),
//     staleTime: 5 * 60 * 1000,
//   });

// let rowIdCounter = 0;
// const newRow = (overrides = {}) => ({
//   key: `row-${++rowIdCounter}`,
//   locked: false, // true hole item change kora jabe na (PR theke ashle)
//   item: null, // { id, name }
//   invQty: "", // GRN Qty
//   receiveQty: "", // Receive Qty
//   unitId: "",
//   unit: "",
//   unitPrice: "",
//   price: "",
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

// export default function AddInventorySheet({
//   open,
//   onOpenChange,
//   showConfirmation,
//   initialData,
// }) {
//   const createMutation = useCreateInventory();
//   const { data: stores = [], isLoading: storesLoading } = useStores();
//   const { data: uoms = [] } = useUoms();
//   const { data: grnData } = useNextGrnNo(open);
//   const { data: poData } = useNextPoNo(open);
//   const { data: invoiceData } = useNextInvoiceNo(open);
//   const { data: suppliers = [] } = useSuppliers();
//   const userId = useAuthUserId();

//   // ✅ Purchase Recognition theke ashle, create success er por oi form-take lock kore dao
//   //    jate double inventory create na hoy
//   const lockRecognitionForm = async (purchaseFormId) => {
//     if (!purchaseFormId) return;
//     try {
//       await axios.put(`${BASE}/api/purchase-recognition/${purchaseFormId}/lock`);
//     } catch (err) {
//       console.error("Failed to lock recognition form:", err);
//     }
//   };

//   const [storeId, setStoreId] = useState("1");
//   const [invDate, setInvDate] = useState("");
//   const [poNo, setPoNo] = useState("");
//   const [grnNo, setGrnNo] = useState("");
//   const [invoiceNo, setInvoiceNo] = useState("");
//   const [supplierId, setSupplierId] = useState("");
//   const [rows, setRows] = useState([]);
//   const [dirty, setDirty] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   const { data: periodStatus } = usePeriodStatusForDate("INV", invDate);
// const isPeriodClosed = periodStatus?.STATUS === "CLOSED";
// const noPeriodDefined = !!invDate && periodStatus === null;

//   useEffect(() => {
//     if (grnData?.grnNo) setGrnNo(grnData.grnNo);
//   }, [grnData]);

//   useEffect(() => {
//     if (poData?.poNo) setPoNo(poData.poNo);
//   }, [poData]);

//   useEffect(() => {
//     if (invoiceData?.invoiceNumber) setInvoiceNo(invoiceData.invoiceNumber);
//   }, [invoiceData]);

//   useEffect(() => {
//     if (!open) return;
//     setStoreId("1");
//     setInvDate(initialData?.invtDate || format(new Date(), "yyyy-MM-dd"));
//     setPoNo(initialData?.poNumber || "");
//     setSupplierId(
//       initialData?.supplierId ? String(initialData.supplierId) : "",
//     );

//     const bulkItems = Array.isArray(initialData?.bulkItems)
//       ? initialData.bulkItems
//       : [];
//     if (bulkItems.length > 0) {
//       setRows(
//         bulkItems.map((it) =>
//           newRow({
//             locked: true,
//             item: { id: it.itemId, name: it.itemName },
//             invQty: it.qty ?? "",
//             receiveQty: it.receiveQty ?? it.qty ?? "",
//             unitId: it.unitId ?? "",
//             unit: it.unit ?? "",
//             unitPrice: it.price ?? "",
//             // ✅ receiveQty * unitPrice diye price calc hoy
//             price:
//               it.receiveQty && it.price
//                 ? (Number(it.receiveQty) * Number(it.price)).toFixed(2)
//                 : "",
//           }),
//         ),
//       );
//     } else {
//       setRows([newRow()]);
//     }
//     setDirty(false);
//   }, [open, initialData]);

//   const updateRow = (idx, field, value) => {
//     setDirty(true);
//     setRows((prev) => {
//       const next = [...prev];
//       const row = { ...next[idx], [field]: value };
//       // ✅ price = receiveQty * unitPrice (invQty na)
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
//   const removeRow = (idx) => {
//     setDirty(true);
//     setRows((prev) => prev.filter((_, i) => i !== idx));
//   };

//   const handleSubmit = async () => {
//     if (!storeId) return toast.error("Store select korun.");
//     if (rows.length === 0)
//       return toast.error("Kom pokkhe ekta item add korun.");
//     if (rows.some((r) => !r.item))
//       return toast.error("Shob row e item select korte hobe.");
//     if (rows.some((r) => !r.invQty || Number(r.invQty) <= 0))
//       return toast.error("Shob row e valid quantity din.");

//     setSubmitting(true);
//     try {
//       await createMutation.mutateAsync({
//         invDate: invDate || null,
//         storeId,
//         poNo: poNo || null,
//         grnNo: grnNo || null,
//         invoiceNumber: invoiceNo || null,
//         supplierId: supplierId ? Number(supplierId) : null,
//         creationBy: userId,
//         items: rows.map((r) => ({
//           item: r.item.id,
//           invQty: r.invQty ? Number(r.invQty) : null,
//           receiveQty: r.receiveQty !== "" ? Number(r.receiveQty) : null,
//           unit: r.unit || null,
//           unitPrice: r.unitPrice || null,
//           unitId: r.unitId ? Number(r.unitId) : null,
//           price: r.price ? Number(r.price) : null,
//           invStatus: 1,
//           invoiceStatus: 0,
//         })),
//       });

//       // ✅ Purchase Recognition theke ashle, oi form-take lock kore dao
//       //    jate ei "Inventory" button abar click kore double GRN create na hoy
//       await lockRecognitionForm(initialData?.purchaseFormId);

//       toast.success(
//         `${rows.length} item(s) inventory-te add hoise! GRN: ${grnNo}`,
//       );
//       onOpenChange(false);
//     } catch (err) {
//       toast.error(err?.message || "Failed to create inventory.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleCancel = async () => {
//     if (dirty && showConfirmation) {
//       const confirmed = await showConfirmation({
//         title: "Discard changes?",
//         description: "Unsaved changes.",
//         confirmText: "Discard",
//         cancelText: "Keep Editing",
//         variant: "destructive",
//       });
//       if (!confirmed) return;
//     }
//     onOpenChange(false);
//   };

//   const total = rows.reduce((sum, r) => sum + (Number(r.price) || 0), 0);

//   return (
//     <Sheet
//       open={open}
//       onOpenChange={(o) => {
//         if (!o) handleCancel();
//       }}
//     >
//       <SheetContent className="sm:max-w-5xl w-full flex flex-col gap-0 p-0 z-105">
//         <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
//           <div className="flex items-center gap-3">
//             <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
//               <ArchiveIcon className="h-5 w-5 text-primary" />
//             </div>
//             <div>
//               <SheetTitle>Add Inventory</SheetTitle>
//               <SheetDescription>
//                 Ekta GRN e ekadhik item ekshathe add korun
//               </SheetDescription>
//             </div>
//           </div>
//         </SheetHeader>

//         <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
//           {/* Header fields */}
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//             <div className="space-y-1.5">
//               <Label className="text-xs font-medium">
//                 Store <span className="text-destructive">*</span>
//               </Label>
//               <Select
//                 disabled={submitting || storesLoading}
//                 onValueChange={(v) => {
//                   setStoreId(v);
//                   setDirty(true);
//                 }}
//                 value={String(storeId ?? "")}
//               >
//                 <SelectTrigger className="h-9">
//                   <SelectValue
//                     placeholder={storesLoading ? "Loading..." : "Select store"}
//                   />
//                 </SelectTrigger>
//                 <SelectContent className="z-110">
//                   {stores.map((s) => (
//                     <SelectItem key={s.STORE_ID} value={String(s.STORE_ID)}>
//                       {s.STORE_NAME}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//            <div className="space-y-1.5">
//   <Label className="text-xs font-medium">Inv Date</Label>
//   <DatePicker
//     className={cn("w-full", isPeriodClosed && "border-red-400")}
//     disabled={submitting}
//     value={invDate ? new Date(invDate) : new Date()}
//     onChange={(d) => {
//       setInvDate(d ? format(d, "yyyy-MM-dd") : "");
//       setDirty(true);
//     }}
//   />
//   {isPeriodClosed && (
//     <p className="text-xs text-red-500">
//       ⚠ Period "{periodStatus.PERIOD_NAME}" is closed for INV postings.
//     </p>
//   )}
//   {noPeriodDefined && (
//     <p className="text-xs text-amber-500">
//       ⚠ No ledger period found for this date.
//     </p>
//   )}
// </div>
//             <div className="space-y-1.5">
//               <Label className="text-xs font-medium">GRN No</Label>
//               <Input
//                 value={grnNo}
//                 disabled
//                 className="h-9 bg-muted/50"
//                 placeholder="Auto-generating..."
//               />
//             </div>
//             <div className="space-y-1.5">
//               <Label className="text-xs font-medium">PO No</Label>
//               <Input
//                 value={poNo}
//                 disabled
//                 className="h-9 bg-muted/50"
//                 placeholder="Auto-generating..."
//               />
//             </div>
//             <div className="space-y-1.5">
//               <Label className="text-xs font-medium">Invoice No</Label>
//               <Input
//                 value={invoiceNo}
//                 disabled
//                 className="h-9 bg-muted/50"
//                 placeholder="Auto-generating..."
//               />
//             </div>
//             <div className="space-y-1.5">
//               <Label className="text-xs font-medium">Supplier</Label>
//               <Select
//                 disabled={submitting}
//                 onValueChange={(v) => {
//                   setSupplierId(v);
//                   setDirty(true);
//                 }}
//                 value={supplierId}
//               >
//                 <SelectTrigger className="h-9">
//                   <SelectValue placeholder="Select supplier" />
//                 </SelectTrigger>
//                 <SelectContent className="z-110">
//                   {suppliers.map((s) => (
//                     <SelectItem
//                       key={s.SUPPLIER_ID}
//                       value={String(s.SUPPLIER_ID)}
//                     >
//                       {s.SUPPLIER_NAME}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Items table */}
//           <div className="rounded-md border border-border overflow-visible">
//             <table className="w-full text-sm border-collapse">
//               <thead>
//                 <tr style={{ background: "#1a3c34" }}>
//                   {[
//                     "#",
//                     "Item",
//                     "GRN Qty",
//                     "Receive Qty",
//                     "UOM",
//                     "Unit Price",
//                     "Total",
//                     "",
//                   ].map((h) => (
//                     <th
//                       key={h}
//                       className="px-3 py-2 text-left text-xs font-semibold text-white whitespace-nowrap"
//                     >
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {rows.map((row, idx) => (
//                   <tr key={row.key} className="border-t border-border">
//                     <td className="px-3 py-1 text-center text-muted-foreground w-8">
//                       {idx + 1}
//                     </td>
//                     <td className="px-1 py-1 min-w-[180px]">
//                       {row.locked ? (
//                         <div className="px-2 py-1.5 font-medium text-sm">
//                           {row.item?.name}
//                         </div>
//                       ) : (
//                         <ItemCellPicker
//                           value={row.item}
//                           onChange={(v) => updateRow(idx, "item", v)}
//                           disabled={submitting}
//                         />
//                       )}
//                     </td>
//                     <td className="px-1 py-1 w-24">
//                       <Input
//                         type="number"
//                         min="0"
//                         value={row.invQty}
//                         onChange={(e) =>
//                           updateRow(idx, "invQty", e.target.value)
//                         }
//                         disabled={
//                           submitting ||
//                           (row.invQty !== "" &&
//                             Number(row.invQty) === Number(row.receiveQty))
//                         }
//                         className="h-8 text-sm text-center"
//                       />
//                     </td>
//                     <td className="px-1 py-1 w-24">
//                       <Input
//                         type="number"
//                         min="0"
//                         value={row.receiveQty}
//                         onChange={(e) =>
//                           updateRow(idx, "receiveQty", e.target.value)
//                         }
//                         disabled={
//                           submitting ||
//                           (row.invQty !== "" &&
//                             Number(row.invQty) === Number(row.receiveQty))
//                         }
//                         className="h-8 text-sm text-center"
//                       />
//                     </td>
//                     <td className="px-1 py-1 w-28">
//                       <Select
//                         disabled={submitting}
//                         onValueChange={(v) => updateRow(idx, "unitId", v)}
//                         value={row.unitId ? String(row.unitId) : ""}
//                       >
//                         <SelectTrigger className="h-8 text-sm">
//                           <SelectValue placeholder="UOM" />
//                         </SelectTrigger>
//                         <SelectContent className="z-110">
//                           {uoms.map((u) => (
//                             <SelectItem key={u.ID} value={String(u.ID)}>
//                               {u.NAME}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </td>
//                     <td className="px-1 py-1 w-28">
//                       <Input
//                         type="number"
//                         min="0"
//                         step="0.01"
//                         value={row.unitPrice}
//                         onChange={(e) =>
//                           updateRow(idx, "unitPrice", e.target.value)
//                         }
//                         disabled={submitting}
//                         className="h-8 text-sm text-center"
//                       />
//                     </td>
//                     <td className="px-1 py-1 w-28">
//                       <Input
//                         type="number"
//                         min="0"
//                         step="0.01"
//                         value={row.price}
//                         disabled
//                         readOnly
//                         className="h-8 text-sm text-center font-medium bg-muted/50"
//                       />
//                     </td>
//                     <td className="px-2 py-1 w-10">
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         className="h-7 w-7 text-destructive"
//                         onClick={() => removeRow(idx)}
//                         disabled={submitting || rows.length === 1}
//                       >
//                         <Trash2 className="h-3.5 w-3.5" />
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//               <tfoot>
//                 <tr className="border-t border-border bg-muted/30">
//                   <td
//                     colSpan={6}
//                     className="px-3 py-2 text-right text-xs font-medium text-muted-foreground"
//                   >
//                     Total
//                   </td>
//                   <td className="px-3 py-2 font-semibold tabular-nums">
//                     {total.toFixed(2)}
//                   </td>
//                   <td />
//                 </tr>
//               </tfoot>
//             </table>
//           </div>

//           <Button
//             type="button"
//             variant="outline"
//             size="sm"
//             onClick={addRow}
//             disabled={submitting}
//           >
//             <Plus className="h-4 w-4 mr-1" /> Add Item
//           </Button>
//         </div>

//         <div className="flex justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={handleCancel}
//             disabled={submitting}
//           >
//             Cancel
//           </Button>
//          <Button
//   onClick={handleSubmit}
//   disabled={submitting || rows.length === 0 || isPeriodClosed || noPeriodDefined}
// >
//   {submitting ? (
//     <><Spinner className="mr-2 h-4 w-4" />Creating...</>
//   ) : (
//     `Create (${rows.length} item${rows.length !== 1 ? "s" : ""})`
//   )}
// </Button>
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  ArrowLeft,
  AlertTriangle,
  ListChecks,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import {
  useCreateInventory,
  useNextGrnNo,
  useNextPoNo,
  useNextInvoiceNo,
  useSuppliers,
} from "./queries";
import { useAuthUserId } from "@/hooks/use-auth-helper-id";
import { usePeriodStatusForDate } from "@/features/ledger-period-calendar/queries";

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
    queryKey: ["stores"],
    queryFn: () => fetchJSON(`${BASE}/api/stores`),
    staleTime: 5 * 60 * 1000,
  });

let rowIdCounter = 0;
const newRow = (overrides = {}) => ({
  key: `row-${++rowIdCounter}`,
  locked: false,
  item: null,
  invQty: "",
  receiveQty: "",
  unitId: "",
  unit: "",
  unitPrice: "",
  price: "",
  ...overrides,
});

/* ── Shared design tokens (visual only — matches PaymentCreate/PaymentEdit) ── */
const card =
  "bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04)]";
const sectionHeader =
  "flex items-center gap-3 px-6 py-4 border-b border-slate-100";
const sectionIconWrap =
  "flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 shrink-0";
const sectionTitle = "text-[15px] font-semibold text-slate-800 leading-none";
const sectionSubtitle = "text-xs text-slate-400 mt-1";
const fieldLabel =
  "block text-[11px] font-semibold tracking-wider uppercase text-slate-500 mb-1.5";
const fieldInputCls =
  "h-9 border-slate-200 bg-slate-50 hover:border-slate-300 focus-visible:ring-4 focus-visible:ring-indigo-500/10 focus-visible:border-indigo-400 focus-visible:bg-white disabled:bg-slate-100 transition-all";

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
          className="h-8 w-full flex items-center justify-between text-sm bg-white px-2 rounded-md border border-slate-200 hover:border-slate-300 focus-visible:ring-4 focus-visible:ring-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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

export default function CreateInventoryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  // When navigated here from Purchase Recognition's "Create Inventory"
  // button, the bulk items / PO info arrive via router state — the same
  // data the sheet used to receive as an `initialData` prop.
  const initialData = location.state ?? null;

  const createMutation = useCreateInventory();
  const { data: stores = [], isLoading: storesLoading } = useStores();
  const { data: uoms = [] } = useUoms();
  const { data: grnData } = useNextGrnNo(true);
  const { data: poData } = useNextPoNo(true);
  const { data: invoiceData } = useNextInvoiceNo(true);
  const { data: suppliers = [] } = useSuppliers();
  const userId = useAuthUserId();

  const lockRecognitionForm = async (purchaseFormId) => {
    if (!purchaseFormId) return;
    try {
      await axios.put(`${BASE}/api/purchase-recognition/${purchaseFormId}/lock`);
    } catch (err) {
      console.error("Failed to lock recognition form:", err);
    }
  };

  const [storeId, setStoreId] = useState("1");
  const [invDate, setInvDate] = useState("");
  const [poNo, setPoNo] = useState("");
  const [grnNo, setGrnNo] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [rows, setRows] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { data: periodStatus } = usePeriodStatusForDate("INV", invDate);
  const isPeriodClosed = periodStatus?.STATUS === "CLOSED";
  const noPeriodDefined = !!invDate && periodStatus === null;

  useEffect(() => {
    if (grnData?.grnNo) setGrnNo(grnData.grnNo);
  }, [grnData]);

  useEffect(() => {
    if (poData?.poNo) setPoNo(poData.poNo);
  }, [poData]);

  useEffect(() => {
    if (invoiceData?.invoiceNumber) setInvoiceNo(invoiceData.invoiceNumber);
  }, [invoiceData]);

  useEffect(() => {
    setStoreId("1");
    setInvDate(initialData?.invtDate || format(new Date(), "yyyy-MM-dd"));
    setPoNo(initialData?.poNumber || "");
    setSupplierId(initialData?.supplierId ? String(initialData.supplierId) : "");

    const bulkItems = Array.isArray(initialData?.bulkItems) ? initialData.bulkItems : [];
    if (bulkItems.length > 0) {
      setRows(
        bulkItems.map((it) =>
          newRow({
            locked: true,
            item: { id: it.itemId, name: it.itemName },
            invQty: it.qty ?? "",
            receiveQty: it.receiveQty ?? it.qty ?? "",
            unitId: it.unitId ?? "",
            unit: it.unit ?? "",
            unitPrice: it.price ?? "",
            price:
              it.receiveQty && it.price
                ? (Number(it.receiveQty) * Number(it.price)).toFixed(2)
                : "",
          }),
        ),
      );
    } else {
      setRows([newRow()]);
    }
    setDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateRow = (idx, field, value) => {
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
    setDirty(true);
    setRows((prev) => [...prev, newRow()]);
  };
  const removeRow = (idx) => {
    setDirty(true);
    setRows((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!storeId) return toast.error("Store select korun.");
    if (rows.length === 0) return toast.error("Kom pokkhe ekta item add korun.");
    if (rows.some((r) => !r.item)) return toast.error("Shob row e item select korte hobe.");
    if (rows.some((r) => !r.invQty || Number(r.invQty) <= 0))
      return toast.error("Shob row e valid quantity din.");

    setSubmitting(true);
    try {
      await createMutation.mutateAsync({
        invDate: invDate || null,
        storeId,
        poNo: poNo || null,
        grnNo: grnNo || null,
        invoiceNumber: invoiceNo || null,
        supplierId: supplierId ? Number(supplierId) : null,
        creationBy: userId,
        items: rows.map((r) => ({
          item: r.item.id,
          invQty: r.invQty ? Number(r.invQty) : null,
          receiveQty: r.receiveQty !== "" ? Number(r.receiveQty) : null,
          unit: r.unit || null,
          unitPrice: r.unitPrice || null,
          unitId: r.unitId ? Number(r.unitId) : null,
          price: r.price ? Number(r.price) : null,
          invStatus: 1,
          invoiceStatus: 0,
        })),
      });

      await lockRecognitionForm(initialData?.purchaseFormId);

      toast.success(`${rows.length} item(s) inventory-te add hoise! GRN: ${grnNo}`);
      navigate("/dashboard/inventory");
    } catch (err) {
      toast.error(err?.message || "Failed to create inventory.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (dirty) {
      const confirmed = await showConfirmation({
        title: "Discard changes?",
        description: "Unsaved changes ache. Bad diye ber hote chan?",
        confirmText: "Discard",
        cancelText: "Keep Editing",
        variant: "destructive",
      });
      if (!confirmed) return;
    }
    navigate("/dashboard/inventory");
  };

  const total = rows.reduce((sum, r) => sum + (Number(r.price) || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-indigo-50 hover:text-indigo-700"
            onClick={handleCancel}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Inventory
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Add Inventory</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Ekta GRN e ekadhik item ekshathe add korun
            </p>
          </div>
        </div>
      </div>

      {/* ── Section: GRN Details ─────────────────────────────────────────── */}
      <div className={card}>
        <div className={sectionHeader}>
          <div className={sectionIconWrap}>
            <ArchiveIcon size={16} />
          </div>
          <div>
            <h3 className={sectionTitle}>GRN Details</h3>
            <p className={sectionSubtitle}>Store, dates and reference numbers</p>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className={fieldLabel}>
              Store <span className="text-red-500">*</span>
            </label>
            <Select
              disabled={submitting || storesLoading}
              onValueChange={(v) => {
                setStoreId(v);
                setDirty(true);
              }}
              value={String(storeId ?? "")}
            >
              <SelectTrigger className={fieldInputCls}>
                <SelectValue placeholder={storesLoading ? "Loading..." : "Select store"} />
              </SelectTrigger>
              <SelectContent>
                {stores.map((s) => (
                  <SelectItem key={s.STORE_ID} value={String(s.STORE_ID)}>
                    {s.STORE_NAME}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className={fieldLabel}>Inv Date</label>
            <DatePicker
              className={cn("w-full h-9", isPeriodClosed && "border-red-400")}
              disabled={submitting}
              value={invDate ? new Date(invDate) : new Date()}
              onChange={(d) => {
                setInvDate(d ? format(d, "yyyy-MM-dd") : "");
                setDirty(true);
              }}
            />
            {isPeriodClosed && (
              <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                Period "{periodStatus.PERIOD_NAME}" is closed for INV postings.
              </p>
            )}
            {noPeriodDefined && (
              <p className="flex items-center gap-1 text-xs text-amber-500 mt-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                No ledger period found for this date.
              </p>
            )}
          </div>

          <div>
            <label className={fieldLabel}>GRN No</label>
            <Input
              value={grnNo}
              disabled
              className={fieldInputCls}
              placeholder="Auto-generating..."
            />
          </div>

          <div>
            <label className={fieldLabel}>PO No</label>
            <Input
              value={poNo}
              disabled
              className={fieldInputCls}
              placeholder="Auto-generating..."
            />
          </div>

          <div>
            <label className={fieldLabel}>Invoice No</label>
            <Input
              value={invoiceNo}
              disabled
              className={fieldInputCls}
              placeholder="Auto-generating..."
            />
          </div>

          <div>
            <label className={fieldLabel}>Supplier</label>
            <Select
              disabled={submitting}
              onValueChange={(v) => {
                setSupplierId(v);
                setDirty(true);
              }}
              value={supplierId}
            >
              <SelectTrigger className={fieldInputCls}>
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((s) => (
                  <SelectItem key={s.SUPPLIER_ID} value={String(s.SUPPLIER_ID)}>
                    {s.SUPPLIER_NAME}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ── Section: Items ────────────────────────────────────────────────── */}
      <div className={card}>
        <div className={cn(sectionHeader, "justify-between")}>
          <div className="flex items-center gap-3">
            <div className={sectionIconWrap}>
              <ListChecks size={16} />
            </div>
            <div>
              <h3 className={sectionTitle}>Items</h3>
              <p className={sectionSubtitle}>{rows.length} line item{rows.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRow}
            disabled={submitting}
            className="border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </Button>
        </div>

        <div className="px-6 pb-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50">
                {["#", "Item", "GRN Qty", "Receive Qty", "UOM", "Unit Price", "Total", ""].map(
                  (h, i) => (
                    <th
                      key={h || `col-${i}`}
                      className="px-3 py-2.5 text-left font-semibold text-[11px] uppercase tracking-wider text-slate-500 border-y border-slate-200 first:rounded-l-lg last:rounded-r-lg whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.key} className="border-b border-slate-100 hover:bg-indigo-50/20 transition-colors">
                  <td className="px-3 py-2 text-center text-slate-400 w-8">{idx + 1}</td>
                  <td className="px-1 py-2 min-w-[180px]">
                    {row.locked ? (
                      <div className="px-2 py-1.5 font-medium text-sm text-slate-700">
                        {row.item?.name}
                      </div>
                    ) : (
                      <ItemCellPicker
                        value={row.item}
                        onChange={(v) => updateRow(idx, "item", v)}
                        disabled={submitting}
                      />
                    )}
                  </td>
                  <td className="px-1 py-2 w-24">
                    <Input
                      type="number"
                      min="0"
                      value={row.invQty}
                      onChange={(e) => updateRow(idx, "invQty", e.target.value)}
                      disabled={
                        submitting ||
                        (row.invQty !== "" && Number(row.invQty) === Number(row.receiveQty))
                      }
                      className={cn(fieldInputCls, "h-8 text-center")}
                    />
                  </td>
                  <td className="px-1 py-2 w-24">
                    <Input
                      type="number"
                      min="0"
                      value={row.receiveQty}
                      onChange={(e) => updateRow(idx, "receiveQty", e.target.value)}
                      disabled={
                        submitting ||
                        (row.invQty !== "" && Number(row.invQty) === Number(row.receiveQty))
                      }
                      className={cn(fieldInputCls, "h-8 text-center")}
                    />
                  </td>
                  <td className="px-1 py-2 w-28">
                    <Select
                      disabled={submitting}
                      onValueChange={(v) => updateRow(idx, "unitId", v)}
                      value={row.unitId ? String(row.unitId) : ""}
                    >
                      <SelectTrigger className={cn(fieldInputCls, "h-8")}>
                        <SelectValue placeholder="UOM" />
                      </SelectTrigger>
                      <SelectContent>
                        {uoms.map((u) => (
                          <SelectItem key={u.ID} value={String(u.ID)}>
                            {u.NAME}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-1 py-2 w-28">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={row.unitPrice}
                      onChange={(e) => updateRow(idx, "unitPrice", e.target.value)}
                      disabled={submitting}
                      className={cn(fieldInputCls, "h-8 text-center")}
                    />
                  </td>
                  <td className="px-1 py-2 w-28">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={row.price}
                      disabled
                      readOnly
                      className={cn(fieldInputCls, "h-8 text-center font-medium")}
                    />
                  </td>
                  <td className="px-2 py-2 w-10">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => removeRow(idx)}
                      disabled={submitting || rows.length === 1}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold bg-slate-50">
                <td colSpan={6} className="px-3 py-2.5 text-right text-sm text-slate-800">
                  Total
                </td>
                <td className="px-3 py-2.5 text-slate-900 tabular-nums">{total.toFixed(2)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Fixed footer action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 w-full px-6 py-3.5 bg-white/95 backdrop-blur border-t border-slate-200 flex items-center justify-between shadow-[0_-4px_16px_rgba(15,23,42,0.06)]">
        <span className="text-xs text-slate-400 font-medium">GRN · auto-generated</span>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-slate-200 text-slate-700 hover:bg-slate-50"
            onClick={handleCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || rows.length === 0 || isPeriodClosed || noPeriodDefined}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
          >
            {submitting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Creating...
              </>
            ) : (
              `Create (${rows.length} item${rows.length !== 1 ? "s" : ""})`
            )}
          </Button>
        </div>
      </div>

      <ConfirmationDialog />
    </div>
  );
}