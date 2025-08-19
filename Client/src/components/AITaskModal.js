import React, { useState } from 'react';
import { Sparkles, Loader, CheckCircle, Plus } from 'lucide-react';

const AITaskModal = ({ show, onHide, onGenerateTasks, onAddTasks, project }) => {
  const [goal, setGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [error, setError] = useState('');

  const handleGenerateTasks = async () => {
    if (!goal.trim()) {
      setError('Please enter a project goal');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedTasks([]);
    setSelectedTasks([]);

    try {
      const tasks = await onGenerateTasks(goal);
      setGeneratedTasks(tasks);
    } catch (err) {
      setError('Failed to generate tasks. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTaskSelection = (taskIndex) => {
    setSelectedTasks(prev => {
      if (prev.includes(taskIndex)) {
        return prev.filter(index => index !== taskIndex);
      } else {
        return [...prev, taskIndex];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === generatedTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(generatedTasks.map((_, index) => index));
    }
  };

  const handleAddSelectedTasks = () => {
    if (selectedTasks.length === 0) {
      setError('Please select at least one task');
      return;
    }

    const tasksToAdd = selectedTasks.map(index => generatedTasks[index]);
    onAddTasks(tasksToAdd);
    
    // Reset state
    setGoal('');
    setGeneratedTasks([]);
    setSelectedTasks([]);
    setError('');
  };

  const handleClose = () => {
    setGoal('');
    setGeneratedTasks([]);
    setSelectedTasks([]);
    setError('');
    onHide();
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block ai-modal" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-semibold">
              <Sparkles size={20} className="me-2 text-primary" />
              AI Task Generation
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
          
          <div className="modal-body">
            <div className="mb-4">
              <label htmlFor="projectGoal" className="form-label fw-semibold">
                Project Goal <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                id="projectGoal"
                rows="4"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Describe your project goal or objective. AI will generate relevant tasks based on your input."
                maxLength={500}
                disabled={isGenerating}
              ></textarea>
              <div className="form-text">
                {goal.length}/500 characters
              </div>
              
              {error && (
                <div className="alert alert-danger mt-2 py-2">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}
              
              <button 
                className="btn btn-ai w-100 mt-3"
                onClick={handleGenerateTasks}
                disabled={!goal.trim() || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader size={16} className="me-2 animate-spin" />
                    Generating Tasks...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} className="me-1" />
                    Generate Tasks with AI
                  </>
                )}
              </button>
            </div>

            {isGenerating && (
              <div className="text-center py-4">
                <Loader size={48} className="text-primary animate-spin mb-3" />
                <p className="text-muted">AI is analyzing your project goal and generating relevant tasks...</p>
              </div>
            )}

            {generatedTasks.length > 0 && (
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-semibold mb-0">
                    Generated Tasks ({generatedTasks.length})
                  </h6>
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={handleSelectAll}
                  >
                    {selectedTasks.length === generatedTasks.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                
                <div className="generated-tasks-list">
                  {generatedTasks.map((task, index) => (
                    <div 
                      key={index} 
                      className={`task-list-item ${selectedTasks.includes(index) ? 'border-primary bg-primary-subtle' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(index)}
                        onChange={() => handleTaskSelection(index)}
                        className="form-check-input"
                      />
                      <p className="task-text mb-0">{task.content}</p>
                      {selectedTasks.includes(index) && (
                        <CheckCircle size={16} className="text-primary ms-2" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {generatedTasks.length > 0 && (
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleAddSelectedTasks}
                disabled={selectedTasks.length === 0}
              >
                <Plus size={16} className="me-1" />
                Add Selected Tasks ({selectedTasks.length})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AITaskModal;
