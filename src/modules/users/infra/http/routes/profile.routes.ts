import { Router } from 'express';

import ProfileController from '../controllers/ProfileController';
import ensureIsAuthenticated from '../middlewares/ensureIsAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.put('/', ensureIsAuthenticated, profileController.update);
profileRouter.get('/', ensureIsAuthenticated, profileController.show);

export default profileRouter;
