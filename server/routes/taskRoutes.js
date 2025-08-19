import express from 'express';
import TaskController from '../controller/taskController.js';

const router = express.Router();

router.post('/create', TaskController.createTask);  
router.get('/:userID/projects/:projectID/tasks', TaskController.getTaskForProject); 
router.get('/:userID/projects/:projectID/tasks/:taskID', TaskController.getTaskById);
router.put('/update-status', TaskController.updateTaskStatus);  
router.put('/:userID/projects/:projectID/tasks/:taskID/title', TaskController.updateTaskTitle);
router.put('/:userID/projects/:projectID/tasks/:taskID/description', TaskController.updateTaskDescription);
router.put('/:userID/projects/:projectID/tasks/:taskID/assign', TaskController.updateTaskAssignTo);
router.put('/:userID/projects/:projectID/tasks/:taskID/start-date', TaskController.updateTaskStartDate);
router.put('/:userID/projects/:projectID/tasks/:taskID/end-date', TaskController.updateTaskEndDate);
router.delete('/:userID/projects/:projectID/tasks/:taskID', TaskController.deleteTask);

export default router;