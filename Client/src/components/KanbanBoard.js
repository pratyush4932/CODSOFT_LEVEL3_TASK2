import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Home, Plus, Sparkles, Edit2, Trash2, User, Calendar } from 'lucide-react';

const KanbanBoard = ({ 
  project, 
  tasks, 
  onBackToDashboard, 
  onAddTask, 
  onEditTask, 
  onDeleteTask, 
  onTaskStatusChange,
  onGenerateAI 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  


  const columns = {
    'to-do': {
      title: 'To Do',
      tasks: tasks.filter(task => task && task._id && task.status === 'to-do'),
      color: 'todo'
    },
    'in-progress': {
      title: 'In Progress',
      tasks: tasks.filter(task => task && task._id && task.status === 'in-progress'),
      color: 'in-progress'
    },
    done: {
      title: 'Done',
      tasks: tasks.filter(task => task && task._id && task.status === 'done'),
      color: 'done'
    },
    overdue: {
      title: 'Overdue',
      tasks: tasks.filter(task => task && task._id && task.status === 'overdue'),
      color: 'overdue'
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) {
      return;
    }

    const newStatus = destination.droppableId;
    onTaskStatusChange(draggableId, newStatus);
  };

  const isPastDue = (endDate) => {
    return new Date(endDate) < new Date();
  };

  const getTaskStatus = (task) => {
    if (task.status === 'done') return task.status;
    if (isPastDue(task.endDate)) return 'overdue';
    return task.status;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const handleDeleteTask = (taskId) => {
    onDeleteTask(taskId);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <div className="kanban-header d-flex justify-content-between align-items-center">
            <div>
              <button 
                className="btn btn-outline-primary icon-btn me-3"
                onClick={onBackToDashboard}
                title="Home"
                aria-label="Home"
              >
                <Home size={18} />
              </button>
              <h2 className="fw-bold text-dark d-inline">
                {project.name}
              </h2>
            </div>
            <div>
              <button 
                className="btn btn-ai btn-icon me-2"
                onClick={onGenerateAI}
                title="Generate with AI"
                aria-label="Generate with AI"
              >
                <Sparkles size={18} />
              </button>
              <button 
                className="btn btn-primary btn-icon"
                onClick={onAddTask}
                title="New Task"
                aria-label="New Task"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
          <p className="text-muted mt-2">{project.description}</p>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="row kanban-row">
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="col-12 col-sm-6 col-md-3">
              <div className={`kanban-column ${column.color}`}>
                <div className={`kanban-column-header ${column.color}`}>
                  <h5 className="mb-0">
                    {column.title} ({column.tasks.length})
                  </h5>
                </div>
                
                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`kanban-column-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable key={String(task._id)} draggableId={String(task._id)} index={index}>
                          {(provided, snapshot) => {
                            const card = (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={provided.draggableProps.style}
                                className={`task-card ${snapshot.isDragging ? 'dragging' : ''} ${isPastDue(task.endDate) ? 'past-due' : ''}`}
                              >
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <h6 className="mb-0 fw-semibold">{task.title}</h6>
                                  <div className="dropdown">
                                    <button 
                                      className="btn btn-sm btn-outline-secondary rounded-circle p-2"
                                      type="button"
                                      data-bs-toggle="dropdown"
                                    >
                                      <i className="bi bi-three-dots"></i>
                                    </button>
                                    <ul className="dropdown-menu">
                                      <li>
                                        <button 
                                          className="dropdown-item"
                                          onClick={() => onEditTask(task)}
                                        >
                                          <Edit2 size={14} className="me-2" />
                                          Edit
                                        </button>
                                      </li>
                                      <li>
                                        <button 
                                          className="dropdown-item text-danger"
                                          onClick={() => setShowDeleteConfirm(task._id)}
                                        >
                                          <Trash2 size={14} className="me-2" />
                                          Delete
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                
                                <div className="mb-2">
                                  <small className="text-muted clamp-2">{task.description}</small>
                                </div>
                                
                                <div className="d-flex align-items-center mb-2">
                                  <User size={14} className="text-muted me-1" />
                                  <span className="assignee">{task.assignTo || 'Unassigned'}</span>
                                </div>
                                
                                <div className="d-flex align-items-center">
                                   <Calendar size={14} className="text-muted me-1" />
                                   <span className={`due-date ${isPastDue(task.endDate) ? 'text-danger' : ''}`}>
                                     {formatDate(task.endDate)}
                                     {isPastDue(task.endDate) && task.status !== 'done' && (
                                        <span className="badge bg-danger ms-2">(Overdue)</span>
                                      )}
                                   </span>
                                 </div>
                              </div>
                            );

                            return snapshot.isDragging ? createPortal(card, document.body) : card;
                          }}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>

      {showDeleteConfirm && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowDeleteConfirm(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this task? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={() => handleDeleteTask(showDeleteConfirm)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
