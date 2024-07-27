import { Request, Response, NextFunction } from 'express';
import { body, validationResult, CustomValidator,ValidationError } from 'express-validator';
import Student from '../models/Student';
import User from '../models/User';



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
        const student = await Student.findOne({ codeUser: { $regex: new RegExp(value,"i") } });
        if (student && student._id && student._id.toString() != req.params?.id) {
            throw new Error('Mã học sinh là duy nhất');
        }
    }
};
const uniqueUserName:CustomValidator=async(value,{req})=>{
    if(value) {
        const user=await User.findOne({username:{$regex: new RegExp(value,"i")}})
        if (user) {
            throw new Error('Tên đăng nhập của học sinh là duy nhất');
        }
    }
}

const validationRuleCreate = () => {
    return [
        body('codeUser').notEmpty().withMessage('Mã học sinh là bắt buộc').custom(uniqueCode),
        body('name').notEmpty().withMessage('Tên là bắt buộc'),
        body('email').notEmpty().withMessage('Email là bắt buộc').isEmail().withMessage("Phải là dạng email"),
        body('dateOfBirth').isDate().withMessage("Định dạng phải là ngày"),
        body("phone").isMobilePhone('any').withMessage("Định dạng phải là số điện thoại"),
        body("cccd").notEmpty().withMessage('Căn cước công dân là trường bắt buộc'),
        body("address").notEmpty().withMessage('Địa chỉ là trường bắt buộc'),
        body("username").notEmpty().withMessage("Tên đăng nhập là trường bắt buộc").custom(uniqueUserName),
        body("password").notEmpty().withMessage("Mật khẩu là trường bắt buộc")
    ];
};
const validationRulesUpdate = () => {
    return [
        body('codeUser').notEmpty().withMessage('Mã học sinh là bắt buộc').custom(uniqueCode),
        body('name').notEmpty().withMessage('Tên là bắt buộc'),
        body('email').notEmpty().withMessage('Email là bắt buộc').isEmail().withMessage("Phải là dạng email"),
        body('dateOfBirth').isDate().withMessage("Định dạng phải là ngày"),
        body("phone").isMobilePhone('any').withMessage("Định dạng phải là số điện thoại"),
        body("cccd").notEmpty().withMessage('Căn cước công dân là trường bắt buộc'),
        body("address").notEmpty().withMessage('Địa chỉ là trường bắt buộc'),
       
    ];
};
export default {
    validateRequest,
    validationRuleCreate,
    validationRulesUpdate
};
