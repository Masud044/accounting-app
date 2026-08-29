import { Paperclip } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function AttachmentIndicator({ count }) {
  const n = Number(count) || 0;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`inline-flex items-center justify-center w-8 h-8 rounded-full border ${
              n > 0
                ? "text-indigo-600 bg-indigo-50 border-indigo-200"
                : "text-gray-300 bg-gray-50 border-gray-200"
            }`}
          >
            <Paperclip size={14} />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          {n > 0 ? `${n} attachment${n > 1 ? "s" : ""}` : "No attachments"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}