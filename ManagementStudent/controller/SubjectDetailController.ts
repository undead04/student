import express, { Request, Response, NextFunction } from 'express';
import { repository } from '../models/DTO/DTO';
import SubjectDetail from '../models/SubjectDetail';
import { ObjectId } from 'bson';
const commonPipeline = [
    {
        $lookup: {
            from: 'subjects',
            localField: 'subjectId',
            foreignField: '_id',
            as: 'subject'
        }
    },
    { $unwind: '$subject' },
]
const list= async (req: Request, res: Response, next: NextFunction) => {
    try {
        let query: any = {};
        let sort: any = {};
        const subjectId=req.query.subjectId;
        const grade=req.query.grade
        if(subjectId){
            query['subject._id']=new ObjectId(subjectId as string);
            
        }  
        if(grade){
            query['grade']=Number(grade);
        }
        
        const data=await SubjectDetail.aggregate([
            ...commonPipeline,
            {$match:query},
            {
                $project:{
                    "_id":1,
                    "tableOfContents":1,
                    "subject.name":1,
                    'subject._id':1,
                }
            }
        ])
        res.status(200).json(repository(200, '', data));
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
}

const get= async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id: string = req.params.id;
        const data = await SubjectDetail.aggregate([
            ...commonPipeline,
            {$match:{_id:new ObjectId(id)}},
            {
                $project:{
                    'subjectId':0
                }
            }
        ])
        if (data.length==0) {
            return res.status(404).json(repository(404, "SubjectDetail not found", ""));
        }
        res.status(200).json(repository(200, "", data[0]));
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
};

const post=
    async (req: Request, res: Response, next: NextFunction) => {
        let {subjectId,grade,tableOfContents,image}=req.body;
        await SubjectDetail.create({
            grade,
            subjectId,
            tableOfContents,
            image:image
            
        })
            .then(data => {
                // Xóa file đã upload sau khi upload thành công
                res.status(200).json(repository(200, "Tạo thành công", ""));
            })
            .catch(error => {
                res.status(500).json(repository(500, 'Internal server error', error));
            });
    }

const put=
    async (req: Request, res: Response, next: NextFunction) => {
        const { subjectId, grade, tableOfContents, image } = req.body;
        const id = req.params.id;
        try {
            const updateFields: {
                grade: number;
                subjectId: any;
                tableOfContents: any;
                image?: string; // Optional image property
            } = {
                grade,
                subjectId,
                tableOfContents,
            };
    
            // Check if 'image' exists in req.body and assign it if available
            if (image) {
                updateFields.image = image as string; // Cast 'image' to string if necessary
            }    
            // Cập nhật dữ liệu trong MongoDB
            const updatedSubjectDetail = await SubjectDetail.findByIdAndUpdate(id, updateFields, { new: true });
    
            if (!updatedSubjectDetail) {
                return res.status(404).json({ message: 'Không tìm thấy Subject Detail để cập nhật' });
            }
    
            res.status(200).json({ message: 'Cập nhật thành công', data: updatedSubjectDetail });
        } catch (error:any) {
            console.error('Lỗi khi cập nhật Subject Detail:', error);
            res.status(500).json({ message: 'Lỗi server nội bộ', error: error.message });
        }
    }
const remove= async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    await SubjectDetail.findByIdAndDelete(id)
        .then(data => {
            res.status(200).json(repository(200, "Xóa thành công", ""));
        })
        .catch(error => {
            res.status(500).json(repository(500, 'Internal server error', error));
        });
}
const subjectDetailController={
    list,
    get,
    post,
    put,
    remove,
}
export default subjectDetailController
