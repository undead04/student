import express, { Request, Response, NextFunction } from 'express';
import { repository } from '../models/DTO/DTO';
import User from '../models/User';
import validation from "../validation/ValidationChangePassword"
import bcrypt from 'bcryptjs';
const put=
    async (req: Request, res: Response, next: NextFunction) => {
        let {newPassword,comfimPassword}=req.body;
        const id = req.params.id;
       if(newPassword===comfimPassword) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await User.findByIdAndUpdate(id, {
            password:hashedPassword
        })
            .then(data => {
                res.status(200).json(repository(200, "Cập nhật thành công", ""));
            })
            .catch(error => {
                res.status(500).json(repository(500, 'Internal server error', error));
            });
       }else{
        res.status(400).json(repository(400,"Mật khẩu và xác thực mật khẩu không giống nhau",""))
       }
    }


const changePasswordController={
    put
}
export default changePasswordController
