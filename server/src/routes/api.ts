import { Router } from 'express';
import { getProfileByUsername } from '../controllers/profileController.js';
import { createLog, addKudos } from '../controllers/logController.js';
import { createProject } from '../controllers/projectController.js';

const router = Router();

// Profile
router.get('/profile/:username', getProfileByUsername);

// Logs
router.post('/logs', createLog);
router.patch('/logs/:id/kudos', addKudos);

// Projects
router.post('/projects', createProject);

export default router;
