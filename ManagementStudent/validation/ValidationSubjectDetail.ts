import { Request, Response, NextFunction } from 'express';
import { body, validationResult, CustomValidator } from 'express-validator';
import SubjectDetail from '../models/SubjectDetail';

interface ValidationError {
    [key: string]: string;
}

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors: ValidationError = {};
        errors.array().forEach((error:any) => {
            formattedErrors[error.path] = error.msg;
        });
        return res.status(400).json({ errors: formattedErrors });
    }
    next();
};

const uniqueCode: CustomValidator = async (value, { req }) => {
    if (req.body.subjectId && req.body.className) {
        const existingClass = await SubjectDetail.findOne({
            subjectId: req.body.subjectId,
            grade: req.body.grade
        });
        if (existingClass && existingClass?._id?.toString() !== req.params?.id) {
            throw new Error('Môn học là phải duy nhất');
        }
    }
};
const validationRules = () => {
    return [
        body('subjectId').notEmpty().withMessage('Tên môn học bắt buộc bắt buộc nhập'),
        body('grade').notEmpty().withMessage('Khôi môn học bắt buộc nhập').custom(uniqueCode),
    ];
};

export default {
    validateRequest,
    validationRules
};
