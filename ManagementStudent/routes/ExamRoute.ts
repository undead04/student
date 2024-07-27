import express, { Request, Response, NextFunction } from 'express';
import { repository } from '../models/DTO';
import Question from '../models/Questions';
import Exam from '../models/Exam';
import { ObjectId } from 'bson';
import ClassRoom from '../models/ClassRoom';
import { match } from 'assert';
import authenticateJWT, { AuthRequest } from '../middleware/auth';
import Teacher from '../models/Teacher';
const router = express.Router();
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
    { $unwind: '$subjectDetail' },
    {
        $lookup: {
            from: 'classrooms',
            localField: 'classRoomId',
            foreignField: '_id',
            as: 'classRoom'
        }
    },
    { $unwind: '$subject' },
    {
        $addFields: {
            'subjectDetail.subject': '$subject'
        }
    },
    {
        $project: {
            subject: 0,
            "subjectDetail.subjectId": 0,
            classRoomId:0
        }
    }
    
];

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {subjectId,classRoomId,from,to}=req.query
        const page=req.body.page||1;
        const pageSize=req.body.pageSize||10
        const { sortBy, order = 'asc' } = req.query;
        const sortOrder: number = order === 'desc' ? -1 : 1;
        let query:any={}
        let sort={}
        if(sortBy) {
            sort = { [sortBy as string]: sortOrder };
        }
        if(subjectId){
            query["subjectDetail.subject._id"]=new ObjectId(subjectId as string)
        }
        if(classRoomId){
            query["classRoom._id"]=new ObjectId(classRoomId as string)
        }
        if(from){
            query['startDate']={$gte :from}
        }
        if(to){
            query['endDate']={$lte  :to}
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
});
router.get('/teacher',authenticateJWT,async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const {subjectId,classRoomId,from,to}=req.query
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
        if(subjectId){
            query["subjectDetail.subject._id"]=new ObjectId(subjectId as string)
        }
        if(classRoomId){
            query["classRoom._id"]=new ObjectId(classRoomId as string)
        }
        if(from){
            query['startDate']={$gte :from}
        }
        if(to){
            query['endDate']={$lte  :to}
        }
        if(userId){
            const teacher=await Teacher.findOne({userId:new ObjectId(userId)})
            query['createUserId']=teacher?._id
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
});
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
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
});
router.post('/',authenticateJWT,
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        let {name,subjectDetailId,classRoomId,startDate,answerDate,endDate,questionId,studentId}=req.body;
        const teacher=await Teacher.findOne({userId:new ObjectId(req.userId)})
        await Exam.create({
           name,
           subjectDetailId,classRoomId,createUserId:teacher?._id,startDate,endDate,answerDate,studentId,create_at:new Date(),questionId
        })
            .then(data => {
                res.status(200).json(repository(200, "Tạo thành công", ""));
            })
            .catch(error => {
                res.status(500).json(repository(500, 'Internal server error', error));
            });
    });
router.put('/:id',
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
    });
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    await Exam.findByIdAndDelete(id)
        .then(data => {
            res.status(200).json(repository(200, "Xóa thành công", ""));
        })
        .catch(error => {
            res.status(500).json(repository(500, 'Internal server error', error));
        });
});

export default router;
