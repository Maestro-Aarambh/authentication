import {Router} from 'express';
import * as deleController from '../controllers/dele.controller.js';
import {authenticate} from '../middlewares/authentication.middleware.js';
import {admin} from '../middlewares/admin.middleware.js';
const deleRouter = Router();
deleRouter.delete('/users/:id', authenticate, admin, deleController.deleteUser);
export default deleRouter;