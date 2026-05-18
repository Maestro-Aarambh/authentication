import {Router} from 'express';
import * as deleController from '../controllers/dele.controller.js';
const deleRouter = Router();
deleRouter.delete('/users/:id', deleController.deleteUser);
export default deleRouter;