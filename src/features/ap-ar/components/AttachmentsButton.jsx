import { useEffect, useRef, useState } from 'react';
import { api } from '../api.js';

function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * A small paperclip button (with a count badge once files exist) that opens a
 * popover for attaching/viewing/downloading/removing files against one
 * invoice, payment, or receipt row. Files are stored server-side as BLOBs in
 * the legacy GLDOC table, against that transaction's GL voucher. entityType
 * must be one of: AP_INVOICE, AP_PAYMENT, AR_INVOICE, AR_RECEIPT.
 */
export default function AttachmentsButton({ entityType, entityId }) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [count, setCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const wrapRef = useRef(null);
  const fileInputRef = useRef(null);

  async function load() {
    const res = await api.get(`/attachments?entityType=${entityType}&entityId=${entityId}`);
    if (res.ok) { setFiles(res.data); setCount(res.data.length); }
  }

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);
  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e) { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open]);

  async function onPick(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true); setError('');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('entityType', entityType);
    fd.append('entityId', entityId);
    const res = await api.upload('/attachments', fd);
    setBusy(false);
    if (!res.data.ok) { setError(res.data.error || 'Upload failed'); return; }
    await load();
  }

  async function onDelete(id) {
    setBusy(true);
    await api.del(`/attachments/${id}`);
    setBusy(false);
    await load();
  }

  return (
    <div className="attbtn" ref={wrapRef}>
      <button type="button" className="attbtn-trigger" title={count ? `${count} file${count === 1 ? '' : 's'} attached` : 'Attach a file'} onClick={() => setOpen((o) => !o)}>
        <svg viewBox="0 0 16 16" width="15" height="15"><path d="M11.5 3.5 5.6 9.4a2.1 2.1 0 0 0 3 3l5.6-5.6a3.4 3.4 0 0 0-4.8-4.8L3.7 7.7a4.7 4.7 0 0 0 6.6 6.6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        {count > 0 && <span className="attbtn-badge">{count}</span>}
      </button>
      {open && (
        <div className="attbtn-pop">
          <div className="attbtn-title">Attachments</div>
          {files.length ? (
            <ul className="attbtn-list">
              {files.map((f) => (
                <li key={f.id}>
                  <a href={`/api/attachments/${f.id}/download`} target="_blank" rel="noreferrer" className="attbtn-link">{f.name}</a>
                  <span className="attbtn-meta">{formatSize(f.size)}</span>
                  <button type="button" className="attbtn-x" title="Remove" onClick={() => onDelete(f.id)}>&times;</button>
                </li>
              ))}
            </ul>
          ) : <div className="attbtn-empty">No files yet.</div>}
          <button type="button" className="ghost attbtn-add" disabled={busy} onClick={() => fileInputRef.current?.click()}>
            {busy ? 'Uploading…' : '+ Add file'}
          </button>
          <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={onPick} />
          {error && <div className="attbtn-err">{error}</div>}
        </div>
      )}
    </div>
  );
}
