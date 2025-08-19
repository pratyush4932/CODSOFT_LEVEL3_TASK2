import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
    }
    
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('projectManagerUser');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getUserInfo: async (token) => {
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      if (tokenPayload.id) {
        const response = await api.get(`/auth/user/${tokenPayload.id}`);
        return response.data;
      }
      throw new Error('Could not extract user ID from token');
    } catch (error) {
      throw error;
    }
  },

  getUser: async (userId) => {
    const response = await api.get(`/auth/user/${userId}`);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('projectManagerUser');
  },

  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },
};

export const projectsAPI = {
  createProject: async (projectData) => {
    const response = await api.post('/proj/create', projectData);
    return response.data;
  },

  getUserProjects: async (userId) => {
    const response = await api.get(`/proj/${userId}/projects`);
    return response.data;
  },

  getProject: async (userId, projectId) => {
    const response = await api.get(`/proj/${userId}/projects/${projectId}`);
    return response.data;
  },

  updateProjectTitle: async (userId, projectId, name) => {
    const response = await api.put(`/proj/${userId}/projects/${projectId}/title`, { name });
    return response.data;
  },

  updateProjectDescription: async (userId, projectId, description) => {
    const response = await api.put(`/proj/${userId}/projects/${projectId}/description`, { description });
    return response.data;
  },

  updateProjectStartDate: async (userId, projectId, startDate) => {
    const response = await api.put(`/proj/${userId}/projects/${projectId}/start-date`, { startDate });
    return response.data;
  },

  updateProjectEndDate: async (userId, projectId, endDate) => {
    const response = await api.put(`/proj/${userId}/projects/${projectId}/end-date`, { endDate });
    return response.data;
  },

  updateProjectStatus: async (userId, projectId, status) => {
    const response = await api.put(`/proj/${userId}/projects/${projectId}/status`, { status });
    return response.data;
  },

  deleteProject: async (userId, projectId) => {
    const response = await api.delete(`/proj/${userId}/projects/${projectId}`);
    return response.data;
  },
};

export const tasksAPI = {
  createTask: async (taskData) => {
    const response = await api.post('/task/create', taskData);
    return response.data;
  },

  getProjectTasks: async (userId, projectId) => {
    const response = await api.get(`/task/${userId}/projects/${projectId}/tasks`);
    return response.data;
  },

  getTask: async (userId, projectId, taskId) => {
    const response = await api.get(`/task/${userId}/projects/${projectId}/tasks/${taskId}`);
    return response.data;
  },

  updateTaskStatus: async (updateData) => {
    const userId = updateData.userID || updateData.userId;
    const projectId = updateData.projectID || updateData.projectId;
    const taskId = updateData.taskID || updateData.taskId;
    const status = updateData.status;
    try {
      const res = await api.put(`/task/${userId}/projects/${projectId}/tasks/${taskId}/status`, { status });
      return res.data;
    } catch (e1) {
      if (e1?.response?.status !== 404) throw e1;
      const payload = { userID: userId, projectID: projectId, taskID: taskId, status };
      const res2 = await api.put('/task/update-status', payload);
      return res2.data;
    }
  },

  updateTask: async (userId, projectId, taskId, updateData) => {
    const payload = {
      userID: userId,
      projectID: projectId,
      taskID: taskId,
      taskData: updateData,
    };
    try {
      const res1 = await api.put('/task/update-task', payload);
      return res1.data;
    } catch (e1) {
      if (e1?.response?.status !== 404) throw e1;
      try {
        const res2 = await api.put('/task/update', payload);
        return res2.data;
      } catch (e2) {
        if (e2?.response?.status !== 404) throw e2;
        try {
          const res3 = await api.put(`/task/${userId}/projects/${projectId}/tasks/${taskId}`, updateData);
          return res3.data;
        } catch (e3) {
          const results = {};
          if (typeof updateData.title === 'string') {
            results.title = await tasksAPI.updateTaskTitle(userId, projectId, taskId, updateData.title);
          }
          if (typeof updateData.description === 'string') {
            results.description = await tasksAPI.updateTaskDescription(userId, projectId, taskId, updateData.description);
          }
          if (typeof updateData.assignTo === 'string') {
            results.assignTo = await tasksAPI.updateTaskAssignTo(userId, projectId, taskId, updateData.assignTo);
          }
          if (typeof updateData.startDate === 'string') {
            results.startDate = await tasksAPI.updateTaskStartDate(userId, projectId, taskId, updateData.startDate);
          }
          if (typeof updateData.endDate === 'string') {
            results.endDate = await tasksAPI.updateTaskEndDate(userId, projectId, taskId, updateData.endDate);
          }
          if (typeof updateData.status === 'string') {
            await tasksAPI.updateTaskStatus({ userID: userId, projectID: projectId, taskID: taskId, status: updateData.status });
            results.status = { status: updateData.status };
          }
          return results;
        }
      }
    }
  },

  updateTaskTitle: async (userId, projectId, taskId, title) => {
    const response = await api.put(`/task/${userId}/projects/${projectId}/tasks/${taskId}/title`, { title });
    return response.data;
  },

  updateTaskDescription: async (userId, projectId, taskId, description) => {
    const response = await api.put(`/task/${userId}/projects/${projectId}/tasks/${taskId}/description`, { description });
    return response.data;
  },

  updateTaskAssignTo: async (userId, projectId, taskId, assignTo) => {
    const response = await api.put(`/task/${userId}/projects/${projectId}/tasks/${taskId}/assign`, { assignTo });
    return response.data;
  },

  updateTaskStartDate: async (userId, projectId, taskId, startDate) => {
    const response = await api.put(`/task/${userId}/projects/${projectId}/tasks/${taskId}/start-date`, { startDate });
    return response.data;
  },

  updateTaskEndDate: async (userId, projectId, taskId, endDate) => {
    const response = await api.put(`/task/${userId}/projects/${projectId}/tasks/${taskId}/end-date`, { endDate });
    return response.data;
  },

  deleteTask: async (userId, projectId, taskId) => {
    const response = await api.delete(`/task/${userId}/projects/${projectId}/tasks/${taskId}`);
    return response.data;
  },
};

export const aiAPI = {
  generateTasks: async (goal) => {
    try {
      const mockResponse = await generateMockAITasks(goal);
      return mockResponse;
    } catch (error) {
      console.error('Error generating AI tasks:', error);
      throw error;
    }
  },
};

const generateMockAITasks = async (goal) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const mockTasks = [
    { content: `Research ${goal} requirements and specifications` },
    { content: `Create initial project plan for ${goal}` },
    { content: `Set up development environment for ${goal}` },
    { content: `Design user interface mockups for ${goal}` },
    { content: `Implement core functionality for ${goal}` }
  ];
  
  return mockTasks;
};

export const getAuthToken = () => {
  return localStorage.getItem('jwt_token');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/health');
    return true;
  } catch (error) {
    return false;
  }
};

export const checkBackendSimple = async () => {
  try {
    const response = await api.get('/');
    return true;
  } catch (error) {
    if (error.response && typeof error.response.status === 'number') {
      return true;
    }
    return false;
  }
};

export default api;