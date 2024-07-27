// authenticateJWT.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  userId?: string;
  role?: string;
}

const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).send('Access Denied');
  }
  try {
    const verified = jwt.verify(token, 'secretToken') as {user:{ id: string; role: string} };
    req.userId = verified.user.id;
    req.role = verified.user.role;
    next();
    
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
};

export default authenticateJWT;
export { AuthRequest };
