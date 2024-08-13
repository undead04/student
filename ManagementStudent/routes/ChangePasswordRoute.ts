import express from 'express';
import validation from "../validation/ValidationChangePassword"
import changePasswordController from '../controller/ChangepasswordController';
const router = express.Router();
router.put('/:id',
    validation.validationRules(),
    validation.validateRequest,
    changePasswordController.put);
export default router;
