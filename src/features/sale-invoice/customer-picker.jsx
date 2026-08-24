import { useState } from "react";
import { Check, ChevronsUpDown, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// customers: full list (already loaded via useCustomers) — client-side search
export default function CustomerPicker({ customers = [], value, onSelect, disabled }) {
  const [open, setOpen] = useState(false);
  const selected = customers.find((c) => String(c.CUSTOMER_ID) === String(value));

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
            <User className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            {selected ? selected.CUSTOMER_NAME : "Select customer..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 z-110" align="start">
        <Command>
          <CommandInput placeholder="Search customer name..." />
          <CommandList>
            <CommandEmpty>No customer found.</CommandEmpty>
            <CommandGroup>
              {customers.map((c) => (
                <CommandItem
                  key={c.CUSTOMER_ID}
                  value={c.CUSTOMER_NAME}
                  onSelect={() => {
                    onSelect(String(c.CUSTOMER_ID));
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      String(value) === String(c.CUSTOMER_ID) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="text-sm">{c.CUSTOMER_NAME}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}