import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useSearchItems } from "./queries";

// value: current itemId (Number|String|null)
// displayName: text to show on the trigger button (usually the selected item's NAME)
// onSelect(item): fires with the full row from ITEM { ITEM_ID, NAME, DESCRIPTION, PRICE }
export default function ItemPicker({ value, displayName, onSelect, disabled }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { data: results = [], isFetching } = useSearchItems(query, open);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="h-8 w-full flex items-center justify-between text-sm bg-blue-50 dark:bg-blue-950/40 px-2 rounded-none border-0 focus-visible:ring-1 focus-visible:ring-blue-400 focus-visible:ring-offset-0"
        >
          <span className={cn("truncate text-left", !displayName && "text-muted-foreground")}>
            {displayName || "Select item..."}
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 opacity-50 shrink-0 ml-1" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-72 z-110" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search item name..." value={query} onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>{isFetching ? "Searching..." : "No items found."}</CommandEmpty>
            <CommandGroup>
              {results.map((item) => (
                <CommandItem
                  key={item.ITEM_ID}
                  value={String(item.ITEM_ID)}
                  onSelect={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      String(value) === String(item.ITEM_ID) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm">{item.NAME}</span>
                    {item.DESCRIPTION && (
                      <span className="text-xs text-muted-foreground">{item.DESCRIPTION}</span>
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