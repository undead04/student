import { Request, Response, NextFunction } from 'express';
import { body, validationResult, CustomValidator,ValidationError } from 'express-validator';
import ClassRoom from '../models/ClassRoom';
import User from '../models/User';
import Student from '../models/Student';
import bcrypt  from 'bcryptjs';
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
        const user = await User.findById(req.params?.id)
        if(user){
            let isEquaPassword=await bcrypt.compare(value,user?.password)
            
        if (isEquaPassword) {
            throw new Error('Mật khẩu này trùng với mật khẩu củ');
        }
    }
    }
};
const validationRules = () => {
    return [
        body('newPassword').notEmpty().withMessage('mật khẩu là bắt buộc').custom(uniqueCode),
        body('comfimPassword').notEmpty().withMessage('comfimPassword là bắt buộc')
    ];
};

export default {
    validateRequest,
    validationRules
};
