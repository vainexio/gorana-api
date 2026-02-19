import { Router } from 'express';
import * as travelController from '../controllers/travelController';

const router = Router();

router.get('/destinations', travelController.getAllDestinations);
router.get('/destinations/:id', travelController.getDestinationById);
router.get('/regions', travelController.getAllRegions);
router.get('/tags', travelController.getAllTags);
router.get('/recommendations', travelController.getRecommendations);

export default router;
