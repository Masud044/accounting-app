import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;
const API = `${BASE}/api/project-profile`;

// ── Fetcher ───────────────────────────────────────────────────────────────────
const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  return json.data ?? json;
};

const jsonBody = (data) => ({
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

// ── Query Keys ────────────────────────────────────────────────────────────────
export const projectKeys = {
  all: ["projectProfile"],
  lists: () => [...projectKeys.all, "list"],
  detail: (id) => [...projectKeys.all, "detail", id],
  report: (id) => [...projectKeys.all, "report", id],
};

// ═══════════════════ PROJECTS (Header) ═══════════════════
export const useProjects = () =>
  useQuery({
    queryKey: projectKeys.lists(),
    queryFn: () => fetchJSON(`${API}/projects`),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

export const useProjectById = (id) =>
  useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => fetchJSON(`${API}/projects/${id}`),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useProjectFullReport = (id) =>
  useQuery({
    queryKey: projectKeys.report(id),
    queryFn: () => fetchJSON(`${API}/projects/${id}/report`),
    enabled: !!id,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => fetchJSON(`${API}/projects`, { method: "POST", ...jsonBody(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }),
    onError: (err) => console.error("Create project failed:", err),
  });
};

export const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => fetchJSON(`${API}/projects/${id}`, { method: "PUT", ...jsonBody(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }),
    onError: (err) => console.error("Update project failed:", err),
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => fetchJSON(`${API}/projects/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }),
    onError: (err) => console.error("Delete project failed:", err),
  });
};

// ═══════════════════ Generic CRUD-hook factory ═══════════════════
// Used for the nine "simple" child sections (one flat table per PROJECT_ID,
// each row addressed by its own PK). Cuts down repeated boilerplate while
// keeping the same query-key / invalidate behaviour as the rest of the app.
const makeCrudHooks = (resourceName, basePath) => {
  const keys = {
    all: ["projectProfile", resourceName],
    list: (projectId) => ["projectProfile", resourceName, "list", projectId],
  };

  const useList = (projectId) =>
    useQuery({
      queryKey: keys.list(projectId),
      queryFn: () => fetchJSON(`${API}/${basePath}/${projectId}`),
      enabled: !!projectId,
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      throwOnError: false,
    });

  const useCreate = (projectId) => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (data) => fetchJSON(`${API}/${basePath}`, { method: "POST", ...jsonBody(data) }),
      onSuccess: () => qc.invalidateQueries({ queryKey: keys.list(projectId) }),
      onError: (err) => console.error(`Create ${resourceName} failed:`, err),
    });
  };

  const useUpdate = (projectId) => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }) => fetchJSON(`${API}/${basePath}/${id}`, { method: "PUT", ...jsonBody(data) }),
      onSuccess: () => qc.invalidateQueries({ queryKey: keys.list(projectId) }),
      onError: (err) => console.error(`Update ${resourceName} failed:`, err),
    });
  };

  const useDelete = (projectId) => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id) => fetchJSON(`${API}/${basePath}/${id}`, { method: "DELETE" }),
      onSuccess: () => qc.invalidateQueries({ queryKey: keys.list(projectId) }),
      onError: (err) => console.error(`Delete ${resourceName} failed:`, err),
    });
  };

  return { keys, useList, useCreate, useUpdate, useDelete };
};

export const objectivesApi = makeCrudHooks("objectives", "objectives");
export const capacityApi = makeCrudHooks("capacity", "capacity");
export const infrastructureApi = makeCrudHooks("infrastructure", "infrastructure");
export const investmentsApi = makeCrudHooks("investments", "investments");
export const schedulesApi = makeCrudHooks("schedules", "schedules");
export const marketingApi = makeCrudHooks("marketing", "marketing-channels");
export const financialApi = makeCrudHooks("financial", "financial-projections");
export const risksApi = makeCrudHooks("risks", "risks");
export const benefitsApi = makeCrudHooks("benefits", "social-benefits");

// ═══════════════════ PROJECT_PHASE ═══════════════════
export const phaseKeys = {
  list: (projectId) => ["projectProfile", "phases", "list", projectId],
};

export const usePhases = (projectId) =>
  useQuery({
    queryKey: phaseKeys.list(projectId),
    queryFn: () => fetchJSON(`${API}/phases?projectId=${projectId}`),
    enabled: !!projectId,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

const invalidatePhaseScope = (qc, projectId) => {
  qc.invalidateQueries({ queryKey: phaseKeys.list(projectId) });
  qc.invalidateQueries({ queryKey: activityKeys.list(projectId) });
};

export const useCreatePhase = (projectId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => fetchJSON(`${API}/phases`, { method: "POST", ...jsonBody(data) }),
    onSuccess: () => invalidatePhaseScope(qc, projectId),
    onError: (err) => console.error("Create phase failed:", err),
  });
};

export const useUpdatePhase = (projectId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => fetchJSON(`${API}/phases/${id}`, { method: "PUT", ...jsonBody(data) }),
    onSuccess: () => invalidatePhaseScope(qc, projectId),
    onError: (err) => console.error("Update phase failed:", err),
  });
};

export const useDeletePhase = (projectId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => fetchJSON(`${API}/phases/${id}`, { method: "DELETE" }),
    onSuccess: () => invalidatePhaseScope(qc, projectId),
    onError: (err) => console.error("Delete phase failed:", err),
  });
};

// ═══════════════════ PROJECT_ACTIVITY ═══════════════════
export const activityKeys = {
  list: (projectId) => ["projectProfile", "activities", "list", projectId],
};

export const useActivities = (projectId) =>
  useQuery({
    queryKey: activityKeys.list(projectId),
    queryFn: () => fetchJSON(`${API}/activities?projectId=${projectId}`),
    enabled: !!projectId,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

const invalidateActivityScope = (qc, projectId) => {
  qc.invalidateQueries({ queryKey: activityKeys.list(projectId) });
};

export const useCreateActivity = (projectId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => fetchJSON(`${API}/activities`, { method: "POST", ...jsonBody(data) }),
    onSuccess: () => invalidateActivityScope(qc, projectId),
    onError: (err) => console.error("Create activity failed:", err),
  });
};

export const useUpdateActivity = (projectId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => fetchJSON(`${API}/activities/${id}`, { method: "PUT", ...jsonBody(data) }),
    onSuccess: () => invalidateActivityScope(qc, projectId),
    onError: (err) => console.error("Update activity failed:", err),
  });
};

export const useDeleteActivity = (projectId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => fetchJSON(`${API}/activities/${id}`, { method: "DELETE" }),
    onSuccess: () => invalidateActivityScope(qc, projectId),
    onError: (err) => console.error("Delete activity failed:", err),
  });
};

// ═══════════════════ CONCLUSION (singleton per project) ═══════════════════
export const conclusionKeys = {
  detail: (projectId) => ["projectProfile", "conclusion", projectId],
};

export const useConclusion = (projectId) =>
  useQuery({
    queryKey: conclusionKeys.detail(projectId),
    queryFn: () => fetchJSON(`${API}/conclusion/${projectId}`),
    enabled: !!projectId,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useCreateConclusion = (projectId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => fetchJSON(`${API}/conclusion`, { method: "POST", ...jsonBody(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: conclusionKeys.detail(projectId) }),
    onError: (err) => console.error("Create conclusion failed:", err),
  });
};

export const useUpdateConclusion = (projectId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => fetchJSON(`${API}/conclusion/${id}`, { method: "PUT", ...jsonBody(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: conclusionKeys.detail(projectId) }),
    onError: (err) => console.error("Update conclusion failed:", err),
  });
};