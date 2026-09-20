import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getProfileByUsername, updateProfile } from '../controllers/profileController.js';
import { createLog, addKudos, deleteLog, verifyProofLink, updateLog } from '../controllers/logController.js';
import { createProject } from '../controllers/projectController.js';
import { 
  sendContactMessage, 
  reportProfile, 
  getContactMessagesByUsername,
  updateContactMessageStatus
} from '../controllers/contactController.js';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Terlalu banyak pengiriman pesan dari IP Anda. Coba lagi dalam 15 menit.' },
});

router.get('/profile/:username', getProfileByUsername);
router.put('/profile/:username', updateProfile);
router.get('/profile/:username/messages', getContactMessagesByUsername);
router.patch('/contact/messages/:id/status', updateContactMessageStatus);

router.post('/logs', createLog);
router.put('/logs/:id', updateLog);
router.post('/logs/verify-proof', verifyProofLink);
router.patch('/logs/:id/kudos', addKudos);
router.delete('/logs/:id', deleteLog);

router.post('/projects', createProject);

router.post('/contact', contactLimiter, sendContactMessage);
router.post('/report', contactLimiter, reportProfile);

export default router;
