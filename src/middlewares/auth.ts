import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

const secretKey = process.env.JWT_SECRET || "";

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({message: 'No token found'});

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json({message: 'Token has expired'});
        req.user = user as JwtPayload;
        next();
    });
};