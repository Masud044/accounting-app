import { useState } from "react";
import { Check, ChevronsUpDown, Building2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// suppliers: full list (already loaded via useActiveSuppliers) — client-side search
export default function SupplierPicker({ suppliers = [], value, onSelect, disabled }) {
  const [open, setOpen] = useState(false);
  const selected = suppliers.find((s) => String(s.SUPPLIER_ID) === String(value));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="h-9 w-full justify-between font-normal bg-white border-gray-200"
        >
          <span className={cn("truncate text-left flex items-center gap-1.5", !selected && "text-muted-foreground")}>
            <Building2 className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            {selected ? selected.SUPPLIER_NAME : "Select supplier..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 z-110" align="start">
        <Command>
          <CommandInput placeholder="Search supplier name..." />
          <CommandList>
            <CommandEmpty>No supplier found.</CommandEmpty>
            <CommandGroup>
              {suppliers.map((s) => (
                <CommandItem
                  key={s.SUPPLIER_ID}
                  value={s.SUPPLIER_NAME}
                  onSelect={() => {
                    onSelect(String(s.SUPPLIER_ID));
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      String(value) === String(s.SUPPLIER_ID) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm">{s.SUPPLIER_NAME}</span>
                    {s.CONTACT_PERSON && (
                      <span className="text-xs text-muted-foreground">{s.CONTACT_PERSON}</span>
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