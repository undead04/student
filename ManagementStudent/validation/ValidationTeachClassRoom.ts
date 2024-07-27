import { Request, Response, NextFunction } from 'express';
import { body, validationResult, CustomValidator,ValidationError } from 'express-validator';
import TeacherClassRoom from '../models/TeacherClassRoom';



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

const uniqueSubject: CustomValidator = async (value, { req }) => {
    if (value) {
        const teacherClassRoom = await TeacherClassRoom.find({ classId: { $regex: req.body?.classRoomId, $options: "i" } });

        teacherClassRoom.forEach(element => {
            if(element.subjectDetailId===value){
                throw new Error("Trùng môn học")
            }
        });
    }
};

const validationRules = () => {
    return [
        body('classRoomId').notEmpty().withMessage('Tên lớp  là trường bắt buộc'),
        body("teacherId").notEmpty().withMessage('Chọn tên giáo viênt'),
        body("subjectDetailId").notEmpty().withMessage('Chọn môn học').custom(uniqueSubject)
    ];
};

export default {
    validateRequest,
    validationRules
};
