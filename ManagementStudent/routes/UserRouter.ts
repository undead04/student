import express, { Request, Response, NextFunction, Router } from 'express';
import authenticateJWT, { AuthRequest } from '../middleware/auth';
import { repository } from '../models/DTO/DTO';
import User from '../models/User';
import AppRole from '../models/DTO/AppRole';
import Student from '../models/Student';
import { ObjectId } from 'bson';
import Teacher from '../models/Teacher';
const router = express.Router();
router.get("/",authenticateJWT,async(req:AuthRequest,res:Response,next:NextFunction)=>{
    try{
        const user=await User.findById(req.userId)
        let data:any={}
        if(user&&user?.role.includes(AppRole.Student)){
            data=await Student.findOne({userId:user._id})
            
        }else if(user){
            data=await Teacher.findOne({userId:req.userId})
        }
        if (!data) {
            return res.status(404).json(repository(404, "TeacherClassRoom not found", ""));
        }
        res.status(200).json(repository(200, "", data));
    }catch(error:any){
        res.status(500).json(repository(500, 'Internal server error', error));
    }
})
export default router