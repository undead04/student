import express, { Request, Response, NextFunction } from 'express';
import mongoose, { isValidObjectId  } from 'mongoose';
import { repository } from '../models/DTO';
import { ObjectId } from 'bson';
import MyHomework, { IMyHomework } from '../models/MyHomework'
import Homework from '../models/homework';
const router = express.Router();
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
        query['homework._id']=new ObjectId(id)
        if(classRoomId){
            query['user.classRoom._id']=new ObjectId(classRoomId as string)
        }
        const totalDocument=await MyHomework.countDocuments({homeworkId:new ObjectId(req.params.id)});
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
        const homework=await Homework.findById(id)
        const data=await MyHomework.aggregate(fetchPipeline)
        const totalStudentDoneHomework=classRoomId ?homework?.student.filter(item=>item.classRoomId._id==(classRoomId as string)):homework?.student
        const totalDoneHomework=data.length
        res.status(200).json(repository(200, "", {
            done:totalDoneHomework,
            unfinished:totalStudentDoneHomework?.length,
            homework:data,
            totalPage:{
                currentPage:currentPage,
                totalPage:totalPage
            }
        }));
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
});
export default router