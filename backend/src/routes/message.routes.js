import express from 'express';
import { sendMessage, getUsersForSideBar, getMessages} from '../controllers/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();
router.get('/user', protectRoute, getUsersForSideBar);
router.get('/:id',protectRoute, getMessages);
router.post('/send/:id', protectRoute, sendMessage);

export default router