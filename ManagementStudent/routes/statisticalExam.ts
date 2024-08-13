import express from 'express';
import statisticalExamController from '../controller/StatisticalExamController';
const router = express.Router();
router.get('/:id', statisticalExamController.list);
export default router