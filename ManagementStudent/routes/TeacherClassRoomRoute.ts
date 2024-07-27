import express, { Request, Response, NextFunction } from 'express';
import mongoose, { isValidObjectId } from 'mongoose';
import { repository } from '../models/DTO';
import TeacherClassRoom from "../models/TeacherClassRoom"
import validation from '../validation/ValidationTeachClassRoom';
import authenticateJWT, { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import AppRole from './../models/AppRole';
import Student from '../models/Student';
import { ObjectId } from 'bson';
const router = express.Router();
const commonPipeline = [
    {
        $lookup: {
            from: 'classrooms',
            localField: 'classRoomId',
            foreignField: '_id',
            as: 'classRoom'
        }
    },
    { $unwind: '$classRoom' },
    {
        $lookup: {
            from: 'teachers',
            localField: 'teacherId',
            foreignField: '_id',
            as: 'teacher'
        }
    },
    { $unwind: '$teacher' },
    {
        $lookup: {
            from: 'subjectdetails',
            localField: 'subjectDetailId',
            foreignField: '_id',
            as: 'subjectDetail'
        }
    },
    {$unwind:'$subjectDetail'},
    {
        $lookup: {
            from: 'subjects',
            localField: 'subjectDetail.subjectId',
            foreignField: '_id',
            as: 'subject'
        }
    },
    {$unwind:'$subject'},
    {$addFields:{
        'subjectDetail.subject':'$subject'
    }}
    
];
router.get('/',async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        let query: any = {};
        let sort: any = {};
        const page=req.body.page||1;
        const pageSize=req.body.pageSize||10
        const search=req.body.search;
        let classRoom=req.query.classRoom
        const { sortBy, order = 'asc' } = req.query;
        const sortOrder: number = order === 'desc' ? -1 : 1;
        const user=await User.findById(req.userId)
        if (user) {
            if (user.role.includes(AppRole.Student)) {
                const student = await Student.findOne({ userId: user._id });
                if (student) {
                    classRoom = student.classRoomId?.toString()
                }
            }
        }
        const student=await Student.findOne({userId:req.userId})
        if(search) {
            query={
                $or: [
                    { "subject.name": { $regex: search, $options: 'i' } },
                    { "teacher.name": { $regex: search, $options: 'i' } }
                ]
            }
        }
        if(classRoom){
            query['classRoom._id']=new ObjectId(classRoom as string)
        }
        if(sortBy) {
            sort = { [sortBy as string]: sortOrder };
        }
        const countPipeline = [
            ...commonPipeline,
            { $match: query },
            { $count: 'totalDocuments' }
        ];
        const countResult = await TeacherClassRoom.aggregate(countPipeline);
        const totalDocument = countResult.length > 0 ? countResult[0].totalDocuments : 0;
        const totalPage = Math.ceil(totalDocument / pageSize);
        const currentPage = Math.min(page, totalPage || 1);
        const data=await TeacherClassRoom.aggregate([
            ...commonPipeline,
            {$match:query},
            {$skip:(currentPage-1)*pageSize},
            {$limit:pageSize},
            {$project:{
                _id:1,
                'teacher._id':1,
                'teacher.name':1,
                "classRoom._id":1,
                'classRoom.name':1,
                'subjectDetail':1,
            }}
           ])
        res.status(200).json(repository(200, '', {
            teacherClassRoom:data,
            page:{
                totalPage:totalPage,
                currentPage:Math.min(totalPage,page),
            }
        }));
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
});
router.get('/student',authenticateJWT,async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const student=await Student.findOne({userId:req.userId})
        const {subjectDetailId}=req.query
        const query:any={}
        if(student){
            query['classRoom._id']=student?.classRoomId;
        }
        if(subjectDetailId){
            query['subjectDetail._id']=new ObjectId(subjectDetailId as string)
        }
       const data=await TeacherClassRoom.aggregate([
        ...commonPipeline,
        {$match:query},
        {$project:{
            _id:1,
            'teacher._id':1,
            'teacher.name':1,
            "classRoom._id":1,
            'classRoom.name':1,
            'subjectDetail':1,
            
        }}
       ])
       console.log(query,data)
        res.status(200).json(repository(200, '', data));
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
});
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id: string = req.params.id;
        const data=await TeacherClassRoom.aggregate([
            ...commonPipeline,
            {$match:{_id:new ObjectId(id as string)}}
        ])
        if (!data) {
            return res.status(404).json(repository(404, "TeacherClassRoom not found", ""));
        }
        res.status(200).json(repository(200, "", data[0]));
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
});

router.post('/',
    validation.validationRules(),
    validation.validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        let {classRoomId,teacherId,subjectDetailId}=req.body;
        await TeacherClassRoom.create({
            classRoomId,
            teacherId,
            subjectDetailId,
            
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
        let {teacherId,subjectDetailId}=req.body;
        const id = req.params.id;
        await TeacherClassRoom.findByIdAndUpdate(id, {
            teacherId,
            subjectDetailId,
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
    await TeacherClassRoom.findByIdAndDelete(id)
        .then(data => {
            res.status(200).json(repository(200, "Xóa thành công", ""));
        })
        .catch(error => {
            res.status(500).json(repository(500, 'Internal server error', error));
        });
});
export default router;
