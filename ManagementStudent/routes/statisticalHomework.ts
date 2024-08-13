import express from 'express';
import statisticalHomeworkController from './../controller/StatisticalHomeworkController';
const router = express.Router();
router.get('/:id', statisticalHomeworkController.list);
export default router