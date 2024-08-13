import express from 'express';
import validation from '../validation/ValidationClassRoom';
import classRoomController from '../controller/ClassRoomController';
const router = express.Router();
router.get('/',classRoomController.list);

router.get('/:id', classRoomController.get);

router.post('/',
    validation.validationRules(),
    validation.validateRequest,
    classRoomController.post);

router.put('/:id',
    validation.validationRules(),
    validation.validateRequest,
    classRoomController.put);

router.delete('/:id', classRoomController.remove);

export default router;
