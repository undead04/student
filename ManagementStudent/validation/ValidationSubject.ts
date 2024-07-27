import { Request, Response, NextFunction } from 'express';
import { body, validationResult, CustomValidator,ValidationError } from 'express-validator';
import Subject from '../models/Subject';



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
        const subject = await Subject.findOne({ name: { $regex: new RegExp(value, "i") } });
        
        if (subject && subject._id && subject._id.toString() !== req.params?.id) {
            throw new Error('Tên môn học không được trùng');
        }
    }
};

const validationRules = () => {
    return [
        body('name').notEmpty().withMessage('trường tên là bắt buộc').custom(uniqueCode),
    ];
};

export default {
    validateRequest,
    validationRules
};
