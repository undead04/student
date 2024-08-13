import express, { Request, Response, NextFunction } from 'express';
import authenticateJWT, { AuthRequest } from '../middleware/auth';
import myHomeworkController from '../controller/MyHomeworkController';
const router=express.Router();
router.get('/',myHomeworkController.list);
router.get('/student',authenticateJWT,myHomeworkController.list);
router.get('/:id', myHomeworkController.get);
router.post('/',myHomeworkController.post);
router.put('/:id',authenticateJWT,myHomeworkController.put);
router.delete('/:id', myHomeworkController.remove);
export default router;
