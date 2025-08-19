// routes/authRoutes.js
import express from 'express';
import AuthController from '../controller/authController.js';

const router = express.Router();

router.post('/register', AuthController.register);

router.get('/verify-email/:token', AuthController.verify_email);

router.post('/login', AuthController.login);

router.get('/user/:id', AuthController.getUserByID);

router.post('/logout', AuthController.logout);

export default router;
