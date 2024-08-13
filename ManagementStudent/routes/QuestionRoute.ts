import express, { Request, Response, NextFunction, response } from 'express';
import authenticateJWT, { AuthRequest } from './../middleware/auth';
import questionController from '../controller/QuestionController';
const router = express.Router();
router.get('/', questionController.list);
router.get('/teacher',authenticateJWT, questionController.list);
router.get("/random",questionController.random)
router.get('/:id',questionController.get);
router.post('/',authenticateJWT,questionController.post);
router.put('/:id',questionController.put);
router.delete('/:id', questionController.remove);
export default router;
