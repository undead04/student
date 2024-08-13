import express, { Request, Response, NextFunction } from 'express';
import { repository } from '../models/DTO/DTO';
import { ObjectId } from 'bson';
import { AuthRequest } from '../middleware/auth';
import MyHomework from '../models/MyHomework';
import Student from '../models/Student';
const commonPipeline = [
    {
        $lookup: {
            from: 'homeworks',
            localField: 'homeworkId',
            foreignField: '_id',
            as: 'homework'
        }
    },
    { $unwind: '$homework' },
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
    { $unwind: '$classRoom' },
    {
        $lookup: {
            from: 'subjectdetails',
            localField: 'homework.subjectDetailId',
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
            'homework.subjectDetail': {
                $mergeObjects: ['$subjectDetail', { subject: '$subject' }]
            }
        }
    },
    {
        $project: {
            userId: 0,
            homeworkId: 0,
           'homework.subjectDetailId':0,
            subjectDetail:0,
            subject:0,
            'homework.subjectDetail.subjectId':0,
            ClassRoom:0
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
        let query:any={}
        let sort={}
        const userId=req.userId
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
            query["homework.subjectDetail._id"]=new ObjectId(subjectDetailId as string)
        }
        if(status){
            query['status']=(status==='true')
        }
        const countPipeline = [
            ...commonPipeline,
            { $match: query },
            { $count: 'totalDocuments' }
        ];
        const countResult = await MyHomework.aggregate(countPipeline);
        const totalDocument = countResult.length > 0 ? countResult[0].totalDocuments : 0;
        const totalPage = Math.ceil(totalDocument / pageSize);
        const currentPage = Math.min(page, totalPage || 1);
        const fetchPipeline=[
            ...commonPipeline,
            {$match:query},
            {$skip:(currentPage-1)*pageSize},
            {$limit:pageSize}
        ]
        const data=await MyHomework.aggregate(fetchPipeline)
        res.status(200).json(repository(200, "", {
            myHomework:data,
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
const get= async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const id=req.params.id
        const fetchPipeline=[
            ...commonPipeline,
            {$match:{_id:new ObjectId(id)}}
        ]
        const data=await MyHomework.aggregate(fetchPipeline)
       
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
        let {homeworkId,userId,answers }=req.body;
        await MyHomework.create({
            homeworkId,answers,userId,create_at:new Date()
        })
            .then(data => {
                res.status(200).json(repository(200, "Tạo thành công", ""));
            })
            .catch(error => {
                res.status(500).json(repository(500, 'Internal server error', error));
            });
    }
const put=
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        let {answers}=req.body;
        const id=req.params.id
        await MyHomework.findByIdAndUpdate(id, {
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
    await MyHomework.findByIdAndDelete(id)
        .then(data => {
            res.status(200).json(repository(200, "Xóa thành công", ""));
        })
        .catch(error => {
            res.status(500).json(repository(500, 'Internal server error', error));
        });
}
const myHomeworkController={
    get,list,post,put,remove
} 
export default myHomeworkController
