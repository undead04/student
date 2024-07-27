import express, { Request, Response, NextFunction } from 'express';
import mongoose, { isValidObjectId } from 'mongoose';
import { repository } from '../models/DTO';
import HistoryUser from '../models/HistoryUser';
const router = express.Router();
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId=req.body.userId
        // Start with the base query
        let query: any = {};
        // Apply search filters if present
        if (userId) {
            query = {
                $or: [
                    { userId: { $regex: userId, $options: 'i' } },
                ]
            };
        }
        const HistoryData=await HistoryUser.find(query).populate('classRoom',"_id name").
        populate("user","_id name")
        res.status(200).json(repository(200, '', HistoryData));
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
});


router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id: string = req.params.id;
        const data = await HistoryUser.findById(id).populate('classRoom',"_id name").
        populate("user","_id name")
        if (!data) {
            return res.status(404).json(repository(404, "Subject not found", ""));
        }
        res.status(200).json(repository(200, "", data));
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
});

router.post('/',
    async (req: Request, res: Response, next: NextFunction) => {
        let {classRoomId,userId,schoolYear}=req.body;
        await HistoryUser.create({
            classRoomId,
            userId,
            schoolYear,
            create_at:new Date()
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
        let {classRoomId,userId,schoolYear}=req.body;
        const id = req.params.id;
        await HistoryUser.findByIdAndUpdate(id, {
            classRoomId,
            userId,
            schoolYear,
            create_at:new Date()
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
    await HistoryUser.findByIdAndDelete(id)
        .then(data => {
            res.status(200).json(repository(200, "Xóa thành công", ""));
        })
        .catch(error => {
            res.status(500).json(repository(500, 'Internal server error', error));
        });
});

export default router;
