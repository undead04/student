import express, { Request, Response, NextFunction } from 'express';
import { repository } from '../models/DTO/DTO';
import Subject, { ISubject } from '../models/Subject';
import validation from '../validation/ValidationSubject';
import subjectController from '../controller/SubjectController';


const router = express.Router();

router.get('/groupBy',subjectController.getGroupBy);
router.get('/', subjectController.list)

router.get('/:id', subjectController.get);

router.post('/',
    validation.validationRules(),
    validation.validateRequest,subjectController.post
)

router.put('/:id',
    validation.validationRules(),
    validation.validateRequest,
    subjectController.put,
)

router.delete('/:id', subjectController.remove);

export default router;
