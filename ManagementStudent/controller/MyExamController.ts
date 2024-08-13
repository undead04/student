import express, { Request, Response, NextFunction } from 'express';
import { repository } from '../models/DTO/DTO';
import { ObjectId } from 'bson';
import authenticateJWT, { AuthRequest } from '../middleware/auth';
import MyExam from '../models/MyExam';
import Student from '../models/Student';
  const commonPipeline = [
    {
        $lookup: {
            from: 'exams',
            localField: 'examId',
            foreignField: '_id',
            as: 'exam'
        }
    },
    { $unwind: '$exam' },
    {
        $lookup: {
            from: 'students',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
        }
    },
    { $unwind: '$user' },
    {
        $lookup: {
            from: 'classrooms',
            localField: 'user.classRoomId',
            foreignField: '_id',
            as: 'classRoom'
        }
    },
    {$unwind:'$classRoom'},
    {
        $lookup: {
            from: 'subjectdetails',
            localField: 'exam.subjectDetailId',
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
        $addFields: {
            'user.classRoom': '$classRoom',
            'exam.subjectDetail': {
                $mergeObjects: ['$subjectDetail', { subject: '$subject' }]
            }
        }
    },
    {
        $project: {
            userId: 0,
            examId: 0,
           'exam.subjectDetailId':0,
            subjectDetail:0,
            subject:0,
            ClassRoom:0,
            'exam.subjectDetail.subjectId':0,
        }
    }
];

const list= async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const {subjectDetailId,status}=req.query
        const page=req.body.page||1;
        const pageSize=req.body.pageSize||10
        const { sortBy, order = 'asc' } = req.query;
        const sortOrder: number = order === 'desc' ? -1 : 1;
        const userId=req.userId
        let query:any={}
        let sort={}
        if(sortBy) {
            sort = { [sortBy as string]: sortOrder };
        }
       
        if(userId){
            const student=await Student.findOne({userId:new ObjectId(userId)})
           if(student){
            query["user._id"]=student?._id
           }
        }
        if(subjectDetailId){
            query["exam.subjectDetail._id"]=new ObjectId(subjectDetailId as string)
        }
        if(status){
            query['status']=(status==='true')
        }
        console.log(query)
        const countPipeline = [
            ...commonPipeline,
            { $match: query },
            { $count: 'totalDocuments' }
        ];
        const countResult = await MyExam.aggregate(countPipeline);
        const totalDocument = countResult.length > 0 ? countResult[0].totalDocuments : 0;
        const totalPage = Math.ceil(totalDocument / pageSize);
        const currentPage = Math.min(page, totalPage || 1);
        const fetchPipeline=[
            ...commonPipeline,
            {$match:query},
            {$skip:(currentPage-1)*pageSize},
            {$limit:pageSize}
        ]
        const data=await MyExam.aggregate(fetchPipeline)
        res.status(200).json(repository(200, "", {
            myExam:data,
            page:{
                totalPage:totalPage,
                currentPage:Math.min(page,totalPage),
                totalDocument:totalDocument
            }
        }));
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
}
const get=async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const id=req.params.id
        const fetchPipeline=[
            ...commonPipeline,
            {$match:{_id:new ObjectId(id)}}
        ]
        const data=await MyExam.aggregate(fetchPipeline)
        if (!data) {
            return res.status(404).json(repository(404, "MyExam not found", ""));
        }
        return res.status(200).json(repository(200, "", data[0]));
    } catch (error) {
        return res.status(500).json(repository(500, 'Internal server error', error));
    }
}
const post=
    async (req: Request, res: Response, next: NextFunction) => {
        let {examId,answers,userId }=req.body;
        await MyExam.create({
           examId,userId,answers
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
        let {answers }=req.body;
        const id = req.params.id;
        await MyExam.findByIdAndUpdate(id, {
            answers,status:true,create_at:new Date()
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
    await MyExam.findByIdAndDelete(id)
        .then(data => {
            res.status(200).json(repository(200, "Xóa thành công", ""));
        })
        .catch(error => {
            res.status(500).json(repository(500, 'Internal server error', error));
        });
}
const myExamController={
    get,list,post,put,remove
}
export default myExamController
