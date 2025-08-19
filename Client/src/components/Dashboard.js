import React from 'react';
import { Eye, Calendar, CalendarCheck, Edit2, Trash2 } from 'lucide-react';

const Dashboard = ({ projects, tasks, onViewProject, calculateProgress, calculateDates, onEditProject, onDeleteProject }) => {
  const getStatusBadge = (project) => {
    if (project.status) {
      return project.status;
    }
    
    const projectTasks = tasks.filter(task => task.projectId === project._id);
    if (projectTasks.length === 0) return 'Not Started';
    
    const completedTasks = projectTasks.filter(task => task.status === 'done').length;
    const totalTasks = projectTasks.length;
    
    if (completedTasks === 0) return 'Not Started';
    if (completedTasks === totalTasks) return 'Completed';
    return 'In Progress';
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success';
      case 'pending':
        return 'bg-warning';
      case 'completed':
        return 'bg-info';
      case 'Not Started':
        return 'bg-secondary';
      case 'In Progress':
        return 'bg-warning';
      case 'Completed':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold text-dark">
            <i className="bi bi-speedometer2 me-2"></i>
            Project Dashboard
          </h2>
          <p className="text-muted">Overview of all your projects and their current status</p>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0 fw-semibold">
                <i className="bi bi-table me-2"></i>
                Projects Overview
              </h5>
            </div>
            <div className="card-body p-0">
              
              <div className="table-responsive d-none d-md-block">
                <table className="table table-hover dashboard-table mb-0">
                  <thead>
                    <tr>
                      <th className="px-4 py-3">Project Name</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Progress</th>
                      <th className="px-3 py-3">Start Date</th>
                      <th className="px-3 py-3">End Date</th>
                      <th className="px-3 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(project => {
                      const status = getStatusBadge(project);
                      const progress = calculateProgress(project._id);
                      
                      let startDate, endDate;
                      if (project.startDate && project.endDate) {
                        startDate = project.startDate;
                        endDate = project.endDate;
                      } else {
                        const calculatedDates = calculateDates(project._id);
                        startDate = calculatedDates.startDate;
                        endDate = calculatedDates.endDate;
                      }
                      
                      return (
                        <tr key={project._id}>
                          <td className="px-4 py-3">
                            <div>
                              <div className="fw-semibold text-dark">{project.name}</div>
                              <small className="text-muted">{project.description}</small>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <span className={`badge status-badge ${getStatusBadgeClass(status)}`}>
                              {status}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <div className="d-flex align-items-center">
                              <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                                <div 
                                  className="progress-bar" 
                                  role="progressbar" 
                                  style={{ width: `${progress}%` }}
                                  aria-valuenow={progress} 
                                  aria-valuemin="0" 
                                  aria-valuemax="100"
                                ></div>
                              </div>
                              <small className="text-muted fw-semibold">{progress}%</small>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="d-flex align-items-center">
                              <Calendar size={16} className="text-muted me-2" />
                              <span>{formatDate(startDate)}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="d-flex align-items-center">
                              <CalendarCheck size={16} className="text-muted me-2" />
                              <span>{formatDate(endDate)}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="d-flex align-items-center justify-content-end gap-2">
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                title="View project"
                                aria-label="View project"
                                onClick={() => onViewProject(project)}
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-primary"
                                title="Edit project"
                                aria-label="Edit project"
                                onClick={() => onEditProject(project)}
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                title="Delete project"
                                aria-label="Delete project"
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to delete \"${project.name}\"? This will also delete all associated tasks.`)) {
                                    onDeleteProject(project._id);
                                  }
                                }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              
              <div className="d-block d-md-none p-3">
                {projects.map(project => {
                  const status = getStatusBadge(project);
                  const progress = calculateProgress(project._id);
                  let startDate, endDate;
                  if (project.startDate && project.endDate) {
                    startDate = project.startDate;
                    endDate = project.endDate;
                  } else {
                    const calculatedDates = calculateDates(project._id);
                    startDate = calculatedDates.startDate;
                    endDate = calculatedDates.endDate;
                  }

                  return (
                    <div key={project._id} className="project-card mb-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="me-2">
                          <div className="fw-semibold text-dark clamp-1">{project.name}</div>
                          {project.description && (
                            <small className="text-muted d-block mt-1 clamp-2">{project.description}</small>
                          )}
                        </div>
                        <span className={`badge status-badge ${getStatusBadgeClass(status)}`}>{status}</span>
                      </div>

                      <div className="mb-2">
                        <div className="d-flex align-items-center">
                          <div className="progress flex-grow-1 me-2" style={{ height: '6px' }}>
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: `${progress}%` }}
                              aria-valuenow={progress}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                          <small className="text-muted fw-semibold">{progress}%</small>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between text-muted small mb-3">
                        <div className="d-flex align-items-center me-3">
                          <Calendar size={14} className="me-1" />
                          <span>{formatDate(startDate)}</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <CalendarCheck size={14} className="me-1" />
                          <span>{formatDate(endDate)}</span>
                        </div>
                      </div>

                      <div className="d-flex align-items-center justify-content-end gap-2">
                        <button
                          className="btn btn-outline-secondary btn-icon"
                          title="View project"
                          aria-label="View project"
                          onClick={() => onViewProject(project)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn btn-outline-primary btn-icon"
                          title="Edit project"
                          aria-label="Edit project"
                          onClick={() => onEditProject(project)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn btn-outline-danger btn-icon"
                          title="Delete project"
                          aria-label="Delete project"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${project.name}"? This will also delete all associated tasks.`)) {
                              onDeleteProject(project._id);
                            }
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {projects.length === 0 && (
        <div className="row mt-5">
          <div className="col text-center">
            <div className="text-muted">
              <i className="bi bi-folder-x display-1"></i>
              <h4 className="mt-3">No projects yet</h4>
              <p>Create your first project to get started with task management.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
