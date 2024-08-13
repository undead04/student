import express, { Request, Response, NextFunction } from 'express';
import { repository } from '../models/DTO/DTO';
import TeacherClassRoom from "../models/TeacherClassRoom"
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import AppRole from './../models/DTO/AppRole';
import Student from '../models/Student';
import { ObjectId } from 'bson';
import { number } from 'joi';
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
    }},{
        $project:{
            subjectId:0
        }
    }
    
];
const list =async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        let query: any = {};
        const page=req.body.page||1;
        const pageSize=req.body.pageSize||10
        const search=req.body.search;
        let classRoom=req.query.classRoom;
        let subjectId=req.query.subjectId as string;
        let grade=Number(req.query.grade)
       const userId=req.userId;
       if(userId){
            const user=await User.findById(userId);
        if(user){
            if(user.role.includes(AppRole.Teacher)){
                query['teacher.userId']=user._id
            }else{
                const student=await Student.findOne({userId:new ObjectId(userId)})
                if(student){
                    query['classRoom._id']=student?.classRoomId._id;
                }
            }
        }
       }
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
        if(grade){
            query['classRoom.grade']=grade
        }
        if(subjectId){
            query['subjectDetail.subject._id']=new ObjectId(subjectId as string)
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
}
const get= async (req: Request, res: Response, next: NextFunction) => {
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
}

const post=
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
    }

const put=
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
    }

const remove= async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    await TeacherClassRoom.findByIdAndDelete(id)
        .then(data => {
            res.status(200).json(repository(200, "Xóa thành công", ""));
        })
        .catch(error => {
            res.status(500).json(repository(500, 'Internal server error', error));
        });
}
const teacherClassRoomController={
    list,get,post,put,remove
}
export default teacherClassRoomController
