import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Send, Wallet, Package, ClipboardCheck, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";


import {
  useNotifications,
  useUnreadCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "./queries";
import { useAuthUserId } from "@/hooks/use-auth-helper-id";

// ── REF_TABLE -> route map (click korle kothay navigate korbe) ──────────────
const NAV_MAP = {
  // PURCHASE_RECOGNITION: (id) => `/dashboard/purchase-recognition/edit/${id}`,
  PURCHASE_RECOGNITION: () => "/dashboard/approval-dashboard",
  PAYMENT: (id) => `/dashboard/payment-view/${id}`,
  INVENTORY_H: (id) => `/dashboard/inventory/${id}`,
  GRN: (id) => `/dashboard/grn/${id}`,
};

// ── TYPE -> icon map ─────────────────────────────────────────────────────────
const TYPE_ICON = {
  APPROVAL_REQUEST: Send,
  APPROVAL_APPROVED: ClipboardCheck,
  APPROVAL_REJECTED: Info,
  PAYMENT_CREATED: Wallet,
  INVENTORY_CREATED: Package,
  GRN_APPROVED: ClipboardCheck,
};

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diffMs = Date.now() - new Date(dateStr.replace(" ", "T")).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

export default function NotificationBell() {
  const navigate = useNavigate();
  const userId = useAuthUserId();
  console.log(userId)
  const [open, setOpen] = useState(false);

  const { data: notifications = [], isLoading } = useNotifications(userId);
  const { data: unreadCount = 0 } = useUnreadCount(userId);

  const markReadMutation = useMarkNotificationRead(userId);
  const markAllReadMutation = useMarkAllNotificationsRead(userId);

  const handleItemClick = (n) => {
    if (n.IS_READ !== "Y") markReadMutation.mutate(n.NOTIFICATION_ID);

    const buildPath = NAV_MAP[n.REF_TABLE];
    if (buildPath && n.REF_ID) {
      setOpen(false);
      navigate(buildPath(n.REF_ID));
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-9 w-9 rounded-full">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-800">Notifications</span>
          {unreadCount > 0 && (
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-50"
              disabled={markAllReadMutation.isPending}
              onClick={() => markAllReadMutation.mutate()}
            >
              <CheckCheck className="h-3 w-3" /> Mark all read
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-8 text-sm text-gray-400">
              <Spinner className="h-4 w-4 mr-2" /> Loading...
            </div>
          )}

          {!isLoading && notifications.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-400">No notifications yet.</div>
          )}

          {!isLoading &&
            notifications.map((n) => {
              const Icon = TYPE_ICON[n.TYPE] || Bell;
              const unread = n.IS_READ !== "Y";
              return (
                <button
                  key={n.NOTIFICATION_ID}
                  type="button"
                  onClick={() => handleItemClick(n)}
                  className={`w-full text-left px-3 py-3 flex gap-2.5 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    unread ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${unread ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                      {n.TITLE}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">{n.MESSAGE}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{timeAgo(n.CREATED_AT)}</p>
                  </div>
                  {unread && <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                </button>
              );
            })}
        </div>
      </PopoverContent>
    </Popover>
  );
}