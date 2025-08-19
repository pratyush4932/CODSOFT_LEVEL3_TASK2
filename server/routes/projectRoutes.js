import express from 'express';
import ProjectController from '../controller/projectController.js'

const router = express.Router();

router.post('/create', ProjectController.createProject);
router.get('/:userID/projects', ProjectController.getProjectForUser);
router.get('/:userID/projects/:projectID', ProjectController.getProjectByID);
router.put('/:userID/projects/:projectID/title', ProjectController.updateProjectTitle);
router.put('/:userID/projects/:projectID/description', ProjectController.updateProjectDescription);
router.put('/:userID/projects/:projectID/start-date', ProjectController.updateProjectStartDate);
router.put('/:userID/projects/:projectID/end-date', ProjectController.updateProjectEndDate);
router.put('/:userID/projects/:projectID/status', ProjectController.updateStatus);
router.delete('/:userID/projects/:projectID', ProjectController.deleteProject);

export default router;
