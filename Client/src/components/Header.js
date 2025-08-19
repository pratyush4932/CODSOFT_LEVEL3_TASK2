import React from 'react';
import { Plus, LogOut, User } from 'lucide-react';

const Header = ({ projects, selectedProject, onProjectSelect, onNewProject, currentView, user, onLogout }) => {
  const getStatusBadge = (projectId) => {
    return 'In Progress';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid d-flex align-items-start align-items-sm-center">
        <div className="d-flex flex-column">
          <a className="navbar-brand fw-bold" href="#">
            <i className="bi bi-kanban me-2"></i>
            TaskNest
          </a>
          {currentView === 'kanban' && selectedProject && (
            <div className="project-dropdown mt-1">
              <div className="dropdown">
                <button 
                  className="btn dropdown-toggle text-white" 
                  type="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                  title="Select project"
                >
                  <i className="bi bi-folder me-2"></i>
                  {selectedProject.name}
                </button>
                <ul className="dropdown-menu">
                  {projects.map(project => (
                    <li key={project._id}>
                      <button 
                        className="dropdown-item" 
                        onClick={() => onProjectSelect(project)}
                      >
                        <div className="d-flex align-items-center">
                          <i className="bi bi-folder me-2"></i>
                          <div>
                            <div className="fw-semibold">{project.name}</div>
                            <small className="text-muted">{getStatusBadge(project._id)}</small>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="d-flex align-items-center ms-auto gap-2">
          <button 
            className="btn btn-primary btn-icon rounded-circle" 
            onClick={onNewProject}
            title="Create new project"
            aria-label="Create new project"
          >
            <Plus size={18} />
          </button>
          <div className="dropdown user-menu">
            <div 
              className="profile-icon-container" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
              role="button"
              title="User menu"
            >
              <div className="profile-icon">
                {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <div className="dropdown-item-text">
                  <small className="text-muted">Signed in as</small><br />
                  <strong>{user?.email}</strong>
                </div>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button 
                  className="dropdown-item text-danger" 
                  onClick={onLogout}
                >
                  <LogOut size={16} className="me-2" />
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
