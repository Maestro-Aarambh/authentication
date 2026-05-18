import {Router} from 'express';
import {authenticate} from '../middlewares/authentication.middleware.js';
import * as authController from '../controllers/auth.controller.js';
import { admin } from '../middlewares/admin.middleware.js';
const authRouter = Router();
//post request
authRouter.post('/register', authController.register);
//get request
authRouter.get('/get-me', authenticate, authController.getMe);

//refresh token
authRouter.post('/refresh-token', authController.refreshToken);
//login
authRouter.post('/login', authController.login);
//role based access control
authRouter.patch('/update-role', authenticate ,admin, authController.changeRole);
export default authRouter;  