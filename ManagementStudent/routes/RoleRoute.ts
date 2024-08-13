import  express, {Request,Response, NextFunction } from "express";
import { repository } from '../models/DTO/DTO';
import User from "../models/User";
import AppRole from "../models/DTO/AppRole";
import Teacher from "../models/Teacher";
const router= express.Router()
router.put('/:userId',
    async (req:Request, res:Response,next:NextFunction) => {
    try{
        const userId=req.params.userId
        
        const user=await User.findById(userId)
        if(!user){
           return res.status(404).json(repository(404,"Không tìm thấy người dùng",""))
        }
        const role=user?.role
       role.push(AppRole.Admin)
        await User.findByIdAndUpdate(userId,{role:role}).then(data=>{
            res.status(200).json(repository(200,"Thành công",""))
        }).catch(error=>{
            res.status(500).json(repository(500,error,""))
        })
    }catch(error:any){
        res.status(500).json(repository(500,error,""))
    }
});
export default router