import express, { Request, Response, NextFunction } from 'express';
import { repository } from '../models/DTO';
import { ObjectId } from 'bson';
import authenticateJWT, { AuthRequest } from '../middleware/auth';
import MyExam from '../models/MyExam';
import Student from '../models/Student';
const router = express.Router();
interface QueryType {
    subjectId?:string,
    classRoomId?:string,
    from?:Date,
    to?:Date,
    [key: string]: any; // This allows additional properties
  }
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

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {subjectDetailId}=req.query
        const page=req.body.page||1;
        const pageSize=req.body.pageSize||10
        const { sortBy, order = 'asc' } = req.query;
        const sortOrder: number = order === 'desc' ? -1 : 1;
        let query:QueryType={}
        let sort={}
        if(sortBy) {
            sort = { [sortBy as string]: sortOrder };
        }
        if(subjectDetailId){
            query["exam.subjectDetailId"]=new ObjectId(subjectDetailId as string)
        }
        const totalDocument = await MyExam.countDocuments(query);
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
            MyExam:data,
            page:{
                totalPage:totalPage,
                currentPage:Math.min(page,totalPage)
            }
        }));
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
});
router.get('/:id',async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const fetchPipeline=[
            ...commonPipeline,
            {$match:{_id:new ObjectId(id as string)}},
        ]
        const data = await MyExam.aggregate(fetchPipeline)
        if (!data) {
            return res.status(404).json(repository(404, "MyExam not found", ""));
        }
        return res.status(200).json(repository(200, "", data[0]));
    } catch (error) {
        return res.status(500).json(repository(500, 'Internal server error', error));
    }
});
router.post('/',authenticateJWT,
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        let {examId,answers }=req.body;
        const student=await Student.findOne({userId:req.userId})
        await MyExam.create({
           examId,userId:student?._id,answers
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
        let {examId,userId,answers }=req.body;
        const id = req.params.id;
        await MyExam.findByIdAndUpdate(id, {
            examId,userId,answers
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
    await MyExam.findByIdAndDelete(id)
        .then(data => {
            res.status(200).json(repository(200, "Xóa thành công", ""));
        })
        .catch(error => {
            res.status(500).json(repository(500, 'Internal server error', error));
        });
});

export default router;
