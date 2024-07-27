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

const validationRules = () => {
    return [
        body('username').notEmpty().withMessage('trường tên đăng nhập là bắt buộc'),
        body('password').notEmpty().withMessage('trường mất khẩu là bắt buộc')
    ];
};

export default {
    validateRequest,
    validationRules
};
