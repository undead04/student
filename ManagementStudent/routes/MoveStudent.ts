import  express,{Request,Response} from "express";
import { repository } from "../models/DTO";
import Student from './../models/Student';
const router= express.Router()
router.put('/', 
    async (req:Request, res:Response) => {
    try {
        let {studentId,classRoomId}=req.body
        studentId.forEach(async(element:string) => {
            await Student.findByIdAndUpdate(element,{
                classRoomId
            })
        });
        res.status(200).json(repository(200,"Thành công",""))
    } catch (err) {
        res.status(500).json(repository(500,"",{err}))
    }
});
export default router