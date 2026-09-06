const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  login: (email, password) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  signup: (name, email, password) =>
    request("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
  getDashboardStats: () => request("/api/dashboard/stats"),
  getTasks: () => request("/api/classify/tasks"),
  classify: (text, task, save_to_history = true) =>
    request("/api/classify", {
      method: "POST",
      body: JSON.stringify({ text, task, save_to_history }),
    }),
  process: (text, options) =>
    request("/api/process", {
      method: "POST",
      body: JSON.stringify({ text, ...options }),
    }),
  getPerformance: (task) => request(`/api/performance/${task}`),
  getAllPerformance: () => request("/api/performance"),
  getHistory: (search, task, limit = 200) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (task && task !== "all") params.set("task", task);
    params.set("limit", limit);
    return request(`/api/history?${params.toString()}`);
  },
  getBatchHistory: (task) =>
    request(task && task !== "all" ? `/api/history/batches?task=${task}` : "/api/history/batches"),
  deleteBatchJob: (id) => request(`/api/history/batches/${id}`, { method: "DELETE" }),
  deleteHistoryItem: (id) => request(`/api/history/${id}`, { method: "DELETE" }),
  clearHistory: () => request("/api/history", { method: "DELETE" }),
  getSettings: () => request("/api/settings"),
  updateSettings: (values) =>
    request("/api/settings", { method: "PUT", body: JSON.stringify({ values }) }),
  getBatchOverview: (task = "topic") => request(`/api/batch/overview?task=${task}`),
  batchAnalyze: async (file, task) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("task", task);
    const res = await fetch(`${BASE_URL}/api/batch`, { method: "POST", body: formData });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.detail || `Request failed: ${res.status}`);
    }
    return res.json();
  },
  exportBatch: async (results) => {
    const res = await fetch(`${BASE_URL}/api/batch/export`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ results }),
    });
    return res.blob();
  },
};

export default api;
