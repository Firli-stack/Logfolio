import { Router } from 'express';
import { getProfileByUsername, updateProfile } from '../controllers/profileController.js';
import { createLog, addKudos, deleteLog } from '../controllers/logController.js';
import { createProject } from '../controllers/projectController.js';
import { sendContactMessage, reportProfile, getContactMessagesByUsername } from '../controllers/contactController.js';

const router = Router();

router.get('/profile/:username', getProfileByUsername);
router.put('/profile/:username', updateProfile);
router.get('/profile/:username/messages', getContactMessagesByUsername);

router.post('/logs', createLog);
router.patch('/logs/:id/kudos', addKudos);
router.delete('/logs/:id', deleteLog);

router.post('/projects', createProject);

router.post('/contact', sendContactMessage);
router.post('/report', reportProfile);

export default router;
