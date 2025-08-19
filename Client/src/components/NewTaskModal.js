import React, { useState, useEffect } from 'react';

const NewTaskModal = ({ show, onHide, onAddTask, onUpdateTask, editingTask, project }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignTo: '',
    startDate: '',
    endDate: '',
    status: 'to-do'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        assignTo: editingTask.assignTo || '',
        startDate: editingTask.startDate || '',
        endDate: editingTask.endDate || '',
        status: editingTask.status || 'to-do'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        assignTo: '',
        startDate: '',
        endDate: '',
        status: 'to-do'
      });
    }
    setErrors({});
  }, [editingTask, show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Task description is required';
    }
    
    if (!formData.assignTo.trim()) {
      newErrors.assignTo = 'Assignee is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date cannot be before start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (editingTask) {
        onUpdateTask(formData);
      } else {
        onAddTask(formData);
      }
      setFormData({ title: '', description: '', assignTo: '', startDate: '', endDate: '', status: 'to-do' });
      setErrors({});
    }
  };

  const handleClose = () => {
    setFormData({ title: '', description: '', assignTo: '', startDate: '', endDate: '', status: 'to-do' });
    setErrors({});
    onHide();
  };

  // Get minimum date (today) for date inputs
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-semibold">
              <i className={`bi ${editingTask ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h5>
            <button 
              type="button" 
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          
          {project && (
            <div className="modal-header bg-light">
              <small className="text-muted">
                <i className="bi bi-folder me-1"></i>
                Project: <strong>{project.name}</strong>
              </small>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="taskTitle" className="form-label fw-semibold">
                  Task Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  id="taskTitle"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter task title"
                  maxLength={100}
                />
                {errors.title && (
                  <div className="invalid-feedback">{errors.title}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="taskDescription" className="form-label fw-semibold">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  id="taskDescription"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what needs to be done"
                  maxLength={300}
                ></textarea>
                {errors.description && (
                  <div className="invalid-feedback">{errors.description}</div>
                )}
                <div className="form-text">
                  {formData.description.length}/300 characters
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="taskAssignee" className="form-label fw-semibold">
                      Assign To <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.assignTo ? 'is-invalid' : ''}`}
                      id="taskAssignee"
                      name="assignTo"
                      value={formData.assignTo}
                      onChange={handleInputChange}
                      placeholder="Enter assignee name"
                      maxLength={50}
                    />
                    {errors.assignTo && (
                      <div className="invalid-feedback">{errors.assignTo}</div>
                    )}
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="taskStatus" className="form-label fw-semibold">
                      Status
                    </label>
                    <select
                      className="form-select"
                      id="taskStatus"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                                                                   <option value="to-do">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="taskStartDate" className="form-label fw-semibold">
                      Start Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                      id="taskStartDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      min={getMinDate()}
                    />
                    {errors.startDate && (
                      <div className="invalid-feedback">{errors.startDate}</div>
                    )}
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="taskEndDate" className="form-label fw-semibold">
                      End Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
                      id="taskEndDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      min={formData.startDate || getMinDate()}
                    />
                    {errors.endDate && (
                      <div className="invalid-feedback">{errors.endDate}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={!formData.title.trim() || !formData.description.trim() || !formData.assignTo.trim() || !formData.startDate || !formData.endDate}
              >
                <i className={`bi ${editingTask ? 'bi-check-circle' : 'bi-plus-circle'} me-1`}></i>
                {editingTask ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewTaskModal;
