import  express,{Request,Response} from "express";
import User from "../models/User";
import { repository } from '../models/DTO/DTO';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validation from '../validation/ValidationLogin'
import { string } from "joi";
let refreshTokens = [""];
const accessTokenSecret = 'secretToken';
const refreshTokenSecret = 'secretToken';
const login=
    async (req:Request, res:Response) => {
    const { username, password } = req.body;
    try {
        // Check if user exists
        let user = await User.findOne({ username:{$regex:username,$options:"i"} });
        if (!user) {
            return res.status(400).json(repository(400,'Invalid Credentials',""));
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json(repository(400,'Invalid Credentials',""));
        }
        // Generate and return a token
        const payload = {
            user: {
                id: user._id,
                role:user.role,
            }
        };
        const accessToken=jwt.sign(payload, 'secretToken', { expiresIn: '15d' });
        const refreshToken = jwt.sign(payload, refreshTokenSecret, { expiresIn: '7d' });
        refreshTokens.push(refreshToken);
        res.status(200).json(repository(200,"",{
            user:{
                _id:user._id,
                role:user.role,
                name:user.username,
               
            },
            accessToken,
            refreshToken
        }))
    } catch (err) {
        res.status(500).json(repository(500,"",{err}))
    }
}
const token= (req:Request, res:Response) => {
    const { refreshToken } = req.body;
  
    if (!refreshToken) {
      return res.sendStatus(401);
    }
  
    if (!refreshTokens.includes(refreshToken as string)) {
      return res.sendStatus(403);
    }
    jwt.verify(refreshToken, refreshTokenSecret, (err:any,user:any)  => {
      if (err) {
        return res.sendStatus(403);
      }
      const payload = {
        user: {
            id: user._id,
            role:user.role,
        }
    };
      const newAccessToken = jwt.sign(payload, accessTokenSecret, { expiresIn: '15d' });
      const newRefreshToken = jwt.sign(payload, refreshTokenSecret, { expiresIn: '7d' });
      // Cập nhật refresh token
      refreshTokens = refreshTokens.filter(token => token !== refreshToken);
      refreshTokens.push(newRefreshToken);
  
      res.status(200).json(repository(200,"",{
        user:{
            _id:user._id,
            role:user.role,
            name:user.username,
        },
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    }))
    });
  }
const loginController={
    login,token
}
export default loginController