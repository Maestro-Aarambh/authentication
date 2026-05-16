import {Router} from 'express';
import * as authController from '../controllers/auth.controller.js';
const authRouter = Router();
//post request
authRouter.post('/register', authController.register);
//get request
authRouter.get('/get-me', authController.getMe);
export default authRouter;  
//refresh token
authRouter.get('/refresh-token', authController.refreshToken);
//login
authRouter.post('/login', authController.login);