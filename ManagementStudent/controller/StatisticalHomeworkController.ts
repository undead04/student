import express, { Request, Response, NextFunction } from 'express';
import { repository } from '../models/DTO/DTO';
import { ObjectId } from 'bson';
import MyHomework, { IMyHomework } from '../models/MyHomework'
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
        $lookup:{
            from: 'questions',
            localField: 'homework.questionId',
            foreignField: '_id',
            as: 'question'
        }
    },{ $unwind: '$question' },
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
        'user.classRoom':'$classRoom',
        'homework.question':'$question'
    }},{
        $project:{
            createUserId:0,classRoomId:0,subjectDetailId:0,questionId:0
        }
    }
    
];
const list= async (req: Request, res: Response, next: NextFunction) => {
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
        const countPipeline = [
            ...commonPipeline,
            { $match: query },
            { $count: 'totalDocuments' }
        ];
        const countResult = await MyHomework.aggregate(countPipeline);
        const totalDocument = countResult.length > 0 ? countResult[0].totalDocuments : 0;
        const totalPage = Math.ceil(totalDocument / pageSizeQuery);
        const currentPage = Math.min(pageQuery, totalPage || 1);
        const fetchPipeline=[
            ...commonPipeline,
            {$match:query},
            {$skip:(currentPage-1)*pageSizeQuery},
            {$limit:pageSizeQuery},
            {
                $project:{
                    _id:1,create_at:1,answers:1,status:1,homework:1
                    ,'user.name':1,'user.classRoom':1
                }
            }
            
        ]
        const data:IMyHomework[]=await MyHomework.aggregate(fetchPipeline)
        const totalDoneHomework = data.reduce((accumulator, item, index) => {
            if(item.status){
                return accumulator+1
            }
            return accumulator
        }, 0); // 0 là giá trị khởi tạo của accumulator
        res.status(200).json(repository(200, "", {
            done:totalDoneHomework,
            unfinished:data.length-totalDoneHomework,
            homework:data,
            page:{
                currentPage:currentPage,
                totalPage:totalPage,
                totalDocument:totalDocument
            }
        }));
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
}
const statisticalHomeworkController={
    list
}
export default statisticalHomeworkController