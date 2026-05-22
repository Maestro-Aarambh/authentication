import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authentication } from '../middleware/authentication.middleware.js';
import { adminOnly } from '../middleware/authorization.middleware.js';
import { validateRegister } from '../middleware/validators/register.validator.js';
import { validateLogin } from '../middleware/validators/login.validator.js';
import { validateChangeRole } from '../middleware/validators/changeRole.validator.js';

const authRouter = Router();

authRouter.post('/register', validateRegister, authController.register);
authRouter.post('/login', validateLogin, authController.login);
authRouter.get('/get-me', authentication, authController.getMe);
authRouter.post('/refresh-token', authController.refreshToken);
authRouter.patch('/update-role', authentication, adminOnly, validateChangeRole, authController.changeRole);

export default authRouter;