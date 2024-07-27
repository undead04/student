import express, { Request, Response, NextFunction } from 'express';
import mongoose, { isValidObjectId } from 'mongoose';
import { repository } from '../models/DTO';
import System from '../models/System';
const router = express.Router();
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await System.findOne({})
        res.status(200).json(repository(200, "", data));
    } catch (error) {
        res.status(500).json(repository(500, 'Internal server error', error));
    }
});

router.post('/',
    async (req: Request, res: Response, next: NextFunction) => {
        let {logo,name,schoolYear,semester}=req.body;
        
        await System.create({
            logo,
            name,
            schoolYear,
            semester
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
        let {logo,name,schoolYear,semester}=req.body;
        const id = req.params.id;
        
        await System.findByIdAndUpdate(id, {
            logo,
            name,
            schoolYear,
            semester
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
    await System.findByIdAndDelete(id)
        .then(data => {
            res.status(200).json(repository(200, "Xóa thành công", ""));
        })
        .catch(error => {
            res.status(500).json(repository(500, 'Internal server error', error));
        });
});

export default router;
