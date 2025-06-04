import express from 'express';
import { login, signup, logout, checkAuth} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
const router = express.Router();

router.get('/login', login);
router.get('signup', signup);
router.get('/logout', logout);

// router.put('/update-profile', protectRoute, updateProfile);
router.get('/check', protectRoute, checkAuth);

export default router;