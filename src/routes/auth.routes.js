import {Router} from 'express';
import * as authController from '../controllers/auth.controller.js';
const authRouter = Router();
//post request
authRouter.post('/register', authController.register);
//get request
authRouter.get('/get-me', authController.getMe);

//refresh token
authRouter.post('/refresh-token', authController.refreshToken);
//login
authRouter.post('/login', authController.login);
//role based access control
authRouter.patch('/update-role', authController.changeRole);
export default authRouter;  