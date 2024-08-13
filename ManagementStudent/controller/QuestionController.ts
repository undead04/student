import express, { Request, Response, NextFunction, response } from 'express';
import { repository } from '../models/DTO/DTO';
import Question, { IQuestion } from '../models/Questions';
import { ObjectId } from 'bson';
import authenticateJWT, { AuthRequest } from './../middleware/auth';
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
            from: 'teachers',
            localField: 'createUserId',
            foreignField: '_id',
            as: 'teacher'
        }
    },
    { $unwind: '$teacher' },
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
            'subjectDetail.subject': '$subject'
        }
    },
    {
        $project: {
            subject: 0,
            "subjectDetail.subjectId": 0,
            subjectDetailId:0
            
        }
    }
];
const getRandomQuestions = async (
    subjectDetailId: string | undefined,
    tableOfContents: string | undefined,
    numberLowQuestion: number | undefined,
    numberMediumQuestion: number | undefined,
    numberHighQuestion: number | undefined
) => {
    let query: any = {};
    
    if (tableOfContents) {
        query.tableOfContents = { $eq: tableOfContents };
    }
    if(subjectDetailId){
        query["subjectDetailId"]=new ObjectId(subjectDetailId)
        
    }
    const pipeline= [
        { $match: query },
        ...commonPipeline,
        {
            $facet: {
                lowQuestions: [
                    { $match: { level: 0 } },
                    { $sample: { size: numberLowQuestion || 0 } }
                ],
                mediumQuestions: [
                    { $match: { level: 1 } },
                    { $sample: { size: numberMediumQuestion || 0 } }
                ],
                highQuestions: [
                    { $match: { level: 2 } },
                    { $sample: { size: numberHighQuestion || 0 } }
                ]
            }
        }
    ];
    const result = await Question.aggregate(pipeline);
    return result[0]
};
const list= async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { subjectId, grade, level, tableOfContents } = req.query;
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const { sortBy, order = 'asc' } = req.query;
        const sortOrder: number = order === 'desc' ? -1 : 1;
        const userId=req.userId;
        let query: any = {};
        let sort = {};
        if (sortBy) {
            sort = { [sortBy as string]: sortOrder };
        }
        if(subjectId){
            query
                ["subjectDetail.subject._id"]=new ObjectId(subjectId as string) 
        }
        if(userId){
            const teacher=await Teacher.findOne({userId:new ObjectId(userId)})
           if(teacher){
            query['createUserId']={$eq:teacher?._id}
           }
        }
        if(grade){
            query["subjectDetail.grade"]=Number(grade)
        }
        if (level) {
            query.level = Number(level);
        }

        if (tableOfContents) {
            query.tableOfContents = { $eq: tableOfContents as string };
        }
        const countPipeline = [
            ...commonPipeline,
            { $match: query },
            { $count: 'totalDocuments' }
        ];
        const countResult = await Question.aggregate(countPipeline);
        const totalDocument = countResult.length > 0 ? countResult[0].totalDocuments : 0;
        const totalPage = Math.ceil(totalDocument / pageSize);
        const currentPage = Math.min(page, totalPage || 1);
        const fetchPipeline = [
            { $sort: { create_at: -1 as 1 | -1 } },
            ...commonPipeline,
            { $match: query },
            { $skip: (currentPage - 1) * pageSize },
            { $limit: pageSize },
            {$project:{
                _id:1,
                create_at:1,
                level:1,
                "teacher._id":1,
                "teacher.name":1,
                "isMul":1,
                "subjectDetail.subject.name":1,
                'question':1,
                'answer':1,
                "option":1
            }},
        ];
        const result = await Question.aggregate(fetchPipeline);
        
        res.status(200).json(repository(200, "", {
            question: result,
            page: {
                totalPage: totalPage,
                currentPage: currentPage,
            }
        }));
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
}
const random=async(req:Request,res:Response,next:NextFunction)=>{
    let {subjectDetailId,tableOfContents,numberLowQuestion,numberMediumQuestion,numberHightQuestion}=req.query
        const subjectIdStr = subjectDetailId as string | undefined;
        const tableOfContentsStr = tableOfContents as string | undefined;
        const numberLowQuestionNum = Number(numberLowQuestion) || 0;
        const numberMediumQuestionNum = Number(numberMediumQuestion) || 0;
        const numberHighQuestionNum = Number(numberHightQuestion) || 0;
    const data=await getRandomQuestions(subjectIdStr,tableOfContentsStr,numberLowQuestionNum,numberMediumQuestionNum,numberHighQuestionNum)
    const lowQuestionIds = data.lowQuestions.map((item: IQuestion) => item._id);
    const mediumQuestionIds = data.mediumQuestions.map((item: IQuestion) => item._id);
    const highQuestionIds = data.highQuestions.map((item: IQuestion) => item._id);
    res.status(200).json(repository(200,"",[
        ...lowQuestionIds,
        ...mediumQuestionIds,
        ...highQuestionIds
    ]))
}
const get= async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id=req.params.id;
        const data=await Question.aggregate([
            ...commonPipeline,
            {$match:{_id:new ObjectId(id)}},
            {$limit:1}
        ])
       
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
        let {question,option,answer,level,isMul,subjectDetailId,tableOfContents}=req.body;
        const userId=req.userId
        const teacher=await Teacher.findOne({userId:new ObjectId(userId)})
        await Question.create({
            question,
            option,
            answer,
            isMul,
            tableOfContents,
            subjectDetailId,
            level,
            createUserId:teacher?._id,
            create_at:new Date()
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
        let {question,option,answer,isMul,subjectDetailId,level,tableOfContents}=req.body;
        const id = req.params.id;
        await Question.findByIdAndUpdate(id, {
            question,
            option,
            answer,
            isMul,
            subjectDetailId,
            tableOfContents,
            level,
            create_at:new Date()
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
    await Question.findByIdAndDelete(id)
        .then(data => {
            res.status(200).json(repository(200, "Xóa thành công", ""));
        })
        .catch(error => {
            res.status(500).json(repository(500, 'Internal server error', error));
        });
}
const questionController={
    random,get,list,remove,post,put
}
export default questionController;
