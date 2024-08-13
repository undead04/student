import express, { Request, Response, NextFunction } from 'express';
import { repository } from '../models/DTO/DTO';
import Exam from '../models/Exam';
import { ObjectId } from 'bson';
import { AuthRequest } from '../middleware/auth';
import MyExam from '../models/MyExam';
import Teacher from '../models/Teacher';
const commonPipeline = [
    {
        $lookup: {
            from: 'subjectdetails',
            localField: 'subjectDetailId',
            foreignField: '_id',
            as: 'subjectDetail'
        }
    },
    { $unwind: '$subjectDetail' },
    {
        $lookup: {
            from: 'subjects',
            localField: 'subjectDetail.subjectId',
            foreignField: '_id',
            as: 'subject'
        }
    },
    { $unwind: '$subject' },
    {
        $lookup: {
            from: 'classrooms',
            localField: 'classRoomId',
            foreignField: '_id',
            as: 'classRoom'
        }
    },
    {
        $lookup: {
            from: 'questions',
            localField: 'questionId',
            foreignField: '_id',
            as: 'question'
        }
    },
    
    {
        $lookup: {
            from: 'teachers',
            localField: 'createUserId',
            foreignField: '_id',
            as: 'user'
        }
    },
    { $unwind: '$user' },
    {
        $addFields: {
            'subjectDetail.subject': '$subject'
        }
    },
    {
        $project: {
            subject: 0,
            "subjectDetail.subjectId": 0,
            classRoomId:0,
            subjectDetailId:0,
            questionId:0,
            createUserId:0
        }
    }
    
];

const list= async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const {subjectId,classRoomId,from,to}=req.query
        const page=req.body.page||1;
        const pageSize=req.body.pageSize||10
        const { sortBy, order = 'asc' } = req.query;
        const sortOrder: number = order === 'desc' ? -1 : 1;
        const userId=req.userId
        let query:any={}
        if(subjectId){
            query["subjectDetail.subject._id"]=new ObjectId(subjectId as string)
        }
        if(classRoomId){
            query["classRoom._id"]=new ObjectId(classRoomId as string)
        }
        if(userId){
            const teacher=await Teacher.findOne({userId:new ObjectId(userId)})
           if(teacher){
            query['createUserId']=teacher?._id
           }
        }
        const countPipeline = [
            ...commonPipeline,
            { $match: query },
            { $count: 'totalDocuments' }
        ];
        const countResult = await Exam.aggregate(countPipeline);
        const totalDocument = countResult.length > 0 ? countResult[0].totalDocuments : 0;
        const totalPage = Math.ceil(totalDocument / pageSize);
        const currentPage = Math.min(page, totalPage || 1);
        const fetchPipeline=[
            ...commonPipeline,
            {$match:query},
            {$sort:{create_at:-1 as -1||1}},
            {$skip:(currentPage-1)*pageSize},
            {$limit:pageSize}
        ]
        const data=await Exam.aggregate(fetchPipeline)
        res.status(200).json(repository(200, "", {
            exam:data,
            page:{
                totalPage:totalPage,
                currentPage:Math.min(page,totalPage)
            }
        }));
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
}
const get= async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id=req.params.id;
        const fetchPipeline=[
            ...commonPipeline,
            {$match:{_id:new ObjectId(id)}},
            {$limit:1},
            {$replaceRoot: { newRoot: '$$ROOT' } }, // Trích xuất tài liệu từ mảng kết quả
        ]
        const data=await Exam.aggregate(fetchPipeline)
        if(!data){
            res.status(404).json(repository(404,"Question not found",""))
        }
        res.status(200).json(repository(200, "", data[0]));
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
}
const post=
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        let {name,subjectDetailId,classRoomId,startDate,answerDate,endDate,questionId,semester,schoolYear}=req.body;
        const teacher=await Teacher.findOne({userId:new ObjectId(req.userId)})
        await Exam.create({
           name,
           subjectDetailId,classRoomId,createUserId:teacher?._id,startDate,endDate,answerDate,create_at:new Date(),questionId
           ,semester,schoolYear
        })
            .then(data => {
                res.status(200).json(repository(200, "Tạo thành công", data._id));
            })
            .catch(error => {
                res.status(500).json(repository(500, 'Internal server error', error));
            });
    };
const put=
    async (req: Request, res: Response, next: NextFunction) => {
        let {name,subjectDetailId,classRoomId,startDate,answerDate,endDate,questionId}=req.body;
        const id = req.params.id;
        await Exam.findByIdAndUpdate(id, {
            name,
            subjectDetailId,classRoomId,startDate,answerDate,endDate,create_at:new Date(),questionId
        })
            .then(data => {
                res.status(200).json(repository(200, "Cập nhật thành công", ""));
            })
            .catch(error => {
                res.status(500).json(repository(500, 'Internal server error', error));
            });
    }
    const remove = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id: string = req.params.id;
            const myExam = await MyExam.find({ examId: new ObjectId(id) });
            console.log(myExam)
            // Wait for all delete operations to complete
            await Promise.all(myExam.map(async (element) => {
                try {
                    await MyExam.findByIdAndDelete(element._id);
                    console.log('Thành công');
                } catch (error) {
                    console.log('Thất bại', error);
                }
            }));
            // Delete the exam itself
            await Exam.findByIdAndDelete(id);
            res.status(200).json(repository(200, "Xóa thành công", ""));
        } catch (error) {
            res.status(500).json(repository(500, 'Internal server error', error));
        }
    };
    

const examController={
    list,get,post,put,remove
}
export default examController
