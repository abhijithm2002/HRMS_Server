import { Router } from "express";
import AuthController from "../controller/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

const authController = new AuthController()

router.post('/userSignup', authController.register.bind(authController));
router.post('/userLogin', authController.login.bind(authController));
router.post('/refresh', authController.refresh.bind(authController));
router.post('/logout', authenticate, authController.logout.bind(authController));
router.get('/me', authenticate, authController.me.bind(authController));



export const userRoutes = router;