import express, { Request, Response, NextFunction } from 'express';
import mongoose, { isValidObjectId  } from 'mongoose';
import { repository } from '../models/DTO';
import { ObjectId } from 'bson';
import MyExam from '../models/MyExam'
import Exam from '../models/Exam';
const router = express.Router();
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
    {$addFields:{
        'user.classRoom':'$classRoom'
    }}
    
];
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let {page,pageSize,classRoomId}=req.query
        const pageQuery=Number(page)||1;
        const pageSizeQuery=Number(pageSize)||10;
        const query:any={}   
        const id=req.params.id
        query['exam._id']=new ObjectId(id)
        if(classRoomId){
            query['user.classRoom._id']=new ObjectId(classRoomId as string)
        }
        const totalDocument=await MyExam.countDocuments({examId:new ObjectId(req.params.id)});
        const totalPage = Math.ceil(totalDocument / pageSizeQuery);
        const currentPage = Math.min(pageQuery, totalPage || 1);
        const fetchPipeline=[
            ...commonPipeline,
            {$match:query},
            {$skip:(currentPage-1)*pageSizeQuery},
            {$limit:pageSizeQuery},
            {$project:{
                'answers':1,
                'user.name':1,
                'user._id':1,
                'user.classRoom._id':1,
                'user.classRoom.name':1,
                "create_at":1
                
            }}
        ]
        
        const exam=await Exam.findById(req.params.id).populate("studentId")
        const data=await MyExam.aggregate(fetchPipeline)
        const examFilter=classRoomId ?exam?.studentId.filter(item=>item.classRoomId._id==(classRoomId as string)):exam?.studentId
        const totalStudent=examFilter?.length
        const totalDoneHomework=data.length
        res.status(200).json(repository(200, "", {
            done:totalDoneHomework,
            unfinished:(totalStudent as number)-totalDoneHomework,
            exam:data,
            totalPage:{
                currentPage:currentPage,
                totalPage:totalPage
            }
        }));
    } catch (error:any) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
});
export default router