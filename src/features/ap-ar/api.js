import http from '../../api/axios-api';

// Merge-time path prefix, applied in front of every request path.
const PREFIX = '/api';

function normalize(data) {
  return data && typeof data === 'object' ? data : {};
}

async function call(path, options = {}) {
  const res = await http.request({
    url: PREFIX + path,
    method: options.method || 'GET',
    // No Content-Type header unless there is a JSON body (matches the old
    // fetch adapter: bodyless requests sent no Content-Type at all).
    headers: options.body ? undefined : { 'Content-Type': undefined },
    data: options.body,
    // Never throw on HTTP error statuses — callers read { ok, data } instead.
    validateStatus: () => true,
  });
  const data = normalize(res.data);
  return { ok: res.status >= 200 && res.status < 300, data };
}

export const api = {
  get: (path) => call(path),
  post: (path, body) => call(path, { method: 'POST', body }),
  del: (path) => call(path, { method: 'DELETE' }),
  // File uploads: no Content-Type header (axios sets the multipart boundary
  // itself), and the body is FormData, not JSON.
  upload: async (path, formData) => {
    const res = await http.post(PREFIX + path, formData, {
      headers: { 'Content-Type': undefined },
      validateStatus: () => true,
    });
    const data = normalize(res.data);
    return { ok: res.status >= 200 && res.status < 300, data };
  },
};

export function money(n) {
  return '৳' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function round2(x) {
  return Math.round(x * 100) / 100;
}
