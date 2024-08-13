import express from 'express';
import validation from '../validation/ValidationTeachClassRoom';
import authenticateJWT from '../middleware/auth';
import teacherClassRoomController from '../controller/TeacherClassRoomController';
const router = express.Router();
router.get('/',teacherClassRoomController.list);
router.get('/auth',authenticateJWT,teacherClassRoomController.list);
router.get('/:id', teacherClassRoomController.get);
router.post('/',
    validation.validationRules(),
    validation.validateRequest,
    teacherClassRoomController.post);

router.put('/:id',
    validation.validationRules(),
    validation.validateRequest,
    teacherClassRoomController.put);

router.delete('/:id', teacherClassRoomController.remove);
export default router;
