import express, { Request, Response, NextFunction } from 'express';
import authenticateJWT, { AuthRequest } from '../middleware/auth';
import myExamController from './../controller/MyExamController';
const router = express.Router();
router.get('/', myExamController.list);
router.get('/student',authenticateJWT,myExamController.list)
router.get('/:id',myExamController.get);
router.post('/',myExamController.post);
router.put('/:id',authenticateJWT,myExamController.put);
router.delete('/:id',myExamController.remove);
export default router;
