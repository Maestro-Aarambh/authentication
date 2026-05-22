import { Router } from 'express';
import * as deleController from '../controllers/dele.controller.js';
import { authentication } from '../middleware/authentication.middleware.js';
import { adminOnly } from '../middleware/authorization.middleware.js';

const deleRouter = Router();

deleRouter.delete('/users/:id', authentication, adminOnly, deleController.deleteUser);

export default deleRouter;