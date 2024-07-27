import express, { Request, Response, NextFunction } from 'express';
import mongoose, { isValidObjectId } from 'mongoose';
import { repository } from '../models/DTO';
import SubjectDetail from '../models/SubjectDetail';
import validation from '../validation/ValidationSubjectDetail';
import { ObjectId } from 'bson';
const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let query: any = {};
        let sort: any = {};
        const subjectId=req.query.subjectId;
        const grade=req.query.grade
        if(subjectId){
            query.subjectId=new ObjectId(subjectId as string);
            
        }  
        if(grade){
            query.grade=grade as string
        }
        
        const data=await SubjectDetail.find(query).sort(sort).populate("subject","_id name")
        res.status(200).json(repository(200, '', data));
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id: string = req.params.id;
        const data = await SubjectDetail.findById(id).populate("subject","_id name")
        if (!data) {
            return res.status(404).json(repository(404, "SubjectDetail not found", ""));
        }
        res.status(200).json(repository(200, "", data));
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
});

router.post('/',
    validation.validationRules(),
    validation.validateRequest,
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
    });

router.put('/:id',
    validation.validationRules(),
    validation.validateRequest,
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
    });
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    await SubjectDetail.findByIdAndDelete(id)
        .then(data => {
            res.status(200).json(repository(200, "Xóa thành công", ""));
        })
        .catch(error => {
            res.status(500).json(repository(500, 'Internal server error', error));
        });
});

export default router;
