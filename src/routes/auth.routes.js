import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/authentication.middleware.js';
import { admin } from '../middlewares/admin.middleware.js';
import { validateRegister } from '../middlewares/validators/register.validator.js';
import { validateLogin } from '../middlewares/validators/login.validator.js';
import { validateChangeRole } from '../middlewares/validators/changeRole.validator.js';

const authRouter = Router();

authRouter.post('/register', validateRegister, authController.register);
authRouter.post('/login', validateLogin, authController.login);
authRouter.get('/get-me', authenticate, authController.getMe);
authRouter.post('/refresh-token', authController.refreshToken);
authRouter.patch('/update-role', authenticate, admin, validateChangeRole, authController.changeRole);
authRouter.get('/verify-email/:token', authController.verifyEmail);
export default authRouter;