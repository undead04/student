import express, { Request, Response, NextFunction } from 'express';
import { repository } from '../models/DTO/DTO';
import validation from '../validation/ValidationTeacher';
import User from '../models/User';
import AppRole from '../models/DTO/AppRole';
import bcrypt from "bcryptjs"
import Teacher from '../models/Teacher';
import ExcelJS from 'exceljs';
import { ObjectId } from 'bson';
import teacherController from '../controller/TeacherController';
const router = express.Router();
router.get('/', teacherController.list);
router.get("/export",teacherController.teacherExport )
router.get('/:id', teacherController.get);

router.post('/',
    validation.validationRulesCreate(),
    validation.validateRequest,
    teacherController.post);

router.put('/:id',
    validation.validationRulesUpdate(),
    validation.validateRequest,
    teacherController.put);

router.delete('/:id',teacherController.remove);
export default router;
