import { Router } from 'express';
import { getProfileByUsername, updateProfile } from '../controllers/profileController.js';
import { createLog, addKudos, deleteLog } from '../controllers/logController.js';
import { createProject } from '../controllers/projectController.js';

const router = Router();

// Profile
router.get('/profile/:username', getProfileByUsername);
router.put('/profile/:username', updateProfile);

// Logs
router.post('/logs', createLog);
router.patch('/logs/:id/kudos', addKudos);
router.delete('/logs/:id', deleteLog);

// Projects
router.post('/projects', createProject);

export default router;
