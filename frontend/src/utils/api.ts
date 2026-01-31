/**
 * Professional API Client with JWT Authentication
 * Handles all API requests with automatic token management
 */

import { getAuthToken, clearAuthData, isTokenValid } from './jwt';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
  error?: string;
}

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * Professional API client with automatic error handling and token management
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Get authorization headers
   */
  private getHeaders(requireAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (requireAuth) {
      try {
        const token = getAuthToken();
        if (token && isTokenValid(token)) {
          headers['Authorization'] = `Bearer ${token}`;
        } else {
          // Token invalid or missing, clear auth data but don't throw
          // Let the request proceed and backend will return 401
          clearAuthData();
          console.warn('No valid token found for authenticated request');
        }
      } catch (error) {
        console.error('Error getting auth token:', error);
        // Don't throw, continue without token
      }
    }

    return headers;
  }

  /**
   * Handle API response with better error handling
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data: any = {};
    
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text || `HTTP Error: ${response.status}` };
        }
      }
    } catch (parseError: any) {
      console.error('Error parsing response:', parseError);
      data = { message: `Failed to parse server response (Status: ${response.status})` };
    }

    if (!response.ok) {
      // Handle 401 Unauthorized - clear auth and redirect to login
      if (response.status === 401) {
        clearAuthData();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth';
        }
        return {
          success: false,
          message: 'Authentication required. Please login again.',
          errors: data.errors,
          error: 'Unauthorized',
        };
      }

      // Handle 404 Not Found
      if (response.status === 404) {
        return {
          success: false,
          message: data.message || 'Resource not found',
          errors: data.errors,
          error: data.error || 'Not Found',
        };
      }

      // Handle 500 Server Error
      if (response.status >= 500) {
        return {
          success: false,
          message: data.message || 'Server error. Please try again later.',
          errors: data.errors,
          error: data.error || 'Internal Server Error',
        };
      }

      return {
        success: false,
        message: data.message || `HTTP Error: ${response.status} ${response.statusText}`,
        errors: data.errors,
        error: data.error || `HTTP ${response.status}`,
      };
    }

    return {
      success: true,
      ...data,
    };
  }

  /**
   * Make API request with retry logic and better error handling
   */
  async request<T>(
    endpoint: string,
    options: RequestOptions = {},
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    const { requireAuth = false, ...fetchOptions } = options;
    const maxRetries = 3;
    const timeout = 30000; // 30 seconds timeout

    try {
      const headers = this.getHeaders(requireAuth);

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          ...fetchOptions,
          signal: controller.signal,
          headers: {
            ...headers,
            ...(fetchOptions.headers || {}),
          },
        });

        clearTimeout(timeoutId);
        return await this.handleResponse<T>(response);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        
        // Handle timeout
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timeout. The server took too long to respond.');
        }
        
        // Handle network errors
        if (fetchError instanceof TypeError && fetchError.message === 'Failed to fetch') {
          // Check if it's a connection issue
          const isConnectionError = 
            fetchError.message.includes('Failed to fetch') ||
            fetchError.message.includes('NetworkError') ||
            fetchError.message.includes('Network request failed');
          
          if (isConnectionError && retryCount < maxRetries) {
            // Wait before retry (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
            console.warn(`🔄 Retrying request (${retryCount + 1}/${maxRetries}): ${endpoint}`);
            return this.request<T>(endpoint, options, retryCount + 1);
          }
          
          // After all retries failed, return helpful error message
          const backendUrl = this.baseURL.replace('/api', '');
          const errorMsg = `Unable to connect to backend server at ${backendUrl}. Please ensure the backend is running.`;
          console.error('❌ Backend Connection Error:', errorMsg);
          return {
            success: false,
            message: errorMsg,
            error: 'Network connection failed',
          };
        }
        
        throw fetchError;
      }
    } catch (error: any) {
      console.error('API Request Error:', error);
      
      // Provide helpful error messages
      let errorMessage = 'Network error. Please check your connection.';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        errorMessage = `Cannot connect to backend server at ${this.baseURL}. Please ensure the backend is running.`;
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.message || 'Unknown error',
      };
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, requireAuth: boolean = false): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
      requireAuth,
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    requireAuth: boolean = false
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      requireAuth,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    requireAuth: boolean = false
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      requireAuth,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, requireAuth: boolean = false): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      requireAuth,
    });
  }

  async download(endpoint: string, filename: string): Promise<void> {
    const token = getAuthToken();
    const res = await fetch(`${this.baseURL}${endpoint}`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    if (res.status === 401) {
      clearAuthData();
      if (typeof window !== 'undefined') window.location.href = '/auth';
      throw new Error('Unauthorized');
    }
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error((j as { message?: string }).message || res.statusText);
    }
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export convenience methods
export const api = {
  // Authentication endpoints
  auth: {
    signup: {
      simpleUser: (data: any) => apiClient.post('/auth/signup/simple-user', data),
      ngo: (data: any) => apiClient.post('/auth/signup/ngo', data),
      corporate: (data: any) => apiClient.post('/auth/signup/corporate', data),
      admin: (data: any) => apiClient.post('/auth/signup/admin', data),
    },
    login: {
      simpleUser: (data: any) => apiClient.post('/auth/login/simple-user', data),
      ngo: (data: any) => apiClient.post('/auth/login/ngo', data),
      corporate: (data: any) => apiClient.post('/auth/login/corporate', data),
      admin: (data: any) => apiClient.post('/auth/login/admin', data),
    },
  },
  // Admin endpoints
  admin: {
    overview: {
      getAll: () => apiClient.get('/admin/overview', true),
      getKPIs: () => apiClient.get('/admin/overview/kpis', true),
      getCreditsLifecycle: () => apiClient.get('/admin/overview/credits-lifecycle', true),
      getUsageTrend: (months?: number) => apiClient.get(`/admin/overview/usage-trend${months ? `?months=${months}` : ''}`, true),
      getPortalActivity: (portals?: string[]) => apiClient.get(`/admin/overview/portal-activity${portals ? `?portals=${portals.join(',')}` : ''}`, true),
    },
    systemSettings: {
      getAll: () => apiClient.get('/admin/system-settings', true),
      getSettings: () => apiClient.get('/admin/system-settings/settings', true),
      updateSection: (section: string, data: any) => apiClient.put(`/admin/system-settings/${section}`, data, true),
      getIntegrations: () => apiClient.get('/admin/system-settings/integrations', true),
      updateIntegration: (id: string, data: any) => apiClient.put(`/admin/system-settings/integrations/${id}`, data, true),
      getBackups: (limit?: number) => apiClient.get(`/admin/system-settings/backups${limit ? `?limit=${limit}` : ''}`, true),
      createBackup: (data: any) => apiClient.post('/admin/system-settings/backups', data, true),
    },
    system: {
      getHealth: () => apiClient.get('/admin/system', true),
      getServices: () => apiClient.get('/admin/system/services', true),
      getIncidents: (limit?: number, status?: string) => {
        const params = [];
        if (limit) params.push(`limit=${limit}`);
        if (status) params.push(`status=${status}`);
        return apiClient.get(`/admin/system/incidents${params.length ? `?${params.join('&')}` : ''}`, true);
      },
      getLogs: (limit?: number, level?: string, service?: string) => {
        const params = [];
        if (limit) params.push(`limit=${limit}`);
        if (level) params.push(`level=${level}`);
        if (service) params.push(`service=${service}`);
        return apiClient.get(`/admin/system/logs${params.length ? `?${params.join('&')}` : ''}`, true);
      },
      updateServiceHealth: (serviceName: string, data: any) => apiClient.put(`/admin/system/services/${serviceName}`, data, true),
    },
    users: {
      getAll: (filters?: { search?: string; status?: string; role?: string; portal?: string }) => {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.role) params.append('role', filters.role);
        if (filters?.portal) params.append('portal', filters.portal);
        const queryString = params.toString();
        return apiClient.get(`/admin/users${queryString ? `?${queryString}` : ''}`, true);
      },
      getStats: () => apiClient.get('/admin/users/stats', true),
      getById: (id: string) => apiClient.get(`/admin/users/${id}`, true),
      updateStatus: (id: string, status: string) => apiClient.put(`/admin/users/${id}/status`, { status }, true),
      updateRole: (id: string, role: string) => apiClient.put(`/admin/users/${id}/role`, { role }, true),
    },
    roles: {
      getAll: () => apiClient.get('/admin/roles', true),
      getStats: () => apiClient.get('/admin/roles/stats', true),
      getById: (id: string) => apiClient.get(`/admin/roles/${id}`, true),
      create: (data: any) => apiClient.post('/admin/roles', data, true),
      updatePermissions: (id: string, permissions: any) => apiClient.put(`/admin/roles/${id}/permissions`, { permissions }, true),
      updatePermission: (id: string, permission: string, value: boolean) => apiClient.put(`/admin/roles/${id}/permissions/${permission}`, { value }, true),
      updateAllPermissions: (id: string, value: boolean) => apiClient.put(`/admin/roles/${id}/permissions/all`, { value }, true),
      delete: (id: string) => apiClient.delete(`/admin/roles/${id}`, true),
      reset: () => apiClient.post('/admin/roles/reset', {}, true),
      export: () => apiClient.get('/admin/roles/export', true),
    },
    invitations: {
      getAll: (filters?: { search?: string; status?: string; role?: string; portal?: string }) => {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.role) params.append('role', filters.role);
        if (filters?.portal) params.append('portal', filters.portal);
        return apiClient.get(`/admin/invitations?${params.toString()}`, true);
      },
      getStats: () => apiClient.get('/admin/invitations/stats', true),
      getById: (id: string) => apiClient.get(`/admin/invitations/${id}`, true),
      create: (data: { email: string; role: string; portal: string; daysUntilExpiry?: number }) => 
        apiClient.post('/admin/invitations', data, true),
      resend: (id: string, daysUntilExpiry?: number) => 
        apiClient.put(`/admin/invitations/${id}/resend`, { daysUntilExpiry }, true),
      revoke: (id: string) => apiClient.put(`/admin/invitations/${id}/revoke`, {}, true),
      export: (filters?: { search?: string; status?: string; role?: string; portal?: string }) => {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.role) params.append('role', filters.role);
        if (filters?.portal) params.append('portal', filters.portal);
        return apiClient.get(`/admin/invitations/export?${params.toString()}`, true);
      },
    },
    portals: {
      corporate: {
        getDashboard: () => apiClient.get('/admin/portals/corporate', true),
        updateEntityStatus: (id: string, action: 'disable' | 'approve' | 'review') =>
          apiClient.request(`/admin/portals/corporate/entities/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ action }),
            requireAuth: true,
          }),
      },
      ngo: {
        getDashboard: () => apiClient.get('/admin/portals/ngo', true),
        getActivities: (limit?: number) => {
          const q = new URLSearchParams();
          if (limit) q.set('limit', String(limit));
          return apiClient.get(`/admin/portals/ngo/activities?${q}`, true);
        },
        updateEntityStatus: (id: string, action: 'disable' | 'approve' | 'review') =>
          apiClient.request(`/admin/portals/ngo/entities/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ action }),
            requireAuth: true,
          }),
      },
    },
    projects: {
      get: (params?: { status?: string; category?: string; search?: string; page?: number; limit?: number }) => {
        const q = new URLSearchParams();
        if (params?.status && params.status !== 'all') q.set('status', params.status);
        if (params?.category && params.category !== 'all') q.set('category', params.category);
        if (params?.search) q.set('search', params.search);
        if (params?.page) q.set('page', String(params.page));
        if (params?.limit) q.set('limit', String(params.limit));
        return apiClient.get(`/admin/projects?${q}`, true);
      },
      getOne: (id: string) => apiClient.get(`/admin/projects/${id}`, true),
      approve: (id: string, comment?: string) =>
        apiClient.request(`/admin/projects/${id}/approve`, {
          method: 'PATCH',
          body: JSON.stringify({ comment }),
          requireAuth: true,
        }),
      reject: (id: string, reason: string) =>
        apiClient.request(`/admin/projects/${id}/reject`, {
          method: 'PATCH',
          body: JSON.stringify({ reason }),
          requireAuth: true,
        }),
      delete: (id: string) =>
        apiClient.request(`/admin/projects/${id}`, {
          method: 'DELETE',
          requireAuth: true,
        }),
    },
    publicProjects: {
      get: (params?: { category?: string; featured?: boolean; search?: string; limit?: number }) => {
        const q = new URLSearchParams();
        if (params?.category) q.set('category', params.category);
        if (params?.featured !== undefined) q.set('featured', String(params.featured));
        if (params?.search) q.set('search', params.search);
        if (params?.limit) q.set('limit', String(params.limit));
        return apiClient.get(`/admin/public-projects?${q}`, true);
      },
      getOne: (id: string) => apiClient.get(`/admin/public-projects/${id}`, true),
      create: (data: any) => apiClient.post('/admin/public-projects', data, true),
      update: (id: string, data: any) => apiClient.put(`/admin/public-projects/${id}`, data, true),
      delete: (id: string) => apiClient.delete(`/admin/public-projects/${id}`, true),
      getStats: () => apiClient.get('/admin/public-projects/stats', true),
    },
    publicProducts: {
      get: (params?: { category?: string; status?: string; featured?: boolean; badge?: string; search?: string; page?: number; limit?: number }) => {
        const q = new URLSearchParams();
        if (params?.category) q.set('category', params.category);
        if (params?.status) q.set('status', params.status);
        if (params?.featured !== undefined) q.set('featured', String(params.featured));
        if (params?.badge) q.set('badge', params.badge);
        if (params?.search) q.set('search', params.search);
        if (params?.page) q.set('page', String(params.page));
        if (params?.limit) q.set('limit', String(params.limit));
        return apiClient.get(`/admin/public-products?${q}`, true);
      },
      getOne: (id: string) => apiClient.get(`/admin/public-products/${id}`, true),
      create: (data: any) => apiClient.post('/admin/public-products', data, true),
      update: (id: string, data: any) => apiClient.put(`/admin/public-products/${id}`, data, true),
      delete: (id: string) => apiClient.delete(`/admin/public-products/${id}`, true),
      getStats: () => apiClient.get('/admin/public-products/stats', true),
    },
    finance: {
      transactions: {
        getList: (p?: { search?: string; status?: string; type?: string; dateRange?: string; page?: number; limit?: number; includeSeed?: string }) => {
          const q = new URLSearchParams();
          if (p?.search) q.set('search', p.search);
          if (p?.status && p.status !== 'all') q.set('status', p.status);
          if (p?.type && p.type !== 'all') q.set('type', p.type);
          if (p?.dateRange && p.dateRange !== 'all') q.set('dateRange', p.dateRange);
          if (p?.page) q.set('page', String(p.page));
          if (p?.limit) q.set('limit', String(p.limit));
          if (p?.includeSeed) q.set('includeSeed', p.includeSeed);
          return apiClient.get(`/admin/finance/transactions?${q}`, true);
        },
        getOne: (id: string) => apiClient.get(`/admin/finance/transactions/${id}`, true),
        getReceipt: (id: string) => apiClient.get(`/admin/finance/transactions/${id}/receipt`, true),
        getInvoice: (id: string) => apiClient.get(`/admin/finance/transactions/${id}/invoice`, true),
        getAnalytics: (p?: { dateRange?: string; groupBy?: string; includeSeed?: string }) => {
          const q = new URLSearchParams();
          if (p?.dateRange && p.dateRange !== 'all') q.set('dateRange', p.dateRange);
          if (p?.groupBy) q.set('groupBy', p.groupBy);
          if (p?.includeSeed) q.set('includeSeed', p.includeSeed);
          return apiClient.get(`/admin/finance/transactions/analytics?${q}`, true);
        },
        exportDownload: async (p?: { search?: string; status?: string; type?: string; dateRange?: string; includeSeed?: string }, format: 'csv' | 'json' = 'csv') => {
          const q = new URLSearchParams();
          if (p?.search) q.set('search', p.search);
          if (p?.status && p.status !== 'all') q.set('status', p.status);
          if (p?.type && p.type !== 'all') q.set('type', p.type);
          if (p?.dateRange && p.dateRange !== 'all') q.set('dateRange', p.dateRange);
          if (p?.includeSeed) q.set('includeSeed', p.includeSeed);
          q.set('format', format);
          const fn = `transactions-${new Date().toISOString().slice(0, 10)}.${format === 'csv' ? 'csv' : 'json'}`;
          await apiClient.download(`/admin/finance/transactions/export?${q}`, fn);
        },
      },
    },
    accessControl: {
      getOverview: (includeSeed?: boolean) =>
        apiClient.get(`/admin/security/access-control/overview${includeSeed ? '?includeSeed=1' : ''}`, true),
      getAccessRules: (p?: { search?: string; status?: string; type?: string; page?: number; limit?: number; includeSeed?: boolean }) => {
        const q = new URLSearchParams();
        if (p?.search) q.set('search', p.search);
        if (p?.status && p.status !== 'all') q.set('status', p.status);
        if (p?.type && p.type !== 'all') q.set('type', p.type);
        if (p?.page) q.set('page', String(p.page));
        if (p?.limit) q.set('limit', String(p.limit));
        if (p?.includeSeed) q.set('includeSeed', '1');
        return apiClient.get(`/admin/security/access-control/access-rules?${q}`, true);
      },
      getAccessRule: (id: string, includeSeed?: boolean) =>
        apiClient.get(`/admin/security/access-control/access-rules/${id}${includeSeed ? '?includeSeed=1' : ''}`, true),
      createAccessRule: (data: { name: string; type: string; description: string; status?: string; priority?: number; conditions?: string[]; affectedUsers?: number; affectedIPs?: string[] }) =>
        apiClient.post('/admin/security/access-control/access-rules', data, true),
      updateAccessRule: (id: string, data: { name?: string; type?: string; description?: string; status?: string; priority?: number; conditions?: string[]; affectedUsers?: number; affectedIPs?: string[] }, includeSeed?: boolean) =>
        apiClient.put(`/admin/security/access-control/access-rules/${id}${includeSeed ? '?includeSeed=1' : ''}`, data, true),
      deleteAccessRule: (id: string, includeSeed?: boolean) =>
        apiClient.delete(`/admin/security/access-control/access-rules/${id}${includeSeed ? '?includeSeed=1' : ''}`, true),
      getIPRules: (p?: { search?: string; status?: string; page?: number; limit?: number; includeSeed?: boolean }) => {
        const q = new URLSearchParams();
        if (p?.search) q.set('search', p.search);
        if (p?.status && p.status !== 'all') q.set('status', p.status);
        if (p?.page) q.set('page', String(p.page));
        if (p?.limit) q.set('limit', String(p.limit));
        if (p?.includeSeed) q.set('includeSeed', '1');
        return apiClient.get(`/admin/security/access-control/ip-rules?${q}`, true);
      },
      getIPRule: (id: string, includeSeed?: boolean) =>
        apiClient.get(`/admin/security/access-control/ip-rules/${id}${includeSeed ? '?includeSeed=1' : ''}`, true),
      createIPRule: (data: { ipAddress: string; cidr?: string; type: 'allow' | 'deny'; reason: string; status?: string; expiresAt?: string; location?: string }) =>
        apiClient.post('/admin/security/access-control/ip-rules', data, true),
      updateIPRule: (id: string, data: { ipAddress?: string; cidr?: string; type?: 'allow' | 'deny'; reason?: string; status?: string; expiresAt?: string; location?: string }, includeSeed?: boolean) =>
        apiClient.put(`/admin/security/access-control/ip-rules/${id}${includeSeed ? '?includeSeed=1' : ''}`, data, true),
      deleteIPRule: (id: string, includeSeed?: boolean) =>
        apiClient.delete(`/admin/security/access-control/ip-rules/${id}${includeSeed ? '?includeSeed=1' : ''}`, true),
      getRoleAccess: () => apiClient.get('/admin/security/access-control/role-access', true),
      getRoleAccessByRole: (role: string) => apiClient.get(`/admin/security/access-control/role-access/${encodeURIComponent(role)}`, true),
      updateRoleAccess: (role: string, data: { permissions?: string[]; resources?: string[]; restrictions?: string[] }) =>
        apiClient.put(`/admin/security/access-control/role-access/${encodeURIComponent(role)}`, data, true),
    },
    auditLogs: {
      getList: (p?: { search?: string; severity?: string; action?: string; status?: string; dateRange?: string; page?: number; limit?: number; includeSeed?: boolean }) => {
        const q = new URLSearchParams();
        if (p?.search) q.set('search', p.search);
        if (p?.severity && p.severity !== 'all') q.set('severity', p.severity);
        if (p?.action && p.action !== 'all') q.set('action', p.action);
        if (p?.status && p.status !== 'all') q.set('status', p.status);
        if (p?.dateRange && p.dateRange !== 'all') q.set('dateRange', p.dateRange);
        if (p?.page) q.set('page', String(p.page));
        if (p?.limit) q.set('limit', String(p.limit));
        if (p?.includeSeed) q.set('includeSeed', '1');
        return apiClient.get<{ logs: any[]; stats: any; pagination: any }>(`/admin/security/audit-logs?${q}`, true);
      },
      getOne: (id: string, includeSeed?: boolean) =>
        apiClient.get(`/admin/security/audit-logs/${id}${includeSeed ? '?includeSeed=1' : ''}`, true),
      getExportOne: (id: string, includeSeed?: boolean) =>
        apiClient.get(`/admin/security/audit-logs/${id}/export${includeSeed ? '?includeSeed=1' : ''}`, true),
      verify: (id: string, includeSeed?: boolean) =>
        apiClient.get<{ valid: boolean; message?: string }>(`/admin/security/audit-logs/${id}/verify${includeSeed ? '?includeSeed=1' : ''}`, true),
      exportDownload: async (p?: { search?: string; severity?: string; action?: string; status?: string; dateRange?: string; includeSeed?: boolean }, format: 'csv' | 'json' = 'csv') => {
        const q = new URLSearchParams();
        if (p?.search) q.set('search', p.search);
        if (p?.severity && p.severity !== 'all') q.set('severity', p.severity);
        if (p?.action && p.action !== 'all') q.set('action', p.action);
        if (p?.status && p.status !== 'all') q.set('status', p.status);
        if (p?.dateRange && p.dateRange !== 'all') q.set('dateRange', p.dateRange);
        if (p?.includeSeed) q.set('includeSeed', '1');
        q.set('format', format);
        const fn = `audit-logs-${new Date().toISOString().slice(0, 10)}.${format === 'csv' ? 'csv' : 'json'}`;
        await apiClient.download(`/admin/security/audit-logs/export?${q}`, fn);
      },
    },
    rateLimits: {
      getList: (p?: { search?: string; status?: string; category?: string; method?: string; enabled?: string; page?: number; limit?: number; includeSeed?: boolean }) => {
        const q = new URLSearchParams();
        if (p?.search) q.set('search', p.search);
        if (p?.status && p.status !== 'all') q.set('status', p.status);
        if (p?.category && p.category !== 'all') q.set('category', p.category);
        if (p?.method && p.method !== 'all') q.set('method', p.method);
        if (p?.enabled && p.enabled !== 'all') q.set('enabled', p.enabled);
        if (p?.page) q.set('page', String(p.page));
        if (p?.limit) q.set('limit', String(p.limit));
        if (p?.includeSeed) q.set('includeSeed', '1');
        return apiClient.get<{ limits: any[]; stats: any; pagination: any }>(`/admin/security/rate-limits?${q}`, true);
      },
      getOne: (id: string, includeSeed?: boolean) =>
        apiClient.get(`/admin/security/rate-limits/${id}${includeSeed ? '?includeSeed=1' : ''}`, true),
      create: (data: { endpoint: string; method: string; limit: number; window: string; description: string; category: string; createdBy: string }) =>
        apiClient.post('/admin/security/rate-limits', data, true),
      update: (id: string, data: { endpoint?: string; method?: string; limit?: number; window?: string; description?: string; category?: string; enabled?: boolean }, includeSeed?: boolean) =>
        apiClient.put(`/admin/security/rate-limits/${id}${includeSeed ? '?includeSeed=1' : ''}`, data, true),
      delete: (id: string, includeSeed?: boolean) =>
        apiClient.delete(`/admin/security/rate-limits/${id}${includeSeed ? '?includeSeed=1' : ''}`, true),
      reset: (id: string, includeSeed?: boolean) =>
        apiClient.post(`/admin/security/rate-limits/${id}/reset`, {}, true),
      exportDownload: async (p?: { search?: string; status?: string; category?: string; method?: string; enabled?: string; includeSeed?: boolean }, format: 'csv' | 'json' = 'csv') => {
        const q = new URLSearchParams();
        if (p?.search) q.set('search', p.search);
        if (p?.status && p.status !== 'all') q.set('status', p.status);
        if (p?.category && p.category !== 'all') q.set('category', p.category);
        if (p?.method && p.method !== 'all') q.set('method', p.method);
        if (p?.enabled && p.enabled !== 'all') q.set('enabled', p.enabled);
        if (p?.includeSeed) q.set('includeSeed', '1');
        q.set('format', format);
        const fn = `rate-limits-${new Date().toISOString().slice(0, 10)}.${format === 'csv' ? 'csv' : 'json'}`;
        await apiClient.download(`/admin/security/rate-limits/export?${q}`, fn);
      },
    },
  },
  // Corporate dashboard endpoints
  corporate: {
    dashboard: {
      get: (period?: string) => {
        const query = period ? `?period=${encodeURIComponent(period)}` : '';
        return apiClient.get(`/corporate/dashboard${query}`, true);
      },
    },
    reports: {
      getAll: (params?: { page?: number; limit?: number; status?: string; reportType?: string; period?: string; search?: string }) => {
        const q = new URLSearchParams();
        if (params?.page) q.set('page', String(params.page));
        if (params?.limit) q.set('limit', String(params.limit));
        if (params?.status && params.status !== 'all') q.set('status', params.status);
        if (params?.reportType && params.reportType !== 'all') q.set('reportType', params.reportType);
        if (params?.period) q.set('period', params.period);
        if (params?.search) q.set('search', params.search);
        return apiClient.get(`/corporate/reports?${q}`, true);
      },
      get: (id: string) => apiClient.get(`/corporate/reports/${id}`, true),
      generate: (data: { reportType?: string; period: string; includeEmissions?: boolean; includeDonations?: boolean; includeVolunteers?: boolean }) => 
        apiClient.post('/corporate/reports/generate', data, true),
      export: (id: string, format: 'json' | 'csv' = 'csv') => {
        if (format === 'csv') {
          return apiClient.download(`/corporate/reports/export/${id}?format=csv`, `esg-report-${id}.csv`);
        }
        return apiClient.get(`/corporate/reports/export/${id}?format=json`, true);
      },
      exportAll: async (filters?: { status?: string; reportType?: string }) => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/corporate/reports/export-all`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(filters || {})
          });

          if (!response.ok) {
            throw new Error('Failed to export reports');
          }

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `all-esg-reports-${new Date().toISOString().split('T')[0]}.csv`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          return { success: true, message: 'Reports exported successfully' };
        } catch (error: any) {
          return { success: false, message: error.message || 'Failed to export reports' };
        }
      },
      delete: (id: string) => apiClient.delete(`/corporate/reports/${id}`, true),
      updateStatus: (id: string, status: 'draft' | 'published' | 'archived') =>
        apiClient.request(`/corporate/reports/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }), requireAuth: true }),
    },
    volunteers: {
      events: {
        getAll: (params?: { page?: number; limit?: number; status?: string; category?: string; search?: string }) => {
          const q = new URLSearchParams();
          if (params?.page) q.set('page', String(params.page));
          if (params?.limit) q.set('limit', String(params.limit));
          if (params?.status && params.status !== 'all') q.set('status', params.status);
          if (params?.category && params.category !== 'all') q.set('category', params.category);
          if (params?.search) q.set('search', params.search);
          return apiClient.get(`/corporate/volunteers/events?${q}`, true);
        },
        get: (id: string) => apiClient.get(`/corporate/volunteers/events/${id}`, true),
        create: (data: { title: string; description?: string; date: string; location: string; category: string; expectedVolunteers?: number; expectedHours?: number }) =>
          apiClient.post('/corporate/volunteers/events', data, true),
        update: (id: string, data: any) => apiClient.put(`/corporate/volunteers/events/${id}`, data, true),
        delete: (id: string) => apiClient.delete(`/corporate/volunteers/events/${id}`, true),
      },
      hours: {
        getAll: (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
          const q = new URLSearchParams();
          if (params?.page) q.set('page', String(params.page));
          if (params?.limit) q.set('limit', String(params.limit));
          if (params?.status && params.status !== 'all') q.set('status', params.status);
          if (params?.search) q.set('search', params.search);
          return apiClient.get(`/corporate/volunteers/hours?${q}`, true);
        },
        create: (data: { volunteerEvent: string; volunteerName: string; volunteerEmail?: string; hours: number; notes?: string }) =>
          apiClient.post('/corporate/volunteers/hours', data, true),
        approve: (id: string) => apiClient.request(`/corporate/volunteers/hours/${id}/approve`, { method: 'PATCH', requireAuth: true }),
        reject: (id: string, reason?: string) => apiClient.request(`/corporate/volunteers/hours/${id}/reject`, { method: 'PATCH', body: JSON.stringify({ reason }), requireAuth: true }),
        bulkApprove: (entryIds: string[]) => apiClient.post('/corporate/volunteers/hours/bulk-approve', { entryIds }, true),
      },
      export: (type: 'events' | 'hours' = 'events') => {
        return apiClient.download(`/corporate/volunteers/export?type=${type}`, `volunteer-${type}-${new Date().toISOString().split('T')[0]}.csv`);
      },
    },
    campaigns: {
      getAll: (params?: { page?: number; limit?: number; status?: string; category?: string; search?: string }) => {
        const q = new URLSearchParams();
        if (params?.page) q.set('page', String(params.page));
        if (params?.limit) q.set('limit', String(params.limit));
        if (params?.status && params.status !== 'all') q.set('status', params.status);
        if (params?.category && params.category !== 'all') q.set('category', params.category);
        if (params?.search) q.set('search', params.search);
        return apiClient.get(`/corporate/campaigns?${q}`, true);
      },
      get: (id: string) => apiClient.get(`/corporate/campaigns/${id}`, true),
      create: (data: { title: string; description?: string; ngoName?: string; category: string; targetAmount: number; startDate: string; endDate?: string }) =>
        apiClient.post('/corporate/campaigns', data, true),
      update: (id: string, data: any) => apiClient.put(`/corporate/campaigns/${id}`, data, true),
      delete: (id: string) => apiClient.delete(`/corporate/campaigns/${id}`, true),
      export: () => {
        return apiClient.download('/corporate/campaigns/export', `campaigns-${new Date().toISOString().split('T')[0]}.csv`);
      },
    },
    emissions: {
      getAll: (params?: { page?: number; limit?: number; category?: string; country?: string; search?: string; startDate?: string; endDate?: string }) => {
        const q = new URLSearchParams();
        if (params?.page) q.set('page', String(params.page));
        if (params?.limit) q.set('limit', String(params.limit));
        if (params?.category && params.category !== 'all') q.set('category', params.category);
        if (params?.country && params.country !== 'all') q.set('country', params.country);
        if (params?.search) q.set('search', params.search);
        if (params?.startDate) q.set('startDate', params.startDate);
        if (params?.endDate) q.set('endDate', params.endDate);
        return apiClient.get(`/corporate/emissions?${q}`, true);
      },
      create: (data: { electricity?: number; fuel?: number; travelDistance?: number; travelFlights?: number; wasteRecycled?: number; country?: string }) =>
        apiClient.post('/corporate/emissions', data, true),
      delete: (id: string) => apiClient.delete(`/corporate/emissions/${id}`, true),
      export: (params?: { category?: string; country?: string; startDate?: string; endDate?: string }) => {
        const q = new URLSearchParams();
        if (params?.category && params.category !== 'all') q.set('category', params.category);
        if (params?.country && params.country !== 'all') q.set('country', params.country);
        if (params?.startDate) q.set('startDate', params.startDate);
        if (params?.endDate) q.set('endDate', params.endDate);
        const query = q.toString();
        return apiClient.download(`/corporate/emissions/export${query ? `?${query}` : ''}`, `emissions-${new Date().toISOString().split('T')[0]}.csv`);
      },
    },
    profileSettings: {
      get: () => apiClient.get('/corporate/profile-settings', true),
      updateProfile: (data: any) => apiClient.put('/corporate/profile-settings/profile', data, true),
      updateSecurity: (data: any) => apiClient.put('/corporate/profile-settings/security', data, true),
      updatePreferences: (data: any) => apiClient.put('/corporate/profile-settings/preferences', data, true),
      updateNotifications: (data: any) => apiClient.put('/corporate/profile-settings/notifications', data, true),
      changePassword: (data: { currentPassword: string; newPassword: string }) =>
        apiClient.post('/corporate/profile-settings/change-password', data, true),
      exportData: () => apiClient.get('/corporate/profile-settings/export', true),
    },
    support: {
      submitContact: (data: { subject: string; message: string }) =>
        apiClient.post('/corporate/support/contact', data, true),
      getContacts: (params?: { page?: number; limit?: number }) => {
        const q = new URLSearchParams();
        if (params?.page) q.set('page', params.page.toString());
        if (params?.limit) q.set('limit', params.limit.toString());
        const query = q.toString();
        return apiClient.get(`/corporate/support/contacts${query ? `?${query}` : ''}`, true);
      },
    },
    employees: {
      getAll: () => apiClient.get('/corporate/employees', true),
      getOne: (id: string) => apiClient.get(`/corporate/employees/${id}`, true),
      create: (data: {
        name: string;
        email: string;
        role: string;
        department: string;
        xpPoints?: number;
        joinDate?: string;
        status?: string;
      }) => apiClient.post('/corporate/employees', data, true),
      update: (id: string, data: {
        name?: string;
        email?: string;
        role?: string;
        department?: string;
        xpPoints?: number;
        joinDate?: string;
        status?: string;
      }) => apiClient.put(`/corporate/employees/${id}`, data, true),
      delete: (id: string) => apiClient.delete(`/corporate/employees/${id}`, true),
      getStats: () => apiClient.get('/corporate/employees/stats/summary', true),
    },
  },
  ngo: {
    dashboard: {
      get: (params?: { timeframe?: '6M' | '12M' | 'All' }) => {
        const q = new URLSearchParams();
        if (params?.timeframe) q.set('timeframe', params.timeframe);
        return apiClient.get(`/ngo/dashboard${q.toString() ? `?${q}` : ''}`, true);
      },
    },
    details: {
      get: () => apiClient.get('/ngo/details', true),
      update: (data: {
        organizationName: string;
        registrationNumber: string;
        establishedDate?: string;
        location?: string;
        contactEmail?: string;
        contactPhone?: string;
        website?: string;
        mission?: string;
        focusAreas?: string[];
        certifications?: string[];
        teamSize?: number;
        annualBudget?: number;
        impactMetrics?: {
          treesPlanted?: number;
          carbonOffset?: number;
          communitiesImpacted?: number;
          hectaresRestored?: number;
        };
      }) => apiClient.put('/ngo/details', data, true),
    },
    personDetails: {
      get: () => apiClient.get('/ngo/person-details', true),
      update: (data: {
        name: string;
        role?: string;
        email?: string;
        phone?: string;
        bio?: string;
        expertise?: string[];
        education?: Array<{ degree: string; institution: string; year?: string }>;
        projectsLed?: number;
        yearsExperience?: number;
        publications?: number;
        awards?: string[];
        socialLinks?: {
          linkedin?: string;
          researchGate?: string;
          twitter?: string;
          website?: string;
        };
      }) => apiClient.put('/ngo/person-details', data, true),
    },
    projects: {
      create: (data: {
        projectName: string;
        category: string;
        description: string;
        longDescription?: string;
        location: string;
        fundingGoal: number;
        minInvestment?: number;
        duration?: string;
        carbonImpact?: string;
        carbonCreditsPerHundred?: number;
      }) => apiClient.post('/ngo/projects', data, true),
      get: (params?: { status?: string; page?: number; limit?: number }) => {
        const q = new URLSearchParams();
        if (params?.status && params.status !== 'all') q.set('status', params.status);
        if (params?.page) q.set('page', String(params.page));
        if (params?.limit) q.set('limit', String(params.limit));
        return apiClient.get(`/ngo/projects?${q}`, true);
      },
      getOne: (id: string) => apiClient.get(`/ngo/projects/${id}`, true),
      update: (id: string, data: {
        projectName?: string;
        category?: string;
        description?: string;
        longDescription?: string;
        location?: string;
        fundingGoal?: number;
        minInvestment?: number;
        duration?: string;
        carbonImpact?: string;
        carbonCreditsPerHundred?: number;
      }) => apiClient.put(`/ngo/projects/${id}`, data, true),
    },
    wallet: {
      get: () => apiClient.get('/ngo/wallet', true),
      withdraw: (data: { amount: number; bankAccount: string }) =>
        apiClient.post('/ngo/wallet/withdraw', data, true),
      getTransactions: (params?: { page?: number; limit?: number; type?: string; status?: string }) => {
        const q = new URLSearchParams();
        if (params?.page) q.set('page', String(params.page));
        if (params?.limit) q.set('limit', String(params.limit));
        if (params?.type && params.type !== 'all') q.set('type', params.type);
        if (params?.status && params.status !== 'all') q.set('status', params.status);
        return apiClient.get(`/ngo/wallet/transactions?${q}`, true);
      },
      getWithdrawalRequests: (params?: { page?: number; limit?: number; status?: string }) => {
        const q = new URLSearchParams();
        if (params?.page) q.set('page', String(params.page));
        if (params?.limit) q.set('limit', String(params.limit));
        if (params?.status && params.status !== 'all') q.set('status', params.status);
        return apiClient.get(`/ngo/wallet/withdrawal-requests?${q}`, true);
      },
      exportReport: (format: 'csv' | 'json' = 'csv') => {
        return apiClient.download(`/ngo/wallet/export?format=${format}`, `ngo-wallet-report-${new Date().toISOString().split('T')[0]}.${format}`);
      },
    },
  },
  // Simple User Dashboard endpoints
  dashboard: {
    getStats: () => apiClient.get('/dashboard/stats', true),
    getInvestments: (params?: { status?: string; limit?: number; skip?: number }) => {
      const q = new URLSearchParams();
      if (params?.status) q.set('status', params.status);
      if (params?.limit) q.set('limit', String(params.limit));
      if (params?.skip) q.set('skip', String(params.skip));
      return apiClient.get(`/dashboard/investments?${q}`, true);
    },
    getMonthlyAnalytics: (params?: { months?: number }) => {
      const q = new URLSearchParams();
      if (params?.months) q.set('months', String(params.months));
      return apiClient.get(`/dashboard/analytics/monthly?${q}`, true);
    },
    getPortfolioDistribution: () => apiClient.get('/dashboard/analytics/portfolio-distribution', true),
    getTopProjects: (params?: { limit?: number }) => {
      const q = new URLSearchParams();
      if (params?.limit) q.set('limit', String(params.limit));
      return apiClient.get(`/dashboard/analytics/top-projects?${q}`, true);
    },
    createInvestment: (data: { projectId: string; amount: number; notes?: string }) =>
      apiClient.post('/dashboard/investments', data, true),
  },
  // Simple User Wallet endpoints
  wallet: {
    get: () => apiClient.get('/wallet', true),
    addFunds: (data: { amount: number }) =>
      apiClient.post('/wallet/add-funds', data, true),
    withdraw: (data: { amount: number; bankAccount: string }) =>
      apiClient.post('/wallet/withdraw', data, true),
    getTransactions: (params?: { page?: number; limit?: number; type?: string; status?: string }) => {
      const q = new URLSearchParams();
      if (params?.page) q.set('page', String(params.page));
      if (params?.limit) q.set('limit', String(params.limit));
      if (params?.type && params.type !== 'all') q.set('type', params.type);
      if (params?.status && params.status !== 'all') q.set('status', params.status);
      return apiClient.get(`/wallet/transactions?${q}`, true);
    },
    getWithdrawalRequests: (params?: { page?: number; limit?: number; status?: string }) => {
      const q = new URLSearchParams();
      if (params?.page) q.set('page', String(params.page));
      if (params?.limit) q.set('limit', String(params.limit));
      if (params?.status && params.status !== 'all') q.set('status', params.status);
      return apiClient.get(`/wallet/withdrawal-requests?${q}`, true);
    },
  },
  // Simple User Activities endpoints
  activities: {
    getTypes: () => apiClient.get('/activities/types', true),
    getStats: () => apiClient.get('/activities/stats', true),
    get: (params?: { status?: string; limit?: number; skip?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }) => {
      const q = new URLSearchParams();
      if (params?.status && params.status !== 'all') q.set('status', params.status);
      if (params?.limit) q.set('limit', String(params.limit));
      if (params?.skip) q.set('skip', String(params.skip));
      if (params?.sortBy) q.set('sortBy', params.sortBy);
      if (params?.sortOrder) q.set('sortOrder', params.sortOrder);
      return apiClient.get(`/activities?${q}`, true);
    },
    getOne: (id: string) => apiClient.get(`/activities/${id}`, true),
    create: (formData: FormData) => {
      const token = getAuthToken();
      const headers: HeadersInit = {};
      if (token && isTokenValid(token)) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      return fetch(`${API_BASE_URL}/activities`, {
        method: 'POST',
        headers,
        body: formData
      }).then(async (response) => {
        const contentType = response.headers.get('content-type');
        let data: any = {};
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          try {
            data = JSON.parse(text);
          } catch {
            data = { message: text || `HTTP Error: ${response.status}` };
          }
        }
        if (!response.ok) {
          if (response.status === 401) {
            clearAuthData();
            if (typeof window !== 'undefined') {
              window.location.href = '/auth';
            }
            return {
              success: false,
              message: 'Authentication required. Please login again.',
              error: 'Unauthorized',
            };
          }
          return {
            success: false,
            message: data.message || `HTTP Error: ${response.status}`,
            errors: data.errors,
            error: data.error || `HTTP ${response.status}`,
          };
        }
        return {
          success: true,
          data: data.data,
          message: data.message,
        };
      });
    },
  },
  // Payment endpoints
  payment: {
    createPaymentIntent: (data: { productId?: string; amount: number; productName: string }) =>
      apiClient.post('/payment/create-payment-intent', data, true),
    getStatus: (paymentIntentId: string) =>
      apiClient.get(`/payment/status/${paymentIntentId}`, true),
    getHistory: (params?: { page?: number; limit?: number; status?: string }) => {
      const q = new URLSearchParams();
      if (params?.page) q.set('page', String(params.page));
      if (params?.limit) q.set('limit', String(params.limit));
      if (params?.status && params.status !== 'all') q.set('status', params.status);
      return apiClient.get(`/payment/history?${q}`, true);
    },
  },
  // Public endpoints (no authentication required)
  public: {
    projects: {
      get: (params?: { category?: string; featured?: boolean; search?: string; limit?: number }) => {
        const q = new URLSearchParams();
        if (params?.category) q.set('category', params.category);
        if (params?.featured !== undefined) q.set('featured', String(params.featured));
        if (params?.search) q.set('search', params.search);
        if (params?.limit) q.set('limit', String(params.limit));
        return apiClient.get(`/public/projects?${q}`, false);
      },
      getOne: (id: string) => apiClient.get(`/public/projects/${id}`, false),
    },
    products: {
      get: (params?: { category?: string; featured?: boolean; badge?: string; search?: string; limit?: number }) => {
        const q = new URLSearchParams();
        if (params?.category) q.set('category', params.category);
        if (params?.featured !== undefined) q.set('featured', String(params.featured));
        if (params?.badge) q.set('badge', params.badge);
        if (params?.search) q.set('search', params.search);
        if (params?.limit) q.set('limit', String(params.limit));
        return apiClient.get(`/public/products?${q}`, false);
      },
      getOne: (id: string) => apiClient.get(`/public/products/${id}`, false),
    },
  },
};
