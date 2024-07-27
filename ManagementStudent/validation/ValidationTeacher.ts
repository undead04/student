import { Request, Response, NextFunction } from 'express';
import { body, validationResult, CustomValidator,ValidationError } from 'express-validator';
import User from '../models/User';
import Teacher from '../models/Teacher';



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
        const teacher = await Teacher.findOne({ codeUser: { $regex: new RegExp(value,"i") } });
        console.log(teacher,req.params?.id)
        if (teacher && teacher._id && teacher._id.toString() !== req.params?.id) {
            throw new Error('codeUser must be unique');
        }
    }
};
const uniqueUserName:CustomValidator=async(value,{req})=>{
        if(value) {
            const user=await User.findOne({username:{$regex:value,$options:"i"}})
            if (user) {
                throw new Error('codeUser must be unique');
            }
        }
}

const validationRulesCreate = () => {
    return [
        body('codeUser').notEmpty().withMessage('Mã học sinh là bắt buộc').custom(uniqueCode),
        body('name').notEmpty().withMessage('Tên là bắt buộc'),
        body('email').notEmpty().withMessage('Email là bắt buộc').isEmail().withMessage("Phải là dạng email"),
        body('dateOfBirth').isDate().withMessage("Định dạng phải là ngày"),
        body("phone").isMobilePhone('any').withMessage("Định dạng phải là số điện thoại"),
        body("cccd").notEmpty().withMessage('Căn cước công dân là trường bắt buộc'),
        body("address").notEmpty().withMessage('Địa chỉ là trường bắt buộc'),
        body("username").notEmpty().withMessage("Tên đăng nhập là trường bắt buộc").custom(uniqueUserName),
        body("password").notEmpty().withMessage("Mật khẩu là trường bắt buộc"),
        body("subjectId").notEmpty().withMessage("Chọn môn học")
    ];
};
const validationRulesUpdate=()=>{
   return[
    body('codeUser').notEmpty().withMessage('Mã học sinh là bắt buộc').custom(uniqueCode),
    body('name').notEmpty().withMessage('Tên là bắt buộc'),
    body('email').notEmpty().withMessage('Email là bắt buộc').isEmail().withMessage("Phải là dạng email"),
    body('dateOfBirth').isDate().withMessage("Định dạng phải là ngày"),
    body("phone").isMobilePhone('any').withMessage("Định dạng phải là số điện thoại"),
    body("cccd").notEmpty().withMessage('Căn cước công dân là trường bắt buộc'),
    body("address").notEmpty().withMessage('Địa chỉ là trường bắt buộc'),
    body("subjectId").notEmpty().withMessage("Chọn môn học")
   ]
}
export default {
    validateRequest,
    validationRulesCreate,
    validationRulesUpdate,
};
