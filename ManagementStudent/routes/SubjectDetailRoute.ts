import express, { Request, Response, NextFunction } from 'express';
import mongoose, { isValidObjectId } from 'mongoose';
import { repository } from '../models/DTO/DTO';
import SubjectDetail from '../models/SubjectDetail';
import validation from '../validation/ValidationSubjectDetail';
import { ObjectId } from 'bson';
import subjectDetailController from '../controller/SubjectDetailController';
const router = express.Router();

router.get('/', subjectDetailController.list);

router.get('/:id', subjectDetailController.get);

router.post('/',
    validation.validationRules(),
    validation.validateRequest,
    subjectDetailController.post);

router.put('/:id',
    validation.validationRules(),
    validation.validateRequest,
    subjectDetailController.put);
router.delete('/:id', subjectDetailController.remove);

export default router;
