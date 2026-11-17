import * as React from "react";
import { X, Info } from "lucide-react";

const STORAGE_KEY_PREFIX = "page_legend_hidden:";

const readHidden = (key) => {
  try {
    return localStorage.getItem(STORAGE_KEY_PREFIX + key) === "1";
  } catch {
    return false;
  }
};

const writeHidden = (key, hidden) => {
  try {
    if (hidden) localStorage.setItem(STORAGE_KEY_PREFIX + key, "1");
    else localStorage.removeItem(STORAGE_KEY_PREFIX + key);
  } catch {
    // storage unavailable, ignore
  }
};

/**
 * Compact strip that explains the action icons used in the table.
 *
 * Props:
 *  - items:     guide.legend array (icon, label, hint, tone, permission?)
 *  - can:       map of permission key -> boolean. Items the user lacks are not shown.
 *  - storageKey: unique key per page so "hide" is remembered per page
 */
export function IconLegend({ items, can = {}, storageKey = "approval-voucher" }) {
  const [hidden, setHidden] = React.useState(() => readHidden(storageKey));

  const visibleItems = items.filter(
    (item) => !item.permission || can[item.permission]
  );

  const toggle = (next) => {
    setHidden(next);
    writeHidden(storageKey, next);
  };

  if (hidden) {
    return (
      <button
        type="button"
        onClick={() => toggle(false)}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700"
      >
        <Info size={13} />
        Show icon legend
      </button>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-md border border-gray-200 bg-gray-50/70 px-3 py-2.5">
      <ul className="flex flex-1 flex-wrap gap-x-5 gap-y-2">
        {visibleItems.map(({ key, icon: Icon, label, hint, tone }) => (
          <li key={key} className="flex items-center gap-2" title={hint}>
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${tone}`}
            >
              <Icon size={13} />
            </span>
            <span className="text-xs leading-tight text-gray-600">
              <span className="font-medium text-gray-800">{label}</span>
              <span className="hidden xl:inline"> – {hint}</span>
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => toggle(true)}
        className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        title="Hide legend"
        aria-label="Hide icon legend"
      >
        <X size={14} />
      </button>
    </div>
  );
}