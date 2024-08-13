import express, { Request, Response, NextFunction } from 'express';
import { repository } from '../models/DTO/DTO';
import Student, { IStudent } from "../models/Student"
import validation from '../validation/ValidationStudent';
import User from '../models/User';
import AppRole from './../models/DTO/AppRole';
import bcrypt from 'bcryptjs';
import ExcelJS from 'exceljs';
import { ObjectId } from 'bson';
import studentController from '../controller/StudentController';
const router = express.Router();
router.get('/', studentController.list);
router.get("/export",studentController.exportStudent);
router.get('/:id', studentController.get);

router.post('/',
    validation.validationRuleCreate(),
    validation.validateRequest,
    studentController.post);

router.put('/:id',
    validation.validationRulesUpdate(),
    validation.validateRequest,
    studentController.put);

router.delete('/:id', studentController.remove);

export default router;
