import { useEffect, useMemo, useRef, useState } from 'react';

// Highlights every typed word wherever it appears in text, independently — so
// typing "development expense" highlights both "Development" and "Expense" in
// "Business Development Expense", in whichever order they actually appear.
function highlight(text, terms) {
  if (!terms?.length) return text;
  const lower = text.toLowerCase();
  const hits = [];
  for (const t of terms) {
    let from = 0;
    while (true) {
      const i = lower.indexOf(t, from);
      if (i === -1) break;
      hits.push([i, i + t.length]);
      from = i + t.length;
    }
  }
  if (!hits.length) return text;
  hits.sort((a, b) => a[0] - b[0]);
  const merged = [hits[0]];
  for (const [s, e] of hits.slice(1)) {
    const last = merged[merged.length - 1];
    if (s <= last[1]) last[1] = Math.max(last[1], e);
    else merged.push([s, e]);
  }
  const parts = [];
  let cursor = 0;
  merged.forEach(([s, e], idx) => {
    if (s > cursor) parts.push(text.slice(cursor, s));
    parts.push(<mark key={idx}>{text.slice(s, e)}</mark>);
    cursor = e;
  });
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}

const RECENT_LIMIT = 5;
function loadRecent(key) {
  if (!key) return [];
  try { return JSON.parse(localStorage.getItem(`acctpick-recent:${key}`) || '[]'); } catch { return []; }
}
function pushRecent(key, code) {
  if (!key) return;
  try {
    const next = [code, ...loadRecent(key).filter((c) => c !== code)].slice(0, RECENT_LIMIT);
    localStorage.setItem(`acctpick-recent:${key}`, JSON.stringify(next));
  } catch { /* private-browsing or storage disabled — fine to skip */ }
}

/**
 * A type-to-search account picker — replaces a plain <select> when the option
 * list is long enough that scrolling through it isn't practical.
 *
 * - Leads with the account name, code as a small reference line underneath.
 * - Typed words match in any order, anywhere in name or code, and get
 *   highlighted independently wherever they appear.
 * - When opened with nothing typed yet, your last few picks for this exact
 *   field (`storageKey`, kept in this browser only) show first under "Recent",
 *   so repeat data entry doesn't mean re-scrolling or re-typing the same
 *   search every time.
 * - Tab selects the highlighted option on the way out, same as Enter.
 */
export default function AccountPicker({ options, value, onChange, placeholder, storageKey }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightIdx, setHighlightIdx] = useState(0);
  const [recentCodes, setRecentCodes] = useState(() => loadRecent(storageKey));
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  const selected = options.find((o) => o.code === value);

  useEffect(() => {
    function onDocMouseDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) { setOpen(false); setQuery(''); }
    }
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, []);

  useEffect(() => { if (open) setRecentCodes(loadRecent(storageKey)); }, [open, storageKey]);

  const q = query.trim().toLowerCase();
  const terms = q.split(/\s+/).filter(Boolean);

  const ranked = useMemo(() => {
    if (!terms.length) return options;
    const out = [];
    for (const o of options) {
      const name = o.name.toLowerCase(), code = o.code.toLowerCase(), combined = `${name} ${code}`;
      if (!terms.every((t) => combined.includes(t))) continue;
      let rank;
      if (name.startsWith(q)) rank = 0;
      else if (name.includes(q)) rank = 1;
      else if (terms.every((t) => name.includes(t))) rank = 2;
      else if (code.startsWith(q)) rank = 3;
      else if (code.includes(q)) rank = 4;
      else rank = 5;
      out.push({ o, rank });
    }
    out.sort((a, b) => a.rank - b.rank || a.o.name.localeCompare(b.o.name));
    return out.map((r) => r.o);
  }, [options, q]);

  // With no search typed yet, lead with "Recent" (this field's last few picks),
  // then everything else below a divider — instead of dumping the whole list.
  const recentOptions = useMemo(
    () => (q ? [] : recentCodes.map((c) => options.find((o) => o.code === c)).filter(Boolean)),
    [q, recentCodes, options]
  );
  const restOptions = q ? ranked : ranked.filter((o) => !recentCodes.includes(o.code));
  const showRecent = recentOptions.length > 0;
  const displayList = [...recentOptions, ...restOptions].slice(0, 50 + recentOptions.length);
  const recentCount = showRecent ? recentOptions.length : 0;

  function choose(code) {
    onChange(code);
    pushRecent(storageKey, code);
    setRecentCodes(loadRecent(storageKey));
    setOpen(false);
    setQuery('');
  }

  function clearSelection(e) {
    e.stopPropagation();
    onChange('');
    inputRef.current?.focus();
    setOpen(true);
  }

  function onKeyDown(e) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) { setOpen(true); return; }
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIdx((h) => Math.min(h + 1, displayList.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightIdx((h) => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (displayList[highlightIdx]) choose(displayList[highlightIdx].code); }
    else if (e.key === 'Tab') { if (displayList[highlightIdx]) choose(displayList[highlightIdx].code); }
    else if (e.key === 'Escape') { setOpen(false); setQuery(''); }
  }

  return (
    <div className="acctpick" ref={wrapRef}>
      <div className="acctpick-inputwrap">
        <input
          ref={inputRef}
          className="in"
          value={open ? query : (selected ? selected.name : '')}
          placeholder={placeholder || 'Search account…'}
          onFocus={() => { setOpen(true); setQuery(''); setHighlightIdx(0); }}
          onChange={(e) => { setQuery(e.target.value); setHighlightIdx(0); }}
          onKeyDown={onKeyDown}
        />
        {!open && selected && (
          <>
            <span className="acctpick-code mono" title={selected.code}>{selected.code}</span>
            <button type="button" className="acctpick-clear" title="Clear" onMouseDown={(e) => e.preventDefault()} onClick={clearSelection}>&times;</button>
          </>
        )}
        <button
          type="button"
          className={`acctpick-chevron${open ? ' open' : ''}`}
          tabIndex={-1}
          aria-hidden="true"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => { setOpen((o) => !o); inputRef.current?.focus(); }}
        >
          <svg viewBox="0 0 12 8" width="11" height="8"><path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
      {open && (
        <div className="acctpick-list" role="listbox">
          {q && displayList.length > 0 && (
            <div className="acctpick-count">{restOptions.length} result{restOptions.length === 1 ? '' : 's'}</div>
          )}
          {showRecent && <div className="acctpick-group">Recent</div>}
          {displayList.length ? displayList.map((o, i) => (
            <div key={o.code}>
              {showRecent && i === recentCount && <div className="acctpick-group">All accounts</div>}
              <div
                className={`acctpick-opt${i === highlightIdx ? ' hi' : ''}`}
                role="option"
                aria-selected={o.code === value}
                onMouseDown={() => choose(o.code)}
                onMouseEnter={() => setHighlightIdx(i)}
              >
                <div className="acctpick-name">{highlight(o.name, terms)}</div>
                <div className="acctpick-subcode mono">{highlight(o.code, terms)}</div>
              </div>
            </div>
          )) : <div className="acctpick-empty">No account matches "{query}"</div>}
          {restOptions.length > 50 && <div className="acctpick-more">+{restOptions.length - 50} more — keep typing to narrow it down</div>}
        </div>
      )}
    </div>
  );
}
