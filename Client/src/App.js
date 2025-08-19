import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import NewProjectModal from './components/NewProjectModal';
import EditProjectModal from './components/EditProjectModal';
import NewTaskModal from './components/NewTaskModal';
import AITaskModal from './components/AITaskModal';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import { authAPI, projectsAPI, tasksAPI, aiAPI, isAuthenticated, checkBackendHealth, checkBackendSimple } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticatedState] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('unknown');

  const clearLocalStorage = () => {
    try {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('projectManagerUser');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  const storeUserData = (token, userData) => {
    try {
      if (token && userData) {
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('projectManagerUser', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error storing user data in localStorage:', error);
      return false;
    }
  };

  const clearStorageForDevelopment = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Clearing localStorage for development...');
      clearLocalStorage();
      window.location.reload();
    }
  };

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const isHealthy = await checkBackendHealth();
        if (isHealthy) {
          setBackendStatus('connected');
          console.log('Backend server is connected');
        } else {
          setBackendStatus('disconnected');
          console.warn('Backend server is not reachable. Some features may not work.');
        }
      } catch (error) {
        setBackendStatus('disconnected');
        console.error('Error checking backend health:', error);
        console.log('Continuing with app functionality despite backend check failure...');
      }
    };
    checkBackend().catch(() => {
      console.log('Backend health check failed, but app continues to function');
      setBackendStatus('unknown');
    });
    const token = localStorage.getItem('jwt_token');
    const savedUser = localStorage.getItem('projectManagerUser');
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        if (userData && userData._id && userData.email) {
          setUser(userData);
          setIsAuthenticatedState(true);
          loadUserProjects(userData._id);
        } else {
          clearLocalStorage();
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        clearLocalStorage();
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && tasks.length > 0) {
      checkOverdueTasks();
      const interval = setInterval(checkOverdueTasks, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, tasks]);

  const loadUserProjects = async (userId) => {
    try {
      setIsLoading(true);
      console.log('Loading projects for user:', userId);
      const projectsData = await projectsAPI.getUserProjects(userId);
      console.log('Raw projects data from API:', projectsData);
      console.log('Number of projects received:', projectsData?.length || 0);
      if (!projectsData || projectsData.length === 0) {
        console.log('No projects found for user');
        setProjects([]);
        setTasks([]);
        return;
      }
      console.log('First project structure:', projectsData[0] ? JSON.stringify(projectsData[0], null, 2) : 'No projects');
      const normalizedProjects = projectsData.map(project => {
        console.log('Processing project:', project);
        if (project && !project._id) {
          if (project.id) {
            console.log('Converting project.id to _id:', project.id);
            return { ...project, _id: project.id };
          } else if (project.projectId) {
            console.log('Converting project.projectId to _id:', project.projectId);
            return { ...project, _id: project.projectId };
          } else {
            console.error('Project missing ID field:', project);
            console.error('Available fields:', Object.keys(project));
            return null;
          }
        }
        return project;
      }).filter(Boolean);
      console.log('Normalized projects:', normalizedProjects);
      console.log('Number of normalized projects:', normalizedProjects.length);
      setProjects(normalizedProjects);
      const allTasks = [];
      for (const project of normalizedProjects) {
        try {
          if (project._id) {
            console.log(`Loading tasks for project ${project._id} (${project.name})`);
            const projectTasks = await tasksAPI.getProjectTasks(userId, project._id);
            console.log(`Loaded ${projectTasks.length} tasks for project ${project._id}`);
            const tasksWithProjectId = projectTasks.map(task => ({
              ...task,
              projectId: project._id,
              projectID: project._id,
              project_id: project._id
            }));
            console.log(`Enhanced ${tasksWithProjectId.length} tasks with project ID:`, project._id);
            allTasks.push(...tasksWithProjectId);
          } else {
            console.error('Project missing ID after normalization:', project);
          }
        } catch (error) {
          console.error(`Error loading tasks for project ${project._id}:`, error);
        }
      }
      console.log('Total tasks loaded:', allTasks.length);
      console.log('Sample task structure:', allTasks[0] ? JSON.stringify(allTasks[0], null, 2) : 'No tasks');
      setTasks(allTasks);
    } catch (error) {
      console.error('Error loading projects:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryBackend = async () => {
    try {
      setBackendStatus('unknown');
      let isHealthy = await checkBackendHealth();
      if (!isHealthy) {
        isHealthy = await checkBackendSimple();
      }
      if (isHealthy) {
        setBackendStatus('connected');
        console.log('Backend connection restored');
        if (user && user._id) {
          console.log('Reloading projects after backend reconnection...');
          await loadUserProjects(user._id);
        }
      } else {
        setBackendStatus('disconnected');
        console.warn('Backend still not reachable');
      }
    } catch (error) {
      setBackendStatus('disconnected');
      console.error('Backend retry failed:', error);
    }
  };

  const handleRefreshProjects = async () => {
    if (user && user._id) {
      console.log('Manually refreshing projects...');
      await loadUserProjects(user._id);
    }
  };

  const handleLogin = async (userData) => {
    try {
      console.log('Handling login for user:', userData);
      if (!userData || !userData._id || !userData.email) {
        console.error('Invalid user data received:', userData);
        return;
      }
      setUser(userData);
      setIsAuthenticatedState(true);
      setAuthView('login');
      console.log('User authenticated, loading projects...');
      await loadUserProjects(userData._id);
      console.log('Projects loaded successfully');
    } catch (error) {
      console.error('Error in handleLogin:', error);
      clearLocalStorage();
    }
  };

  const handleLogout = () => {
    try {
      authAPI.logout();
      setUser(null);
      setIsAuthenticatedState(false);
      setProjects([]);
      setTasks([]);
      setCurrentView('dashboard');
      setSelectedProject(null);
    } catch (error) {
      console.error('Error in handleLogout:', error);
      setUser(null);
      setIsAuthenticatedState(false);
      setProjects([]);
      setTasks([]);
      setCurrentView('dashboard');
      setSelectedProject(null);
    }
  };

  const handleRegisterSuccess = (data) => {
    setShowEmailVerification(true);
    setVerificationEmail(data.email);
    setAuthView('login');
  };

  const switchAuthView = (view) => {
    setAuthView(view);
    setShowEmailVerification(false);
  };

  const calculateProjectProgress = (projectId) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId || task.projectID === projectId || task.project_id === projectId);
    if (projectTasks.length === 0) return 0;
    const completedTasks = projectTasks.filter(task => task.status === 'done').length;
    return Math.round((completedTasks / projectTasks.length) * 100);
  };

  const calculateProjectDates = (projectId) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId || task.projectID === projectId || task.project_id === projectId);
    if (projectTasks.length === 0) return { startDate: null, endDate: null };
    const dates = projectTasks.map(task => new Date(task.startDate || task.endDate));
    const startDate = new Date(Math.min(...dates));
    const endDate = new Date(Math.max(...dates));
    return { startDate, endDate };
  };

  const checkOverdueTasks = () => {
    const currentDate = new Date();
    const updatedTasks = tasks.map(task => {
      if (task.status !== 'done' && task.endDate && new Date(task.endDate) < currentDate) {
        return { ...task, status: 'overdue' };
      }
      return task;
    });
    if (JSON.stringify(updatedTasks) !== JSON.stringify(tasks)) {
      setTasks(updatedTasks);
    }
  };

  const refreshProjectTasks = async (projectId) => {
    try {
      if (!user || !user._id || !projectId) return;
      const fetched = await tasksAPI.getProjectTasks(user._id, projectId);
      const tasksWithProjectId = (fetched || []).map(task => ({
        ...task,
        projectId: projectId,
        projectID: projectId,
        project_id: projectId,
      }));
      setTasks(prev => {
        const others = prev.filter(t => (t.projectId !== projectId && t.projectID !== projectId && t.project_id !== projectId));
        return [...others, ...tasksWithProjectId];
      });
    } catch (err) {
      console.error('Failed to refresh project tasks:', err);
    }
  };

  const handleAddProject = async (projectData) => {
    try {
      console.log('Creating project with data:', projectData);
      console.log('Current user:', user);
      console.log('User ID:', user?._id);
      if (!user || !user._id) {
        throw new Error('User not authenticated or missing user ID');
      }
      const projectPayload = {
        userID: user._id,
        projectData: {
          name: projectData.name,
          description: projectData.description,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'active'
        }
      };
      console.log('Project payload formatted for backend:', projectPayload);
      try {
        const newProject = await projectsAPI.createProject(projectPayload);
        console.log('New project created:', newProject);
        console.log('New project structure:', JSON.stringify(newProject, null, 2));
        let created = newProject;
        if (created && created.project && typeof created.project === 'object') {
          console.log('Unwrapping response.project');
          created = created.project;
        } else if (created && created.data && created.data.project) {
          console.log('Unwrapping response.data.project');
          created = created.data.project;
        }
        const derivedId = created?._id || created?.id || created?.projectId || created?.insertedId || created?._doc?._id;
        if (!derivedId) {
          console.warn('Created project response missing ID. Falling back to full refresh. Response keys:', created ? Object.keys(created) : Object.keys(newProject || {}));
          await loadUserProjects(user._id);
          setShowNewProjectModal(false);
          return;
        }
        const projectWithId = { ...created, _id: derivedId };
        console.log('Project with ID:', projectWithId);
        setProjects(prev => [...prev, projectWithId]);
        setShowNewProjectModal(false);
      } catch (apiError) {
        console.error('API Error details:', {
          message: apiError.message,
          response: apiError.response?.data,
          status: apiError.response?.status,
          config: apiError.config
        });
        if (apiError.message === 'Network Error') {
          throw new Error('Cannot connect to server. Please check if the backend is running on http://localhost:8080');
        }
        if (apiError.response?.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        if (apiError.response?.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
        if (apiError.response?.status === 400) {
          const errorMessage = apiError.response?.data?.message || 'Invalid project data';
          throw new Error(errorMessage);
        }
        throw new Error(apiError.response?.data?.message || apiError.message || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      const errorMessage = error.message || 'An unexpected error occurred';
      alert(`Failed to create project: ${errorMessage}`);
    }
  };

  const handleEditProject = (project) => {
    console.log('Opening edit modal for project:', project);
    console.log('Project ID:', project._id);
    console.log('Project structure:', JSON.stringify(project, null, 2));
    setEditingProject(project);
    setShowEditProjectModal(true);
  };

  const handleUpdateProject = async (projectId, updateData) => {
    try {
      console.log('Updating project:', projectId, 'with data:', updateData);
      console.log('Current projects:', projects);
      console.log('Looking for project with ID:', projectId);
      const currentProject = projects.find(p => p._id === projectId);
      console.log('Current project found:', currentProject);
      if (!currentProject) {
        throw new Error(`Project with ID ${projectId} not found`);
      }
      if (!user || !user._id) {
        throw new Error('User not authenticated or missing user ID');
      }
      const updates = [];
      if (updateData.name !== currentProject.name) {
        updates.push(projectsAPI.updateProjectTitle(user._id, projectId, updateData.name));
      }
      if (updateData.description !== currentProject.description) {
        updates.push(projectsAPI.updateProjectDescription(user._id, projectId, updateData.description));
      }
      if (updateData.startDate !== currentProject.startDate) {
        updates.push(projectsAPI.updateProjectStartDate(user._id, projectId, updateData.startDate));
      }
      if (updateData.endDate !== currentProject.endDate) {
        updates.push(projectsAPI.updateProjectEndDate(user._id, projectId, updateData.endDate));
      }
      if (updateData.status !== currentProject.status) {
        updates.push(projectsAPI.updateProjectStatus(user._id, projectId, updateData.status));
      }
      if (updates.length > 0) {
        await Promise.all(updates);
        setProjects(projects.map(project => project._id === projectId ? { ...project, ...updateData } : project));
        console.log('Project updated successfully');
      } else {
        console.log('No updates needed');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      console.log('Deleting project:', projectId);
      console.log('Project ID type:', typeof projectId);
      console.log('Project ID value:', projectId);
      console.log('Current projects:', projects);
      if (!user || !user._id) {
        throw new Error('User not authenticated or missing user ID');
      }
      await projectsAPI.deleteProject(user._id, projectId);
      setProjects(projects.filter(project => project._id !== projectId));
      setTasks(tasks.filter(task => task.projectId !== projectId && task.projectID !== projectId && task.project_id !== projectId));
      if (selectedProject && selectedProject._id === projectId) {
        setSelectedProject(null);
        setCurrentView('dashboard');
      }
      console.log('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert(`Failed to delete project: ${error.message}`);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const taskPayload = {
        userID: user._id,
        projectID: selectedProject._id,
        taskData: {
          title: taskData.title,
          description: taskData.description,
          assignTo: taskData.assignTo || 'Unassigned',
          startDate: taskData.startDate || new Date().toISOString().split('T')[0],
          endDate: taskData.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: taskData.status || 'to-do'
        }
      };
      console.log('Creating task with payload:', JSON.stringify(taskPayload, null, 2));
      console.log('User ID:', user._id);
      console.log('Project ID:', selectedProject._id);
      const newTask = await tasksAPI.createTask(taskPayload);
      console.log('Task created successfully:', newTask);
      console.log('New task structure:', JSON.stringify(newTask, null, 2));
      console.log('New task status:', newTask.status);
      const taskWithProjectId = {
        ...newTask,
        projectId: selectedProject._id,
        projectID: selectedProject._id,
        project_id: selectedProject._id
      };
      console.log('Task with project ID:', taskWithProjectId);
      setTasks(prev => [...prev, taskWithProjectId]);
      await refreshProjectTasks(selectedProject._id);
      setShowNewTaskModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      const errorMessage = error.response?.data?.msg || error.response?.data?.message || error.message || 'Failed to create task';
      alert(`Failed to create task: ${errorMessage}`);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const updates = [];
      if (typeof taskData.title === 'string' && taskData.title !== editingTask.title) {
        updates.push(tasksAPI.updateTaskTitle(user._id, selectedProject._id, editingTask._id, taskData.title));
      }
      if (typeof taskData.description === 'string' && taskData.description !== editingTask.description) {
        updates.push(tasksAPI.updateTaskDescription(user._id, selectedProject._id, editingTask._id, taskData.description));
      }
      if (typeof taskData.assignTo === 'string' && taskData.assignTo !== editingTask.assignTo) {
        updates.push(tasksAPI.updateTaskAssignTo(user._id, selectedProject._id, editingTask._id, taskData.assignTo));
      }
      if (typeof taskData.startDate === 'string' && taskData.startDate !== editingTask.startDate) {
        updates.push(tasksAPI.updateTaskStartDate(user._id, selectedProject._id, editingTask._id, taskData.startDate));
      }
      if (typeof taskData.endDate === 'string' && taskData.endDate !== editingTask.endDate) {
        updates.push(tasksAPI.updateTaskEndDate(user._id, selectedProject._id, editingTask._id, taskData.endDate));
      }
      if (typeof taskData.status === 'string' && taskData.status !== editingTask.status) {
        updates.push(tasksAPI.updateTaskStatus({ userID: user._id, projectID: selectedProject._id, taskID: editingTask._id, status: taskData.status }));
      }
      if (updates.length > 0) {
        await Promise.all(updates);
      }
      await refreshProjectTasks(selectedProject._id);
      setEditingTask(null);
      setShowNewTaskModal(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await tasksAPI.deleteTask(user._id, selectedProject._id, taskId);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await tasksAPI.updateTaskStatus({
        userId: user._id,
        projectId: selectedProject._id,
        taskId,
        status: newStatus
      });
      setTasks(tasks.map(task => task._id === taskId ? { ...task, status: newStatus } : task));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleAITaskGeneration = async (goal) => {
    try {
      const response = await aiAPI.generateTasks(goal);
      return response;
    } catch (error) {
      console.error('Error generating AI tasks:', error);
      return [];
    }
  };

  const handleAddAITasks = async (selectedTasks) => {
    try {
      const newTasks = [];
      for (const task of selectedTasks) {
        const newTask = await tasksAPI.createTask({
          userID: user._id,
          projectID: selectedProject._id,
          taskData: {
            title: task.content,
            description: task.content,
            assignTo: 'Unassigned',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'to-do'
          }
        });
        const taskWithProjectId = {
          ...newTask,
          projectId: selectedProject._id,
          projectID: selectedProject._id,
          project_id: selectedProject._id
        };
        newTasks.push(taskWithProjectId);
      }
      setTasks(prev => [...prev, ...newTasks]);
      await refreshProjectTasks(selectedProject._id);
      setShowAIModal(false);
    } catch (error) {
      console.error('Error adding AI tasks:', error);
    }
  };

  const navigateToProject = (project) => {
    setSelectedProject(project);
    setCurrentView('kanban');
  };

  const navigateToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedProject(null);
  };

  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setShowNewTaskModal(true);
  };

  // Show email verification message
  if (showEmailVerification) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient-primary">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
              <div className="card shadow-lg border-0">
                <div className="card-body p-5 text-center">
                  <div className="d-inline-flex align-items-center justify-content-center bg-success bg-gradient text-white rounded-circle mb-3" style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-check-lg fs-3"></i>
                  </div>
                  <h4 className="fw-bold text-success mb-3">Registration Successful!</h4>
                  <p className="text-muted mb-4">
                    We've sent a verification email to <strong>{verificationEmail}</strong>. 
                    Please check your inbox and click the verification link to activate your account.
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowEmailVerification(false)}
                  >
                    Continue to Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, show auth pages
  if (!isAuthenticated) {
    if (authView === 'register') {
      return (
        <RegisterPage 
          onSwitchToLogin={() => switchAuthView('login')}
          onRegisterSuccess={handleRegisterSuccess}
        />
      );
    }
    
    return (
      <LoginPage 
        onLogin={handleLogin}
        onSwitchToRegister={() => switchAuthView('register')}
      />
    );
  }

  // Main application
  return (
    <div className="App">
             <Header 
         projects={projects}
         selectedProject={selectedProject}
         onProjectSelect={setSelectedProject}
         onNewProject={() => setShowNewProjectModal(true)}
         currentView={currentView}
         user={user}
         onLogout={handleLogout}
       />
      
      <div className="container-fluid mt-4">
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading your projects...</p>
          </div>
        ) : currentView === 'dashboard' ? (
          <Dashboard 
            projects={projects}
            tasks={tasks}
            onViewProject={navigateToProject}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
            calculateProgress={calculateProjectProgress}
            calculateDates={calculateProjectDates}
          />
        ) : (
                                <KanbanBoard 
              project={selectedProject}
              tasks={tasks.filter(task => 
                task.projectId === selectedProject._id || 
                task.projectID === selectedProject._id || 
                task.project_id === selectedProject._id
              )}
             onBackToDashboard={navigateToDashboard}
            onAddTask={() => setShowNewTaskModal(true)}
            onEditTask={openEditTaskModal}
            onDeleteTask={handleDeleteTask}
            onTaskStatusChange={handleTaskStatusChange}
            onGenerateAI={() => setShowAIModal(true)}
          />
        )}
      </div>

      {/* Modals */}
      <NewProjectModal
        show={showNewProjectModal}
        onHide={() => setShowNewProjectModal(false)}
        onAddProject={handleAddProject}
      />

      <EditProjectModal
        show={showEditProjectModal}
        onHide={() => {
          setShowEditProjectModal(false);
          setEditingProject(null);
        }}
        project={editingProject}
        onUpdateProject={handleUpdateProject}
      />

      <NewTaskModal
        show={showNewTaskModal}
        onHide={() => {
          setShowNewTaskModal(false);
          setEditingTask(null);
        }}
        onAddTask={handleAddTask}
        onUpdateTask={handleUpdateTask}
        editingTask={editingTask}
        project={selectedProject}
      />

      <AITaskModal
        show={showAIModal}
        onHide={() => setShowAIModal(false)}
        onGenerateTasks={handleAITaskGeneration}
        onAddTasks={handleAddAITasks}
        project={selectedProject}
      />
    </div>
  );
}

export default App;
