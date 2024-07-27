import express, { Request, Response, NextFunction } from 'express';
import mongoose, { isValidObjectId } from 'mongoose';
import { repository } from '../models/DTO';
import ClassRoom from "../models/ClassRoom"
import validation from '../Validation/ValidationClassRoom';
import Student from '../models/Student';
const router = express.Router();
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let query: any = {};
        let sort: any = {};
        const grade=req.query.grade;
        if(grade){
            query={
                grade
            }
        }
        sort={name:1}
        const data=await ClassRoom.find(query).sort(sort).populate("homeroomTeacher")
        res.status(200).json(repository(200, '', data));
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id: string = req.params.id;
        const data = await ClassRoom.findById(id)
        if (!data) {
            return res.status(404).json(repository(404, "ClassRoom not found", ""));
        }
        res.status(200).json(repository(200, "", data));
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
});

router.post('/',
    validation.validationRules(),
    validation.validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        let {name,grade,homeroomTeacher}=req.body;
        if(homeroomTeacher && homeroomTeacher.isValidObjectId()) {
            homeroomTeacher=null;
        }
        await ClassRoom.create({
            name,
            grade,
            homeroomTeacher
        })
            .then(data => {
                res.status(200).json(repository(200, "Tạo thành công", ""));
            })
            .catch(error => {
                res.status(500).json(repository(500, 'Internal server error', error));
            });
    });

router.put('/:id',
    validation.validationRules(),
    validation.validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        let {name,grade,homeroomTeacher}=req.body;
        if(homeroomTeacher && homeroomTeacher.isValidObjectId()) {
            homeroomTeacher=null;
        }
        const id = req.params.id;
        await ClassRoom.findByIdAndUpdate(id, {
            name,
            grade,
            homeroomTeacher
        })
            .then(data => {
                res.status(200).json(repository(200, "Cập nhật thành công", ""));
            })
            .catch(error => {
                res.status(500).json(repository(500, 'Internal server error', error));
            });
    });

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    let classRoom=await Student.findOne({classRoomId:id})
    if(classRoom){
        res.status(400).json(repository(400,"Lớp học đã đc sữ dụng",""))
    }
    await ClassRoom.findByIdAndDelete(id)
        .then(data => {
            res.status(200).json(repository(200, "Xóa thành công", ""));
        })
        .catch(error => {
            res.status(500).json(repository(500, 'Internal server error', error));
        });
});

export default router;
