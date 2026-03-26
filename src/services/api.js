import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://conafbackend-production.up.railway.app',
});

// Interceptor para inyectar Token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar error de autenticación centralizado
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/CONAF_CONTRATO/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- AUTH ---
export const authService = {
  login: async (email, password) => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    
    // El servidor redirige si hay barra final, así que la quitamos:
    const { data } = await api.post('/api/auth/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return data;
  },
  me: async () => {
    const { data } = await api.get('/api/auth/me');
    return data;
  }
};

// --- EMPLEADOS ---
export const empleadosService = {
  list: async (params = {}) => {
    const { data, headers } = await api.get('/api/empleados/', { params });
    return { data, total: parseInt(headers['x-total-count'] || '0') };
  },
  getOne: async (id) => {
    const { data } = await api.get(`/api/empleados/${id}`);
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post('/api/empleados/', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/api/empleados/${id}`, payload);
    return data;
  },
  bulkImport: async (items) => {
    const { data } = await api.post('/api/empleados/bulk-import', items);
    return data;
  }
};

// --- CONTRATOS ---
export const contratosService = {
  getTemplates: async () => {
    const { data } = await api.get('/api/contratos/templates');
    return data;
  },

  list: async (params = {}) => {
    // Soporte para filtrar contratos con PDF generado
    const { hasPdfOnly, ...restParams } = params;
    if (hasPdfOnly) restParams.has_pdf = true;
    const { data, headers } = await api.get('/api/contratos/', { params: restParams });
    // Siempre normalizar a { items: [], total: n } para que el frontend no tenga que bifurcar
    const total = parseInt(headers['x-total-count'] || '0');
    const items = Array.isArray(data) ? data : (data.items ?? data.contratos ?? []);
    const resolvedTotal = total > 0 ? total : items.length;
    return { items, total: resolvedTotal };
  },
  create: async (empleadoId, templateId = 'contrato_indefinido', datosFormulario = {}) => {
    const { data } = await api.post('/api/contratos/', { 
      empleado_id: empleadoId,
      template_id: templateId,
      datos_formulario: datosFormulario
    });
    return data;
  },
  getOne: async (id) => {
    const { data } = await api.get(`/api/contratos/${id}`);
    return data;
  },
  revisar: async (id) => {
    const { data } = await api.patch(`/api/contratos/${id}/revisar`);
    return data;
  },
  imprimir: async (id) => {
    const { data } = await api.patch(`/api/contratos/${id}/imprimir`);
    return data;
  },
  marcarEsperandoFirma: async (id) => {
    const { data } = await api.patch(`/api/contratos/${id}/esperando-firma`);
    return data;
  },
  uploadScan: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post(`/api/contratos/${id}/escaneado`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },
  getHistory: async (id) => {
    const { data } = await api.get(`/api/contratos/${id}/history`);
    return data;
  },
  getPdfUrl: (id) => {
    const base = import.meta.env.VITE_API_BASE_URL || 'https://conafbackend-production.up.railway.app';
    return `${base}/api/contratos/${id}/pdf`;
  },
  /**
   * Construye una URL pública con ?token= y ?preview=true para uso en iframes o nueva pestaña.
   * Ahora soportado oficialmente por el backend (sección 4.3 de la doc).
   */
  getPdfViewUrl: (id, type = 'generado') => {
    const base = import.meta.env.VITE_API_BASE_URL || 'https://conafbackend-production.up.railway.app';
    const token = localStorage.getItem('token');
    const typeParam = type === 'escaneado' ? 'scanned' : 'generado';
    return `${base}/api/contratos/${id}/pdf?type=${typeParam}&preview=true&token=${token}`;
  },
  /**
   * Descarga el PDF como blob usando axios (token en header).
   * Retorna una blob:// URL para usar en <iframe> o para descargar.
   */
  downloadPdfAsBlob: async (id, type = 'generado') => {
    const typeParam = type === 'escaneado' ? 'scanned' : 'generado';
    const response = await api.get(`/api/contratos/${id}/pdf?type=${typeParam}`, {
      responseType: 'blob',
    });
    return URL.createObjectURL(response.data);
  },
  delete: async (id) => {
    const { data } = await api.delete(`/api/contratos/${id}`);
    return data;
  }
};

// --- SOPORTE SISTEMA (Full Sync: DB + PDFs) ---
export const systemService = {
  exportFullBackup: async () => {
    const response = await api.get('/api/system/export-all', {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `backup_conaf_full_${new Date().toISOString().split('T')[0]}.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
  importFullBackup: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/api/system/import-all', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  }
};

export default api;
