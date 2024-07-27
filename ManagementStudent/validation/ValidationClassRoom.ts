import { Request, Response, NextFunction } from 'express';
import { body, validationResult, CustomValidator,ValidationError } from 'express-validator';
import ClassRoom from '../models/ClassRoom';
const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors: { [key: string]: string } = {};
        errors.array().forEach((error : any) => {
            formattedErrors[error.path] = error.msg;
        });
        return res.status(400).json({ errors: formattedErrors });
    }
    next();
};

const uniqueCode: CustomValidator = async (value, { req }) => {
    if (value) {
        const classRoom = await ClassRoom.findOne({ name: { $regex: value, $options: "i" } });
        if (classRoom && classRoom._id && classRoom._id !== req.params?.id) {
            throw new Error('Tên lớp học không được trùng');
        }
    }
};

const validationRules = () => {
    return [
        body('name').notEmpty().withMessage('Trường tên là bắt buộc').custom(uniqueCode),
        body('grade').notEmpty().withMessage('Trường khối lớp là bắt buộc')
    ];
};

export default {
    validateRequest,
    validationRules
};
