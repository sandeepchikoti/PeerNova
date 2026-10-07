const BASE_URL = '/api';

/**
 * Custom HTTP Client wrapper with automatic JWT header injection and error handling.
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('peernova_token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const text = await response.text();
    let result;
    try {
      result = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(text || `Server returned status ${response.status}`);
    }

    if (!response.ok || (result.success !== undefined && !result.success)) {
      throw new Error(result.message || text || `Request failed with status ${response.status}`);
    }

    return result.data !== undefined ? result.data : result;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

export const api = {
  // Auth APIs
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getCurrentUser: () => request('/auth/me', { method: 'GET' }),

  // Student Profile APIs
  getStudentProfile: () => request('/student/profile', { method: 'GET' }),
  updateStudentProfile: (data) => request('/student/profile', { method: 'PUT', body: JSON.stringify(data) }),
  getStudentDashboardSummary: () => request('/student/dashboard-summary', { method: 'GET' }),

  // Phase 2: Skills & Discovery APIs
  getSkillCategories: () => request('/skills/categories', { method: 'GET' }),
  getStudentSkills: () => request('/student/skills', { method: 'GET' }),
  addStudentSkill: (data) => request('/student/skills', { method: 'POST', body: JSON.stringify(data) }),
  removeStudentSkill: (skillId) => request(`/student/skills/${skillId}`, { method: 'DELETE' }),

  discoverStudents: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append('search', params.search);
    if (params.category) searchParams.append('category', params.category);
    if (params.skillName) searchParams.append('skillName', params.skillName);
    if (params.skillType) searchParams.append('skillType', params.skillType);
    if (params.proficiency) searchParams.append('proficiency', params.proficiency);
    if (params.college) searchParams.append('college', params.college);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return request(`/discovery/students${query}`, { method: 'GET' });
  },

  // Phase 3: Matching & Connections APIs
  getSkillMatches: () => request('/matching/peers', { method: 'GET' }),

  // Phase 4: AI/ML Personalized Recommendation API
  getPersonalizedRecommendations: () => request('/recommendations/personalized', { method: 'GET' }),

  sendConnectionRequest: (data) => request('/connections/request', { method: 'POST', body: JSON.stringify(data) }),
  respondToConnectionRequest: (connectionId, status) => 
    request(`/connections/${connectionId}/respond`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  getPendingReceivedConnections: () => request('/connections/pending', { method: 'GET' }),
  getPendingSentConnections: () => request('/connections/sent', { method: 'GET' }),
  getActiveConnections: () => request('/connections/active', { method: 'GET' }),

  // Phase 5: Real-Time Chat & Messaging APIs
  getChatConversations: () => request('/chat/conversations', { method: 'GET' }),
  getChatHistory: (connectionId) => request(`/chat/history/${connectionId}`, { method: 'GET' }),
  sendChatMessage: (data) => request('/chat/send', { method: 'POST', body: JSON.stringify(data) }),
  markChatAsRead: (connectionId) => request(`/chat/read/${connectionId}`, { method: 'PUT' }),
  getUnreadChatCount: () => request('/chat/unread-count', { method: 'GET' }),

  // Admin APIs
  getAdminDashboardStats: () => request('/admin/dashboard-stats', { method: 'GET' }),
  getAdminStudents: (search = '', status = '') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    const query = params.toString() ? `?${params.toString()}` : '';
    return request(`/admin/students${query}`, { method: 'GET' });
  },
  getAdminStudentById: (id) => request(`/admin/students/${id}`, { method: 'GET' }),
  verifyStudentProfile: (id, status, remark = '') => 
    request(`/admin/students/${id}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ status, remark }),
    }),
};
