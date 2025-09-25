import { Router } from 'express';
import { generateToken } from '../utils/jwt';
import { getDB } from '../../services/database.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JwtPayload } from "jsonwebtoken";


const router = Router();

router.post('/refresh', async (req, res) => {
    const secretKey = process.env.JWT_SECRET || "";
    const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);

    try {
        const db = getDB();
        const usersCollection = db.collection(process.env.USERS_COLLECTION_NAME || 'users');

        const { refreshToken } = req.body;
        let userInfo;
        try {
            userInfo = jwt.verify(refreshToken, secretKey) as JwtPayload;
        } catch (error) {
            return res.status(403).json({
                message: 'Unauthorized'
            });
        }
    
        const { _id, email } = userInfo;

        const user = await usersCollection.findOne({email});
        if (!user) return res.status(400).json({error: 'No user found'});
        
        const correctRefreshToken = await bcrypt.compare(refreshToken, user.refresh_token);
        if (!correctRefreshToken) return res.status(403).json({message: 'Incorrect token'});
    
        const newAccessToken = await generateToken(_id, email, "15m");
        const newRefreshToken = await generateToken(_id, email, "7d");
        const newHashedRefreshToken = await bcrypt.hash(newRefreshToken, saltRounds)

        await usersCollection.updateOne(
            {email}, 
            {$set: {
                refresh_token: newHashedRefreshToken
        }});

        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        })
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

export default router;