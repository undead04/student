import  express,{Request,Response} from "express";
import validation from '../validation/ValidationLogin'
import loginController from "../controller/LoginController";
const router= express.Router()
router.post('/', 
    validation.validationRules(),
    validation.validateRequest,loginController.login);
router.post('/token', loginController.token);
export default router