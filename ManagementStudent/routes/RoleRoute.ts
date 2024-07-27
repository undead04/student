import  express, {Request,Response, NextFunction } from "express";
import { repository } from "../models/DTO";
import authenticateJWT, { AuthRequest } from "../middleware/auth";
import User from "../models/User";
import AppRole from "../models/AppRole";
const router= express.Router()
router.put('/userId',
    async (req:AuthRequest, res:Response,next:NextFunction) => {
    try{
        const {userId}=req.query
        await User.findByIdAndUpdate(userId,{role:AppRole.Admin}).then(data=>{
            res.status(200).json(repository(200,"Thành công",""))
        }).catch(error=>{
            res.status(500).json(repository(500,error,""))
        })
    }catch(error:any){
        res.status(500).json(repository(500,error,""))
    }
});
export default router